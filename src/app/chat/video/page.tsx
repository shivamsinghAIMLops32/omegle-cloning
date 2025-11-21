"use client";

import { useEffect, useState } from "react";
import ChatBox from "@/components/chat/ChatBox";
import VideoContainer from "@/components/chat/VideoContainer";
import { Users, Video, ArrowLeft, AlertCircle } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <main className="container mx-auto px-4 py-6 h-screen flex flex-col">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="text-slate-400 hover:text-white">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <div className="h-8 w-px bg-slate-700" />
            <div className="flex items-center gap-2">
              <Video className="h-6 w-6 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">Video Chat</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-full px-4 py-2">
              <Users className="h-4 w-4 text-green-400" />
              <span className="text-sm text-slate-300">
                <span className="font-semibold text-white">{onlineUsers.toLocaleString()}</span> online
              </span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-sm text-slate-300">
                <span className="font-semibold text-white">{queueCount}</span> in queue
              </span>
            </div>
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mb-6 max-w-5xl w-full mx-auto bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-300 mb-1">Camera Access Denied</h3>
              <p className="text-sm text-red-200">{error}</p>
              <p className="text-xs text-red-300 mt-2">
                Please enable camera and microphone permissions in your browser settings and refresh the page.
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row gap-6">
          {/* Video Section */}
          <div className="flex-1 min-h-[400px]">
            {error ? (
              <div className="h-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <Video className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p>Video unavailable</p>
                </div>
              </div>
            ) : (
              <VideoContainer stream={stream} />
            )}
          </div>

          {/* Chat Section */}
          <div className="w-full lg:w-[450px] flex flex-col min-h-[500px]">
            <ChatBox mode="video" />
          </div>
        </div>

        {/* Footer Tips */}
        <footer className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            🎥 Tip: Make sure your camera and mic are working • Be respectful
          </p>
        </footer>
      </main>
    </div>
  );
}
