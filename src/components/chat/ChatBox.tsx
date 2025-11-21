"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, SkipForward, Flag, Loader2, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getSocket } from "@/lib/socket";

type Message = {
  id: string;
  sender: "me" | "stranger" | "system";
  text: string;
  timestamp: number;
};

type ChatState = "idle" | "searching" | "connected" | "disconnected";

export default function ChatBox({ mode = "text" }: { mode?: "text" | "video" }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [tags, setTags] = useState("");
  const [chatState, setChatState] = useState<ChatState>("idle");
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const socket = getSocket();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.connect();

    const onMessage = (data: { text: string; sender: "stranger" | "system" }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          sender: data.sender,
          text: data.text,
          timestamp: Date.now(),
        },
      ]);
      setIsTyping(false);
    };

    const onMatchFound = () => {
      setChatState("connected");
      setMessages([
        {
          id: "match",
          sender: "system",
          text: "💬 You're now chatting with a stranger!",
          timestamp: Date.now(),
        },
      ]);
    };

    const onPartnerDisconnected = () => {
      setChatState("disconnected");
      setMessages((prev) => [
        ...prev,
        {
          id: "disconnect",
          sender: "system",
          text: "❌ Stranger has disconnected.",
          timestamp: Date.now(),
        },
      ]);
    };

    const onPartnerTyping = () => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    };

    socket.on("message", onMessage);
    socket.on("match_found", onMatchFound);
    socket.on("partner_disconnected", onPartnerDisconnected);
    socket.on("partner_typing", onPartnerTyping);

    return () => {
      socket.off("message", onMessage);
      socket.off("match_found", onMatchFound);
      socket.off("partner_disconnected", onPartnerDisconnected);
      socket.off("partner_typing", onPartnerTyping);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const addSystemMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        sender: "system",
        text,
        timestamp: Date.now(),
      },
    ]);
  };

  const handleSend = () => {
    if (!input.trim() || chatState !== "connected") return;

    const newMessage: Message = {
      id: Math.random().toString(36).substring(7),
      sender: "me",
      text: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    socket.emit("message", { text: input });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFindStranger = () => {
    setChatState("searching");
    setMessages([]);
    const tagList = tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
    socket.emit("join_queue", { mode, tags: tagList });
    addSystemMessage("🔍 Searching for a stranger...");
  };

  const handleNext = () => {
    socket.emit("leave_room");
    setChatState("searching");
    setMessages([]);
    
    const tagList = tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
    socket.emit("join_queue", { mode, tags: tagList });
    addSystemMessage("🔍 Finding you a new stranger...");
  };

  const handleReport = async () => {
    try {
      await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: reportReason,
          reportedId: "partner-socket-id-placeholder",
        }),
      });
      setIsReportOpen(false);
      setReportReason("");
      addSystemMessage("✓ Report submitted successfully.");
    } catch (error) {
      console.error(error);
      addSystemMessage("✗ Failed to submit report.");
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <User className="h-6 w-6 text-blue-400" />
              {chatState === "connected" && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white">
                {chatState === "idle" && "Ready to Chat"}
                {chatState === "searching" && "Searching..."}
                {chatState === "connected" && "Connected to Stranger"}
                {chatState === "disconnected" && "Disconnected"}
              </h3>
              {chatState === "connected" && isTyping && (
                <p className="text-xs text-blue-400 animate-pulse">Stranger is typing...</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {chatState === "searching" && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Searching
              </Badge>
            )}
            {chatState === "connected" && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/50">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                Online
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6 bg-slate-950/50">
        <div className="flex flex-col gap-3">
          {messages.length === 0 && chatState === "idle" && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Start a Conversation</h3>
              <p className="text-slate-400 text-sm max-w-md">
                Add interests below to match with like-minded strangers, or start chatting  immediately!
              </p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "me"
                  ? "justify-end"
                  : msg.sender === "system"
                  ? "justify-center"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.sender === "me"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                    : msg.sender === "system"
                    ? "bg-slate-800/50 text-slate-300 text-xs px-6 py-2"
                    : "bg-slate-800 text-slate-100 border border-slate-700"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && chatState === "connected" && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 flex gap-1">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-slate-800 bg-slate-900/80 backdrop-blur-xl p-4">
        {chatState === "idle" && (
          <div className="flex flex-col gap-3">
            <Input
              placeholder="Add interests (e.g., music, gaming, tech)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            />
            <Button 
              onClick={handleFindStranger} 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg" 
              size="lg"
            >
              Start Chatting
            </Button>
          </div>
        )}

        {chatState === "searching" && (
          <Button disabled className="w-full" size="lg">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Searching for a stranger...
          </Button>
        )}

        {(chatState === "connected" || chatState === "disconnected") && (
          <div className="flex gap-2">
            <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-red-500/20 hover:text-red-400"
                  title="Report Stranger"
                >
                  <Flag className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Report Stranger</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Please describe why you're reporting this user.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="reason" className="text-slate-300">Reason</Label>
                    <Input
                      id="reason"
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      placeholder="e.g., Inappropriate behavior, spam..."
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsReportOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleReport}>
                    Submit Report
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="hover:bg-blue-500/20 hover:text-blue-400"
              title="Next (Skip to new stranger)"
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={chatState === "disconnected" ? "Stranger disconnected..." : "Type a message..."}
              className="flex-1 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              autoFocus
              disabled={chatState === "disconnected"}
            />

            <Button 
              onClick={handleSend} 
              size="icon"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={chatState === "disconnected" || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
