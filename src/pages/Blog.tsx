import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const posts = [
  {
    slug: "introducing-rapidx",
    title: "Introducing Rapidx — Fast, Secure File Sharing",
    excerpt: "We built Rapidx to make file sharing as fast and simple as possible. No sign-ups, no limits on file types, just instant shareable links.",
    date: "March 8, 2026",
    tag: "Launch",
  },
  {
    slug: "api-v1-release",
    title: "API v1 is Now Available",
    excerpt: "Integrate file uploads directly into your apps with our REST API. Upload, download, and manage files programmatically with simple HTTP requests.",
    date: "March 5, 2026",
    tag: "API",
  },
  {
    slug: "security-best-practices",
    title: "How We Keep Your Files Secure",
    excerpt: "A deep dive into the security measures we use to protect your uploads — encryption, access controls, and automatic expiration.",
    date: "February 28, 2026",
    tag: "Security",
  },
  {
    slug: "performance-update",
    title: "50% Faster Uploads with Our New CDN",
    excerpt: "We've rolled out a global CDN that dramatically improves upload and download speeds for users worldwide.",
    date: "February 20, 2026",
    tag: "Performance",
  },
];

const Blog = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <PageTransition>
      <div className="flex-1 container mx-auto max-w-3xl px-4 pt-24 pb-16">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Blog</h1>
        <p className="text-muted-foreground mb-10">Updates, guides, and news from the Rapidx team.</p>

        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="block rounded-xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">{post.tag}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
              </div>
              <h2 className="font-display text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{post.title}</h2>
              <p className="text-sm text-muted-foreground mb-3">{post.excerpt}</p>
              <span className="text-sm text-primary font-medium inline-flex items-center gap-1">
                Read more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </PageTransition>
    <Footer />
  </div>
);

export default Blog;
