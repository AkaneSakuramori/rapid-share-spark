import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const faqs = [
  {
    q: "What is Rapidx?",
    a: "Rapidx is a fast, secure file sharing platform. Upload any file up to 50MB and instantly get a shareable download link — no account required.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. You can upload and share files without signing up. An account is only needed if you want API access or to manage your uploads.",
  },
  {
    q: "What file types are supported?",
    a: "Rapidx supports all file types — images, documents, videos, archives, and more. There are no restrictions on file format.",
  },
  {
    q: "What is the maximum file size?",
    a: "The current maximum file size is 50MB per upload. We're working on increasing this limit for Pro users.",
  },
  {
    q: "How long are files stored?",
    a: "Files are stored for 30 days by default. After expiration, they are permanently deleted from our servers.",
  },
  {
    q: "Is my data encrypted?",
    a: "Yes. All transfers use TLS 1.3 encryption, and files at rest are encrypted with AES-256. Your data is secure in transit and on our servers.",
  },
  {
    q: "Can I delete a file before it expires?",
    a: "Yes. If you uploaded via the API, you can delete files using the DELETE endpoint. Files uploaded via the web interface expire automatically.",
  },
  {
    q: "How does the API work?",
    a: "Our REST API lets you upload, download, and manage files programmatically. You'll need an API key — check our API documentation for full details, code examples, and rate limits.",
  },
  {
    q: "What are the rate limits?",
    a: "Free tier: 100 requests/hour. Pro tier: 1,000 requests/hour. Rate limits reset every hour.",
  },
  {
    q: "How do I report abuse or illegal content?",
    a: "You can report abuse through our Report Abuse page. We take all reports seriously and respond within 24 hours.",
  },
  {
    q: "Is Rapidx free?",
    a: "Yes, Rapidx is free for personal use. We offer a Pro tier with higher rate limits and larger file sizes for power users and businesses.",
  },
  {
    q: "Can I use Rapidx for commercial purposes?",
    a: "Absolutely. Our API is designed for integration into apps and workflows. Check our Terms of Service for usage guidelines.",
  },
];

const FAQ = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <div className="flex-1 container mx-auto max-w-3xl px-4 pt-24 pb-16">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      <h1 className="font-display text-3xl font-bold text-foreground mb-2">Frequently Asked Questions</h1>
      <p className="text-muted-foreground mb-10">Everything you need to know about Rapidx.</p>

      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-5 data-[state=open]:bg-secondary/30 transition-colors">
            <AccordionTrigger className="text-left text-foreground font-medium hover:no-underline">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
    <Footer />
  </div>
);

export default FAQ;
