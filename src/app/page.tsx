"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from 'next/dynamic';

// Dynamically import icons to reduce initial bundle
const MessageSquare = dynamic(() => import('lucide-react').then(mod => ({ default: mod.MessageSquare })), { ssr: false });
const Video = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Video })), { ssr: false });
const Globe = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Globe })), { ssr: false });
const Shield = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Shield })), { ssr: false });
const Zap = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Zap })), { ssr: false });
const Users = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Users })), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              StrangerConnect
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-slate-300 hover:text-white transition">Features</Link>
            <Link href="#how-it-works" className="text-sm text-slate-300 hover:text-white transition">How It Works</Link>
            <Link href="#safety" className="text-sm text-slate-300 hover:text-white transition">Safety</Link>
            <Link href="/admin" className="text-sm text-slate-300 hover:text-white transition">Admin</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-24 pb-16 text-center">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-3xl" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              Talk to Strangers
            </span>
            <br />
            <span className="text-3xl md:text-5xl text-slate-400 font-medium">
              Anonymously & Instantly
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12">
            Connect with random people worldwide through text or video chat. 
            No registration required. Start a conversation in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              asChild
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 text-lg shadow-lg shadow-blue-500/50"
            >
              <Link href="/chat/text">
                <MessageSquare className="mr-2 h-5 w-5" />
                Start Text Chat
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              asChild
              className="w-full sm:w-auto border-slate-700 hover:bg-slate-800 px-8 py-6 text-lg"
            >
              <Link href="/chat/video">
                <Video className="mr-2 h-5 w-5" />
                Start Video Chat
              </Link>
            </Button>
          </div>

          <p className="text-sm text-slate-500 mt-6">
            🔒 100% Anonymous • No Sign-up Required • Free Forever
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Why Choose StrangerConnect?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-yellow-500" />}
            title="Instant Matching"
            description="Get matched with strangers in milliseconds. Our smart algorithm finds the perfect chat partner for you."
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-green-500" />}
            title="Safe & Moderated"
            description="AI-powered content filtering and active moderation keep conversations safe and respectful."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-blue-500" />}
            title="Tag-Based Matching"
            description="Add interests like 'tech', 'music', or 'gaming' to match with people who share your passions."
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-20 bg-slate-900/50 rounded-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <StepCard number="1" title="Choose Mode" description="Pick text or video chat based on your preference" />
          <StepCard number="2" title="Add Interests" description="Optional: Add tags to find like-minded strangers" />
          <StepCard number="3" title="Start Chatting" description="Get matched instantly and start your conversation!" />
        </div>
      </section>

      {/* Safety Section */}
      <section id="safety" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">
          Stay Safe Online
        </h2>
        <div className="max-w-3xl mx-auto bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
          <ul className="space-y-4 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-1">✓</span>
              <span><strong className="text-white">Never share personal information</strong> like your full name, address, phone number, or social media</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-1">✓</span>
              <span><strong className="text-white">Report inappropriate behavior</strong> using the flag button if someone is being offensive</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-1">✓</span>
              <span><strong className="text-white">Skip unwanted conversations</strong> using the "Next" button to find a better match</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-1">✓</span>
              <span><strong className="text-white">Be respectful</strong> and treat others the way you want to be treated</span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Meet Someone New?
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Join thousands of people having interesting conversations right now
          </p>
          <Button 
            size="lg"
            asChild
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-6 text-lg shadow-lg shadow-purple-500/50"
          >
            <Link href="/chat/text">Start Chatting Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 backdrop-blur-xl mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-5 w-5 text-blue-500" />
                <span className="font-bold text-white">StrangerConnect</span>
              </div>
              <p className="text-sm text-slate-400">
                Connect with strangers worldwide through anonymous text and video chat.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/chat/text" className="hover:text-white transition">Text Chat</Link></li>
                <li><Link href="/chat/video" className="hover:text-white transition">Video Chat</Link></li>
                <li><Link href="#features" className="hover:text-white transition">Features</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="#how-it-works" className="hover:text-white transition">How It Works</Link></li>
                <li><Link href="#safety" className="hover:text-white transition">Safety Tips</Link></li>
                <li><Link href="/admin" className="hover:text-white transition">Report Issue</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/community-guidelines" className="hover:text-white transition">Community Guidelines</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
            <p>© 2024 StrangerConnect. All rights reserved. Use responsibly and stay safe online.</p>
            <p className="mt-2">By using this service, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition group">
      <div className="mb-4 group-hover:scale-110 transition">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg shadow-blue-500/50">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}
