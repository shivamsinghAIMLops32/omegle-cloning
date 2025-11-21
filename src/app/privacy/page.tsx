import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-slate-400 mb-8">Last updated: November 21, 2024</p>

        <div className="space-y-8 text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
            <p>
              StrangerChat ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, and safeguard your information when you use our anonymous chat service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
            <h3 className="text-lg font-semibold text-white mt-4 mb-2">2.1 Automatically Collected Information</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">IP Address:</strong> Hashed for rate limiting and ban enforcement</li>
              <li><strong className="text-white">Browser Fingerprint:</strong> Used to identify and ban rule violators</li>
              <li><strong className="text-white">Connection Metadata:</strong> Timestamps, session duration, chat mode (text/video)</li>
              <li><strong className="text-white">User Agent:</strong> Browser and device information for compatibility</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-4 mb-2">2.2 User-Provided Information</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Interest Tags:</strong> Optional tags you provide for matching</li>
              <li><strong className="text-white">Reports:</strong> Information you submit when reporting another user</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use the collected information for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Matching you with other users based on preferences</li>
              <li>Preventing abuse and enforcing bans</li>
              <li>Rate limiting to prevent spam</li>
              <li>Moderating content for safety and compliance</li>
              <li>Improving service performance and reliability</li>
              <li>Analyzing usage patterns (in aggregate form)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Chat Content and Recording</h2>
            <p className="mb-4">
              <strong className="text-white">We do NOT record or store your chat messages.</strong> All conversations 
              are ephemeral and exist only in real-time. However:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>We may temporarily monitor chats for moderation purposes</li>
              <li>Automated profanity filtering is applied to text messages</li>
              <li>Reported content may be temporarily cached for review</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Data Storage and Retention</h2>
            <p className="mb-4">We store minimal data:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Session Data:</strong> Stored in Redis, expires after 24 hours</li>
              <li><strong className="text-white">Ban Records:</strong> Stored permanently in PostgreSQL</li>
              <li><strong className="text-white">Reports:</strong> Stored for moderation and legal compliance</li>
              <li><strong className="text-white">Analytics:</strong> Aggregated, non-identifiable usage stats</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies and Tracking</h2>
            <p>
              We use minimal cookies for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Admin authentication (httpOnly, secure cookies)</li>
              <li>Session management</li>
            </ul>
            <p className="mt-4">
              We do NOT use third-party tracking cookies or analytics services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Third-Party Services</h2>
            <p>
              We may use third-party services for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Infrastructure hosting (servers, databases)</li>
              <li>Content moderation (NSFW detection, profanity filtering)</li>
              <li>VPN/Proxy detection (if implemented)</li>
            </ul>
            <p className="mt-4">
              These services have their own privacy policies and we are not responsible for their practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access the minimal data we collect about you</li>
              <li>Request deletion of your data (IP hash, fingerprint)</li>
              <li>Opt-out of the service by simply not using it</li>
            </ul>
            <p className="mt-4">
              Due to the anonymous nature of our service, data requests may be difficult to fulfill without 
              identifiable information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Children's Privacy</h2>
            <p>
              Our service is not intended for children under 13. We do not knowingly collect information from 
              children under 13. If we discover such data, we will delete it immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Security</h2>
            <p>
              We implement industry-standard security measures including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>HTTPS encryption for all connections</li>
              <li>Secure WebSocket connections (WSS)</li>
              <li>IP address hashing (not stored in plain text)</li>
              <li>Rate limiting to prevent abuse</li>
              <li>Regular security audits</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with 
              an updated "Last updated" date. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Us</h2>
            <p>
              For privacy concerns or data requests, please contact us through the admin panel or report system.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800">
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
