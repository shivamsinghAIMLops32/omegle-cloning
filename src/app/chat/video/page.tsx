"use client";

import { useEffect, useState } from "react";
import ChatBox from "@/components/chat/ChatBox";
import VideoContainer from "@/components/chat/VideoContainer";
import { Users, Video, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VideoChatPage() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    // Request camera/microphone access
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
        setError("Camera/microphone access denied. Please check permissions.");
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

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
              <VideoContainer stream={stream} />
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
              Pro tip: Use <kbd className="px-2 py-1 bg-slate-800 rounded text-xs border border-slate-700">Space</kbd> to mute/unmute quickly
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

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(10px, 10px) scale(1.05); }
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

        .animate-blob {
          animation: blob 15s ease-in-out infinite;
        }

        .animation-delay-2000 {
  animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
