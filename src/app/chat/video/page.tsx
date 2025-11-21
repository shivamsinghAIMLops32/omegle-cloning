"use client";

import { useEffect, useState } from "react";
import ChatBox from "@/components/chat/ChatBox";
import VideoContainer from "@/components/chat/VideoContainer";
import { Users, Video, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSocket } from "@/lib/socket";

export default function VideoChatPage() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [queueCount, setQueueCount] = useState(0);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  
  const socket = getSocket();

  useEffect(() => {
    // Request camera/microphone access
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
        setError("Camera/microphone access denied. Please check permissions.");
      });

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!localStream) return;

    socket.connect();

    // WebRTC signaling handlers
    const handleWebRTCOffer = async (data: { offer: RTCSessionDescriptionInit, senderId: string }) => {
      console.log("Received WebRTC offer");
      
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      });

      // Add local stream tracks
      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

      // Handle incoming remote stream
      pc.ontrack = (event) => {
        console.log("Received remote track");
        setRemoteStream(event.streams[0]);
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("webrtc_ice_candidate", { candidate: event.candidate });
        }
      };

      await pc.setRemoteDescription(data.offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("webrtc_answer", { answer });
      setPeerConnection(pc);
    };

    const handleWebRTCAnswer = async (data: { answer: RTCSessionDescriptionInit }) => {
      console.log("Received WebRTC answer");
      if (peerConnection) {
        await peerConnection.setRemoteDescription(data.answer);
      }
    };

    const handleWebRTCIceCandidate = async (data: { candidate: RTCIceCandidate }) => {
      console.log("Received ICE candidate");
      if (peerConnection) {
        await peerConnection.addIceCandidate(data.candidate);
      }
    };

    const handleMatchFound = async () => {
      console.log("Match found, initiating WebRTC");
      
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      });

      // Add local stream tracks
      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

      // Handle incoming remote stream
      pc.ontrack = (event) => {
        console.log("Received remote track");
        setRemoteStream(event.streams[0]);
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("webrtc_ice_candidate", { candidate: event.candidate });
        }
      };

      // Create and send offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("webrtc_offer", { offer });
      
      setPeerConnection(pc);
    };

    const handlePartnerDisconnected = () => {
      console.log("Partner disconnected");
      setRemoteStream(null);
      if (peerConnection) {
        peerConnection.close();
        setPeerConnection(null);
      }
    };

    socket.on("match_found", handleMatchFound);
    socket.on("webrtc_offer", handleWebRTCOffer);
    socket.on("webrtc_answer", handleWebRTCAnswer);
    socket.on("webrtc_ice_candidate", handleWebRTCIceCandidate);
    socket.on("partner_disconnected", handlePartnerDisconnected);

    return () => {
      socket.off("match_found", handleMatchFound);
      socket.off("webrtc_offer", handleWebRTCOffer);
      socket.off("webrtc_answer", handleWebRTCAnswer);
      socket.off("webrtc_ice_candidate", handleWebRTCIceCandidate);
      socket.off("partner_disconnected", handlePartnerDisconnected);
    };
  }, [localStream, peerConnection]);

  useEffect(() => {
    // Fetch stats from API
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setOnlineUsers(data.onlineUsers || 0);
        setQueueCount(data.videoQueue || 0);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-3xl animate-float" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full mix-blend-screen filter blur-3xl animate-float-delayed" />
        <div className="absolute bottom-1/4 left-1/2 w-[450px] h-[450px] bg-pink-600/20 rounded-full mix-blend-screen filter blur-3xl animate-float-slow" />
        
        {/* Grain Texture Overlay */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] mix-blend-overlay" />
      </div>

      <main className="container mx-auto px-4 py-6 h-screen flex flex-col relative z-10">
        {/* Floating Header */}
        <header className="mb-6 flex items-center justify-between backdrop-blur-xl bg-slate-900/30 rounded-2xl px-6 py-4 border border-white/5 shadow-2xl">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              asChild 
              className="text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <div className="h-6 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            <div className="flex items-center gap-2">
              <div className="relative">
                <Video className="h-6 w-6 text-purple-400" />
                <Sparkles className="h-3 w-3 text-purple-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Video Chat
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-full px-4 py-2 backdrop-blur-sm">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
              <Users className="h-4 w-4 text-emerald-300" />
              <span className="text-sm text-slate-200">
                <span className="font-bold text-white">{onlineUsers.toLocaleString()}</span> online
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-full px-4 py-2 backdrop-blur-sm">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse shadow-lg shadow-amber-400/50" />
              <span className="text-sm text-slate-200">
                <span className="font-bold text-white">{queueCount}</span> waiting
              </span>
            </div>
          </div>
        </header>

        {/* Main Split Layout */}
        <div className="flex-1 flex gap-6 min-h-0">
          {/* Video Section - 60% width */}
          <div className="flex-[3] flex flex-col min-w-0">
            {error ? (
              <div className="h-full bg-gradient-to-br from-red-950/50 to-slate-950/50 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <Video className="h-10 w-10 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-red-300 mb-2">Camera Access Required</h3>
                <p className="text-red-200/80 max-w-md mb-1">{error}</p>
                <p className="text-sm text-red-300/60 mt-4">
                  💡 Enable camera permissions in your browser settings and refresh the page
                </p>
              </div>
            ) : (
              <VideoContainer stream={localStream} remoteStream={remoteStream} />
            )}
          </div>

          {/* Chat Section - 40% width */}
          <div className="flex-[2] flex flex-col min-w-0 min-h-0">
            <ChatBox mode="video" />
          </div>
        </div>

        {/* Floating Tips */}
        <footer className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-full px-6 py-3">
            <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
            <p className="text-sm text-slate-300">
              Video chat powered by WebRTC • Your connection is peer-to-peer and secure
            </p>
          </div>
        </footer>
      </main>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(5deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-30px, 30px) rotate(-5deg); }
          66% { transform: translate(20px, -20px) rotate(5deg); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15px, -15px) scale(1.1); }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 30s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
