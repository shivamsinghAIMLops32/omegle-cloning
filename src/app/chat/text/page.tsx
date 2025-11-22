"use client";

import { useEffect, useState } from "react";
import ChatBox from "@/components/chat/ChatBox";
import { Users, MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { getSocket } from "@/lib/socket";

export default function TextChatPage() {
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [queueCount, setQueueCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<string>("Idle");
  const socket = getSocket();

  useEffect(() => {
    socket.connect();

    const handleMatchFound = () => {
      setConnectionStatus("Connected");
    };

    const handlePartnerDisconnected = () => {
      setConnectionStatus("Partner Disconnected");
    };

    socket.on("match_found", handleMatchFound);
    socket.on("partner_disconnected", handlePartnerDisconnected);

    return () => {
      socket.off("match_found", handleMatchFound);
      socket.off("partner_disconnected", handlePartnerDisconnected);
    };
  }, []);

  useEffect(() => {
    // Fetch stats from API
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        setOnlineUsers(data.onlineUsers || 0);
        setQueueCount(data.textQueue || 0);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Update every 5s

    return () => clearInterval(interval);
  }, []);

  const handleSkip = () => {
    setConnectionStatus("Searching...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
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
              <MessageSquare className="h-6 w-6 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">Text Chat</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-full px-4 py-2 backdrop-blur-sm">
              <span className="text-xs font-mono text-slate-400">Status:</span>
              <span className={`text-sm font-bold ${
                connectionStatus === "Connected" ? "text-emerald-400" : 
                connectionStatus === "Partner Disconnected" ? "text-red-400" : "text-amber-400"
              }`}>
                {connectionStatus}
              </span>
            </div>

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

        {/* Chat Container */}
        <div className="flex-1 max-w-5xl w-full mx-auto">
          <ChatBox mode="text" onNext={handleSkip} />
        </div>

        {/* Footer Tips */}
        <footer className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            💡 Tip: Add interests to match with like-minded strangers • Press Enter to send
          </p>
        </footer>
      </main>
    </div>
  );
}
