// Optimized WebRTC configuration with multiple ICE servers
export const webrtcConfig: RTCConfiguration = {
  iceServers: [
    // Google STUN servers (free, fast)
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    
    // Additional public STUN servers for redundancy
    { urls: 'stun:stun.stunprotocol.org:3478' },
    
    // TURN server configuration (add your own for production)
    // {
    //   urls: 'turn:your-turn-server.com:3478',
    //   username: 'user',
    //   credential: 'pass'
    // }
  ],
  
  // Trickle ICE optimization - send candidates as soon as they're found
  iceCandidatePoolSize: 10,
  
  // Performance optimizations
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require',
  
  // Audio/Video constraints for optimal quality
  iceTransportPolicy: 'all' // Use 'relay' to force TURN for extra privacy
};

// Optimized media constraints for better performance
export const mediaConstraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    sampleRate: 48000,
  },
  video: {
    width: { ideal: 1280, max: 1920 },
    height: { ideal: 720, max: 1080 },
    frameRate: { ideal: 30, max: 30 },
    facingMode: 'user'
  }
};

// Lower quality for slower connections
export const lowBandwidthConstraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
  video: {
    width: { ideal: 640, max: 1280 },
    height: { ideal: 480, max: 720 },
    frameRate: { ideal: 24, max: 30 },
  }
};

/**
 * Create optimized peer connection with retry logic
 */
export async function createOptimizedPeerConnection(
  onTrack: (stream: MediaStream) => void,
  onIceCandidate: (candidate: RTCIceCandidate) => void,
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void
): Promise<RTCPeerConnection> {
  const pc = new RTCPeerConnection(webrtcConfig);

  // Track handler
  pc.ontrack = (event) => {
    if (event.streams && event.streams[0]) {
      onTrack(event.streams[0]);
    }
  };

  // ICE candidate handler (trickle ICE)
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      onIceCandidate(event.candidate);
    }
  };

  // Connection state monitoring
  pc.onconnectionstatechange = () => {
    console.log('[WebRTC] Connection state:', pc.connectionState);
    onConnectionStateChange?.(pc.connectionState);
    
    // Auto-restart on failure
    if (pc.connectionState === 'failed') {
      console.log('[WebRTC] Connection failed, attempting ICE restart...');
      pc.restartIce();
    }
  };

  // ICE connection state monitoring
  pc.oniceconnectionstatechange = () => {
    console.log('[WebRTC] ICE connection state:', pc.iceConnectionState);
  };

  return pc;
}

/**
 * Apply bandwidth optimization based on network conditions
 */
export async function optimizeBandwidth(
  pc: RTCPeerConnection,
  maxBandwidth: number = 2500 // kbps
) {
  const senders = pc.getSenders();
  
  for (const sender of senders) {
    if (sender.track?.kind === 'video') {
      const parameters = sender.getParameters();
      
      if (!parameters.encodings) {
        parameters.encodings = [{}];
      }
      
      parameters.encodings[0].maxBitrate = maxBandwidth * 1000; // Convert to bps
      
      await sender.setParameters(parameters);
      console.log(`[WebRTC] Bandwidth limited to ${maxBandwidth} kbps`);
    }
  }
}
