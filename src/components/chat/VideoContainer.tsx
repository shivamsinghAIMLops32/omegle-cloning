"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, Maximize2, Minimize2 } from "lucide-react";

interface VideoContainerProps {
  stream: MediaStream | null;
  remoteStream?: MediaStream | null;
}

export default function VideoContainer({ stream, remoteStream }: VideoContainerProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (localVideoRef.current && stream) {
      localVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'} bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950 rounded-2xl overflow-hidden border border-indigo-500/20`}>
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Remote Video (Main) */}
      <div className="relative w-full h-full flex items-center justify-center">
        {!remoteStream ? (
          <div className="flex flex-col items-center justify-center gap-4 text-center p-8 z-10">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                <Video className="h-12 w-12 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full animate-ping opacity-20" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Waiting for stranger...</h3>
              <p className="text-indigo-300 text-sm">Your camera is ready. They'll appear here when connected.</p>
            </div>
          </div>
        ) : null}
        
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Remote Video Border Glow */}
        {remoteStream && (
          <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-2xl pointer-events-none" />
        )}
      </div>

      {/* Local Video (Picture-in-Picture) */}
      <div className={`absolute ${isFullscreen ? 'bottom-6 right-6' : 'bottom-4 right-4'} transition-all duration-300 group`}>
        <div className="relative w-48 h-36 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden border-2 border-indigo-400/50 shadow-2xl transform hover:scale-105 transition-transform">
          {/* Glowing border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity blur-sm" />
          
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform scale-x-[-1] relative z-10"
          />
          
          {/* You label */}
          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md z-20">
            <span className="text-xs font-semibold text-white">You</span>
          </div>

          {isVideoOff && (
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center z-10">
              <VideoOff className="h-8 w-8 text-slate-400" />
            </div>
          )}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 bg-black/60 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 shadow-2xl z-20">
        <Button
          variant={isMuted ? "destructive" : "secondary"}
          size="icon"
          onClick={toggleMute}
          className="rounded-full w-12 h-12 transition-all hover:scale-110"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>

        <Button
          variant={isVideoOff ? "destructive" : "secondary"}
          size="icon"
          onClick={toggleVideo}
          className="rounded-full w-12 h-12 transition-all hover:scale-110"
          title={isVideoOff ? "Turn on camera" : "Turn off camera"}
        >
          {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
        </Button>

        <Button
          variant="secondary"
          size="icon"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="rounded-full w-12 h-12 transition-all hover:scale-110"
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}
