import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <h1 className="text-4xl font-bold mb-8">Community Guidelines</h1>
        <p className="text-slate-400 mb-8">Last updated: November 21, 2024</p>

        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
           <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-500 mb-2">Important Notice</h3>
              <p className="text-slate-300">
                Violations of these guidelines may result in immediate and permanent bans. We take user safety seriously.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8 text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Be Respectful</h2>
            <p className="mb-4">Treat everyone with dignity and respect. This includes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Using polite and courteous language</li>
              <li>Respecting boundaries when someone says "no"</li>
              <li>Not making offensive comments about race, religion, gender, sexual orientation, or disabilities</li>
              <li>Accepting that not everyone wants to continue the conversation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">No Nudity or Sexual Content</h2>
            <p className="mb-4">This is a general chat platform, NOT an adult site:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>No nudity or sexually explicit content on video</li>
              <li>No sexual solicitation or propositions</li>
              <li>No sharing of pornographic material or links</li>
              <li>No discussions of explicit sexual topics with minors</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Protect Privacy</h2>
            <p className="mb-4">Respect your own privacy and others':</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Do NOT share your full name, address, phone number, or email</li>
              <li>Do NOT ask others for their personal information</li>
              <li>Do NOT share social media profiles unless you're comfortable</li>
              <li>Be cautious about revealing your location or workplace</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">No Harassment or Bullying</h2>
            <p className="mb-4">Creating a safe environment is our priority:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>No repeated unwanted contact or persistent messages</li>
              <li>No threats, intimidation, or blackmail</li>
              <li>No doxxing (sharing someone's personal information)</li>
              <li>No hate speech, slurs, or discriminatory language</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">No Spam or Commercial Activity</h2>
            <p className="mb-4">Keep conversations genuine:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>No advertising products or services</li>
              <li>No spam bots or automated messages</li>
              <li>No pyramid schemes or get-rich-quick promotions</li>
              <li>No soliciting money or donations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">No Illegal Activities</h2>
            <p className="mb-4">Do not use this platform for illegal purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>No drug dealing or discussion of illegal substances</li>
              <li>No sharing or requesting illegal content</li>
              <li>No hacking, phishing, or scamming attempts</li>
              <li>No copyright infringement or piracy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Age Restrictions</h2>
            <p className="mb-4">Protect minors:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You must be at least 18 to use this service alone</li>
              <li>Users 13-17 must have parental permission</li>
              <li>Do NOT engage in sexual conversation with anyone under 18</li>
              <li>Report suspected minors engaging in inappropriate behavior</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Use the Report Button</h2>
            <p className="mb-4">Help us maintain a safe community:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Click the flag icon to report inappropriate behavior</li>
              <li>Provide a detailed reason for your report</li>
              <li>Do NOT abuse the report system</li>
              <li>False reports may result in your own ban</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Consequences of Violations</h2>
            <p className="mb-4">Depending on severity, violations may result in:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Warning:</strong> First-time minor offenses</li>
              <li><strong className="text-white">Temporary Ban:</strong> 24 hours to 7 days for moderate violations</li>
              <li><strong className="text-white">Permanent Ban:</strong> Serious violations (nudity, harassment, illegal activity)</li>
              <li><strong className="text-white">Legal Action:</strong> Extremely serious violations may be reported to authorities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Remember</h2>
            <p>
              The golden rule: <strong className="text-white">Treat others the way you want to be treated.</strong> This 
              platform is meant to be fun, safe, and respectful. Let's keep it that way together!
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
