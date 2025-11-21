"use client";

import { useEffect, useState } from "react";
import ChatBox from "@/components/chat/ChatBox";
import VideoContainer from "@/components/chat/VideoContainer";

export default function VideoChatPage() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
        setError("Could not access camera/microphone. Please check permissions.");
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-6xl h-[85vh] flex flex-col lg:flex-row gap-4">
        {/* Video Section */}
        <div className="flex-1 flex flex-col min-h-[300px]">
          {error ? (
            <div className="flex-1 flex items-center justify-center bg-black rounded-lg text-red-500">
              {error}
            </div>
          ) : (
            <VideoContainer stream={stream} />
          )}
        </div>

        {/* Chat Section */}
        <div className="w-full lg:w-[400px] flex flex-col">
          <ChatBox mode="video" />
        </div>
      </div>
    </main>
  );
}
