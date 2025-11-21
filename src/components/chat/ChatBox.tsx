"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, StopCircle, Flag } from "lucide-react";
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
import { getSocket } from "@/lib/socket";

type Message = {
  id: string;
  sender: "me" | "stranger" | "system";
  text: string;
  timestamp: number;
};

export default function ChatBox({ mode = "text" }: { mode?: "text" | "video" }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [tags, setTags] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const socket = getSocket();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.connect();

    function onConnect() {
      setIsConnected(true);
      console.log("Connected to socket");
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("Disconnected from socket");
    }

    function onMessage(data: { text: string; sender: "stranger" | "system" }) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          sender: data.sender,
          text: data.text,
          timestamp: Date.now(),
        },
      ]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", onMessage);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
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
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleFindStranger = () => {
    setIsSearching(true);
    setMessages([]);
    const tagList = tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
    socket.emit("join_queue", { mode, tags: tagList });
    // Mock finding a stranger for now
    setTimeout(() => {
      setIsSearching(false);
      setMessages([
        {
          id: "sys1",
          sender: "system",
          text: "You're now chatting with a random stranger. Say hi!",
          timestamp: Date.now(),
        },
      ]);
    }, 1000);
  };

  const handleNext = () => {
    // Leave current room and immediately rejoin queue
    socket.emit("leave_room");
    setMessages([]);
    setIsSearching(true);
    
    const tagList = tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
    socket.emit("join_queue", { mode, tags: tagList });
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
      alert("Report submitted.");
    } catch (error) {
      console.error(error);
      alert("Failed to submit report.");
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-background border rounded-lg overflow-hidden shadow-sm">
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
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
                className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                  msg.sender === "me"
                    ? "bg-primary text-primary-foreground"
                    : msg.sender === "system"
                    ? "bg-muted text-muted-foreground text-xs italic"
                    : "bg-muted"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-card flex gap-2">
        {messages.length === 0 && !isSearching ? (
          <Button disabled className="w-full" variant="secondary">
            Searching for a stranger...
          </Button>
        ) : (
          <div className="flex flex-col w-full gap-2">
            {messages.length === 0 && (
              <Input
                placeholder="Add interests (optional, comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mb-2"
              />
            )}
            <Button onClick={handleFindStranger} className="w-full" size="lg">
              Start Chatting
            </Button>
          </div>
        )}
        {messages.length > 0 && !isSearching && (
          <>
            <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Report Stranger">
                  <Flag className="h-4 w-4 text-destructive" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Report Stranger</DialogTitle>
                  <DialogDescription>
                    Please describe why you are reporting this user.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Input
                      id="reason"
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      placeholder="e.g., Inappropriate behavior, spam..."
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
              variant="destructive"
              size="icon"
              onClick={handleNext}
              title="Next (Skip to new stranger)"
            >
              <StopCircle className="h-4 w-4" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1"
              autoFocus
            />
            <Button onClick={handleSend} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
