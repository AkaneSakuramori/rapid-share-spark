import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const postContent: Record<string, { title: string; date: string; tag: string; body: string }> = {
  "introducing-rapidx": {
    title: "Introducing Rapidx — Fast, Secure File Sharing",
    date: "March 8, 2026",
    tag: "Launch",
    body: `We're excited to launch Rapidx, a modern file sharing platform built for speed and simplicity.

**Why Rapidx?**

Most file sharing services are bloated with features you don't need. We stripped everything down to the essentials: upload a file, get a link, share it. That's it.

**Key Features:**
- **Instant uploads** — Files are processed and available within seconds
- **No sign-up required** — Just drag, drop, and share
- **50MB file limit** — Enough for documents, images, and small videos
- **Auto-expiring links** — Files are automatically cleaned up after 30 days
- **API access** — Integrate uploads directly into your workflows

**What's Next?**

We're working on larger file support, team workspaces, and password-protected links. Stay tuned for updates on this blog.

Thank you for trying Rapidx. We'd love to hear your feedback!`,
  },
  "api-v1-release": {
    title: "API v1 is Now Available",
    date: "March 5, 2026",
    tag: "API",
    body: `Our REST API is officially live! You can now integrate Rapidx file uploads directly into your applications.

**What's included in v1:**
- **POST /api/v1/upload** — Upload files up to 50MB
- **GET /api/v1/files/:id** — Get file metadata
- **GET /api/v1/files/:id/download** — Download a file
- **DELETE /api/v1/files/:id** — Delete a file

**Authentication** is handled via Bearer tokens. Generate your API key from your dashboard.

**Rate Limits:**
- Free tier: 100 requests/hour
- Pro tier: 1,000 requests/hour

Check out our [API documentation](/api) for full details, code examples in JavaScript and Python, and error code references.`,
  },
  "security-best-practices": {
    title: "How We Keep Your Files Secure",
    date: "February 28, 2026",
    tag: "Security",
    body: `Security is a core priority at Rapidx. Here's how we protect your files:

**Encryption in Transit**
All uploads and downloads use TLS 1.3 encryption. Your files are never transmitted in plain text.

**Encryption at Rest**
Files stored on our servers are encrypted using AES-256 encryption.

**Access Controls**
Each file gets a unique, unguessable ID. Only people with the exact link can access the file.

**Automatic Expiration**
Files are automatically deleted after their retention period. This reduces the attack surface and ensures old files don't linger indefinitely.

**Abuse Prevention**
We monitor for suspicious upload patterns and have automated systems to detect and remove malicious content.

**What's Coming:**
- Password-protected links
- End-to-end encryption option
- Two-factor authentication for API access

We're committed to making Rapidx the most secure file sharing platform available.`,
  },
  "performance-update": {
    title: "50% Faster Uploads with Our New CDN",
    date: "February 20, 2026",
    tag: "Performance",
    body: `We've deployed a global CDN that dramatically improves upload and download speeds.

**The Problem:**
Previously, all files were routed through a single region. Users in Asia and Europe experienced slower upload times.

**The Solution:**
We've partnered with a leading CDN provider to deploy edge nodes across 40+ locations worldwide. Files are now uploaded to the nearest edge node and distributed globally.

**Results:**
- **50% faster uploads** on average
- **70% faster downloads** for international users
- **99.9% uptime** since deployment

**Technical Details:**
- Multi-region storage with automatic replication
- Smart routing based on user location
- Chunked uploads for large files to improve reliability

We'll continue optimizing performance as we grow. If you notice any issues, please reach out to our team.`,
  },
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = slug ? postContent[slug] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Post Not Found</h1>
          <Link to="/blog" className="text-sm text-primary hover:underline">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">{post.tag}</span>
          <span className="text-xs text-muted-foreground">{post.date}</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">{post.title}</h1>
        <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
          {post.body}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
