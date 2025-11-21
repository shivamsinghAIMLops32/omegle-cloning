import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-slate-400 mb-8">Last updated: November 21, 2024</p>

        <div className="space-y-8 text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using StrangerChat, you accept and agree to be bound by the terms and 
              provision of this agreement. If you do not agree to these Terms of Service, please do not 
              use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
            <p>
              StrangerChat provides an anonymous chat platform that allows users to connect with random 
              strangers through text and video communication. The service is provided "as is" without any 
              warranties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. User Conduct</h2>
            <p className="mb-4">You agree NOT to use the service to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Harass, abuse, or harm another person</li>
              <li>Share explicit, pornographic, or inappropriate content</li>
              <li>Impersonate any person or entity</li>
              <li>Share personal information of others without consent</li>
              <li>Engage in any illegal activities</li>
              <li>Spam or flood the chat with repetitive messages</li>
              <li>Attempt to bypass any security measures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Age Restrictions</h2>
            <p>
              You must be at least 18 years old to use this service. If you are between 13 and 18, you may 
              only use this service with parental or guardian consent. Users under 13 are strictly prohibited 
              from using this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Privacy and Anonymity</h2>
            <p>
              While we do not require registration, we collect minimal data for service functionality and 
              moderation purposes. Chats are not recorded, but we reserve the right to monitor conversations 
              for safety and compliance. See our Privacy Policy for more details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Moderation and Enforcement</h2>
            <p>
              We actively moderate the platform to ensure user safety. We reserve the right to ban users 
              who violate these terms. Bans may be temporary or permanent depending on the severity of 
              the violation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Disclaimer of Warranties</h2>
            <p>
              StrangerChat is provided "as is" and "as available" without warranties of any kind. We do not 
              guarantee the service will be uninterrupted, secure, or error-free. Use at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
            <p>
              StrangerChat and its operators shall not be liable for any damages arising from the use or 
              inability to use the service, including but not limited to direct, indirect, incidental, or 
              consequential damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective immediately 
              upon posting. Continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Contact</h2>
            <p>
              If you have questions about these Terms of Service, please contact us through the admin panel 
              or report system.
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
