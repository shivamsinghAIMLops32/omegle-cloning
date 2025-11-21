"use client";

import ChatBox from "@/components/chat/ChatBox";

export default function TextChatPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-4xl h-[80vh] flex flex-col">
        <header className="mb-4 flex items-center justify-between text-white">
          <h1 className="text-2xl font-bold">Text Chat</h1>
          <div className="text-sm text-gray-400">Online: 1200+</div>
        </header>
        <ChatBox mode="text" />
      </div>
    </main>
  );
}
