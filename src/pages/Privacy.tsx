import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const Privacy = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <PageTransition>
      <div className="flex-1 container mx-auto max-w-3xl px-4 pt-24 pb-16">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: March 10, 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">1. Information We Collect</h2>
            <p>When you use Rapidx, we may collect the following information:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Files you upload (stored temporarily for sharing purposes)</li>
              <li>IP address and browser user-agent for security and abuse prevention</li>
              <li>Usage analytics such as upload counts and page views</li>
            </ul>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide and maintain the file sharing service</li>
              <li>Prevent abuse and enforce our terms of service</li>
              <li>Improve our platform and user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">3. Data Storage & Security</h2>
            <p>Your uploaded files are stored on secure cloud infrastructure. We implement industry-standard security measures including encryption in transit and at rest. Files are automatically deleted after the specified retention period.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">4. Third-Party Services</h2>
            <p>We may use third-party services for analytics and infrastructure. These services have their own privacy policies and we recommend reviewing them.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">5. Cookies</h2>
            <p>We use minimal cookies for essential functionality such as theme preferences. We do not use tracking cookies or sell your data to advertisers.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">6. Your Rights</h2>
            <p>You have the right to request deletion of your data, access the data we hold about you, and opt out of non-essential data collection. Contact us at privacy@rapidx.me for any requests.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">7. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify users of significant changes through our platform.</p>
          </section>
        </div>
      </div>
    </PageTransition>
    <Footer />
  </div>
);

export default Privacy;
