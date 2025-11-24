import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "StrangerConnect - Anonymous Video & Text Chat with Strangers",
    template: "%s | StrangerConnect"
  },
  description: "Connect with random strangers worldwide through anonymous video and text chat. Free, instant, and private conversations with common interests matching.",
  keywords: [
    "anonymous chat",
    "random video chat",
    "stranger chat",
    "talk to strangers",
    "free chat",
    "omegle alternative",
    "chatroulette",
    "video chat",
    "text chat",
    "meet new people",
    "anonymous conversation"
  ],
  authors: [{ name: "StrangerConnect" }],
  creator: "StrangerConnect",
  publisher: "StrangerConnect",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "StrangerConnect - Anonymous Video & Text Chat with Strangers",
    description: "Connect with random strangers worldwide through free, instant, and anonymous video and text chat. Match based on common interests.",
    siteName: "StrangerConnect",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StrangerConnect - Connect Anonymously"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "StrangerConnect - Anonymous Chat with Strangers",
    description: "Free anonymous video & text chat. Connect instantly with strangers worldwide.",
    images: ["/og-image.png"],
    creator: "@strangerconnect"
  },
  icons: {
    icon: "/icon.svg"
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code"
  },
  category: "social"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body 
        className={cn(inter.className, "min-h-screen bg-background font-sans antialiased")}
        suppressHydrationWarning
      >
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #475569',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#f1f5f9',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#f1f5f9',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
