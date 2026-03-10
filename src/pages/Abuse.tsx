import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const Abuse = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <PageTransition>
      <div className="flex-1 container mx-auto max-w-3xl px-4 pt-24 pb-16">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Report Abuse</h1>
        </div>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          If you've found content on Rapidx that violates our terms of service or is illegal, please report it. We take all reports seriously and will investigate promptly.
        </p>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display font-semibold text-foreground mb-2">What to include in your report</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>The URL/link of the offending content</li>
              <li>A description of why the content violates our terms</li>
              <li>Your contact information for follow-up</li>
              <li>Any supporting evidence or documentation</li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display font-semibold text-foreground mb-2">How to report</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Send your abuse report to our dedicated team. We aim to respond within 24 hours.
            </p>
            <Button asChild>
              <a href="mailto:abuse@rapidx.me">Email abuse@rapidx.me</a>
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
    <Footer />
  </div>
);

export default Abuse;
