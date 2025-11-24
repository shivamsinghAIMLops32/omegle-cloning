// NSFW Detection Hook for Video Chat
// Add this to your video chat page after the localStream useEffect

import { useEffect } from 'react';

/**
 * Hook to monitor remote video stream for NSFW content  
 * Add inside your VideoChatPage component
 */
export function useNSFWMonitoring({
  remoteStream,
  isEnabled,
  onViolation,
  sensitivity = 'medium'
}: {
  remoteStream: MediaStream | null;
  isEnabled: boolean;
  onViolation: () => void;
  sensitivity?: 'low' | 'medium' | 'high';
}) {
  useEffect(() => {
    if (!remoteStream || !isEnabled) return;

    let videoElement: HTMLVideoElement | null = null;
    let intervalId: NodeJS.Timeout | null = null;
    let modelLoaded = false;

    const setupNSFWDetection = async () => {
      try {
        // Create hidden video element for analysis
        videoElement = document.createElement('video');
        videoElement.srcObject = remoteStream;
        videoElement.play();
        videoElement.style.display = 'none';
        document.body.appendChild(videoElement);

        // Load NSFW model
        await loadNSFWModel();
        modelLoaded = true;

        // Start monitoring every 3 seconds
        intervalId = setInterval(async () => {
          if (!videoElement || videoElement.readyState !== 4) return;

          try {
            const result = await analyzeVideo(videoElement, sensitivity);
            
            if (result.isNSFW) {
              console.warn('[NSFW] Violation detected:', result);
              onViolation();
            }
          } catch (error) {
            console.error('[NSFW] Analysis error:', error);
          }
        }, 3000); // Check every 3 seconds

      } catch (error) {
        console.error('[NSFW] Setup error:', error);
      }
    };

    setupNSFWDetection();

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (videoElement) {
        videoElement.pause();
        videoElement.srcObject = null;
        document.body.removeChild(videoElement);
      }
      if (modelLoaded) {
        disposeNSFWModel();
      }
    };
  }, [remoteStream, isEnabled, onViolation, sensitivity]);
}
