import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const Terms = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <PageTransition>
      <div className="flex-1 container mx-auto max-w-3xl px-4 pt-24 pb-16">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: March 10, 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>By accessing or using Rapidx ("the Service"), you agree to be bound by these terms. If you do not agree, do not use the Service.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">2. Service Description</h2>
            <p>Rapidx provides a file upload and sharing platform. Users can upload files up to 50MB, generate shareable download links, and access files through our API.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">3. Acceptable Use</h2>
            <p>You agree NOT to use the Service to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Upload, store, or share illegal content</li>
              <li>Distribute malware, viruses, or harmful software</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Harass, abuse, or threaten other users</li>
              <li>Attempt to circumvent security measures or abuse the platform</li>
              <li>Use automated tools to bulk-upload or scrape content</li>
            </ul>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">4. File Retention</h2>
            <p>Files uploaded to Rapidx may be subject to automatic deletion after a retention period. We do not guarantee permanent storage of any uploaded content.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">5. API Usage</h2>
            <p>Use of the Rapidx API is subject to rate limits. Excessive or abusive API usage may result in temporary or permanent suspension of access.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">6. Disclaimer of Warranties</h2>
            <p>The Service is provided "as is" without warranties of any kind, express or implied. We do not guarantee uninterrupted or error-free operation.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">7. Limitation of Liability</h2>
            <p>Rapidx shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use the Service.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">8. Termination</h2>
            <p>We reserve the right to suspend or terminate access to the Service at any time for violations of these terms or for any reason at our discretion.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground">9. Contact</h2>
            <p>For questions about these terms, contact us at legal@rapidx.me.</p>
          </section>
        </div>
      </div>
    </PageTransition>
    <Footer />
  </div>
);

export default Terms;
