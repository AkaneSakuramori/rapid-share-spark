import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CodeHighlight from "@/components/CodeHighlight";
import PageTransition from "@/components/PageTransition";

interface ContentBlock {
  type: "text" | "code";
  value: string;
  language?: string;
}

interface Post {
  title: string;
  date: string;
  tag: string;
  blocks: ContentBlock[];
}

const postContent: Record<string, Post> = {
  "introducing-rapidx": {
    title: "Introducing Rapidx — Fast, Secure File Sharing",
    date: "March 8, 2026",
    tag: "Launch",
    blocks: [
      { type: "text", value: "We're excited to launch Rapidx, a modern file sharing platform built for speed and simplicity.\n\n**Why Rapidx?**\n\nMost file sharing services are bloated with features you don't need. We stripped everything down to the essentials: upload a file, get a link, share it.\n\n**Key Features:**\n- Instant uploads — Files are processed and available within seconds\n- No sign-up required — Just drag, drop, and share\n- 50MB file limit — Enough for documents, images, and small videos\n- Auto-expiring links — Files are automatically cleaned up after 30 days\n- API access — Integrate uploads directly into your workflows" },
      { type: "text", value: "Here's how simple it is to upload a file with our API:" },
      { type: "code", language: "JavaScript", value: `const form = new FormData();
form.append("file", myFile);

const res = await fetch("https://api.rapidx.me/v1/upload", {
  method: "POST",
  headers: { Authorization: "Bearer YOUR_API_KEY" },
  body: form,
});

const { data } = await res.json();
console.log(data.download_url);` },
      { type: "text", value: "**What's Next?**\n\nWe're working on larger file support, team workspaces, and password-protected links. Stay tuned for updates on this blog.\n\nThank you for trying Rapidx. We'd love to hear your feedback!" },
    ],
  },
  "api-v1-release": {
    title: "API v1 is Now Available",
    date: "March 5, 2026",
    tag: "API",
    blocks: [
      { type: "text", value: "Our REST API is officially live! You can now integrate Rapidx file uploads directly into your applications.\n\n**What's included in v1:**" },
      { type: "text", value: "**Upload a file:**" },
      { type: "code", language: "bash", value: `curl -X POST https://api.rapidx.me/v1/upload \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@/path/to/file.png"` },
      { type: "text", value: "**Node.js example:**" },
      { type: "code", language: "JavaScript", value: `import fs from "fs";

const form = new FormData();
form.append("file", fs.createReadStream("./photo.png"));

const res = await fetch("https://api.rapidx.me/v1/upload", {
  method: "POST",
  headers: { Authorization: "Bearer YOUR_API_KEY" },
  body: form,
});

const { data } = await res.json();
console.log(data.download_url);` },
      { type: "text", value: "**Python example:**" },
      { type: "code", language: "Python", value: `import requests

with open("photo.png", "rb") as f:
    res = requests.post(
        "https://api.rapidx.me/v1/upload",
        headers={"Authorization": "Bearer YOUR_API_KEY"},
        files={"file": f},
    )

print(res.json()["data"]["download_url"])` },
      { type: "text", value: "**Authentication** is handled via Bearer tokens. Generate your API key from your dashboard.\n\n**Rate Limits:**\n- Free tier: 100 requests/hour\n- Pro tier: 1,000 requests/hour\n\nCheck out our [API documentation](/api) for full details." },
    ],
  },
  "security-best-practices": {
    title: "How We Keep Your Files Secure",
    date: "February 28, 2026",
    tag: "Security",
    blocks: [
      { type: "text", value: "Security is a core priority at Rapidx. Here's how we protect your files:\n\n**Encryption in Transit**\nAll uploads and downloads use TLS 1.3 encryption. Your files are never transmitted in plain text.\n\n**Encryption at Rest**\nFiles stored on our servers are encrypted using AES-256 encryption.\n\n**Access Controls**\nEach file gets a unique, unguessable ID. Only people with the exact link can access the file." },
      { type: "text", value: "Here's an example of how file IDs are generated:" },
      { type: "code", language: "JavaScript", value: `import crypto from "crypto";

function generateFileId() {
  // 7-character base62 ID = ~3.5 trillion combinations
  const bytes = crypto.randomBytes(8);
  const id = bytes
    .toString("base64url")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 7);
  return id;
}` },
      { type: "text", value: "**Automatic Expiration**\nFiles are automatically deleted after their retention period, reducing the attack surface.\n\n**What's Coming:**\n- Password-protected links\n- End-to-end encryption option\n- Two-factor authentication for API access\n\nWe're committed to making Rapidx the most secure file sharing platform available." },
    ],
  },
  "performance-update": {
    title: "50% Faster Uploads with Our New CDN",
    date: "February 20, 2026",
    tag: "Performance",
    blocks: [
      { type: "text", value: "We've deployed a global CDN that dramatically improves upload and download speeds.\n\n**The Problem:**\nPreviously, all files were routed through a single region. Users in Asia and Europe experienced slower upload times.\n\n**The Solution:**\nWe've partnered with a leading CDN provider to deploy edge nodes across 40+ locations worldwide." },
      { type: "text", value: "Our edge routing configuration:" },
      { type: "code", language: "JavaScript", value: `// Smart routing based on user geolocation
const edgeConfig = {
  regions: ["us-east", "us-west", "eu-west", "eu-central", "ap-south", "ap-east"],
  routing: "latency-based",
  failover: true,
  replication: {
    strategy: "async",
    minCopies: 2,
  },
};

async function routeUpload(file, userRegion) {
  const nearestEdge = await findNearestEdge(userRegion);
  return nearestEdge.upload(file);
}` },
      { type: "text", value: "**Results:**\n- 50% faster uploads on average\n- 70% faster downloads for international users\n- 99.9% uptime since deployment\n\n**Technical Details:**\n- Multi-region storage with automatic replication\n- Smart routing based on user location\n- Chunked uploads for large files to improve reliability\n\nWe'll continue optimizing performance as we grow." },
    ],
  },
};

const renderText = (text: string) => {
  // Simple markdown-like rendering
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return <h3 key={i} className="font-display font-semibold text-foreground mt-6 mb-2">{line.replace(/\*\*/g, "")}</h3>;
    }
    if (line.startsWith("- ")) {
      return <li key={i} className="ml-4 text-muted-foreground list-disc">{line.slice(2)}</li>;
    }
    if (line === "") return <br key={i} />;
    // Bold inline
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={i} className="text-muted-foreground leading-relaxed">
        {parts.map((part, j) =>
          part.startsWith("**") && part.endsWith("**")
            ? <strong key={j} className="text-foreground font-semibold">{part.replace(/\*\*/g, "")}</strong>
            : part
        )}
      </p>
    );
  });
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
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <PageTransition>
        <div className="flex-1 container mx-auto max-w-3xl px-4 pt-24 pb-16">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">{post.tag}</span>
            <span className="text-xs text-muted-foreground">{post.date}</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-8">{post.title}</h1>
          <div className="space-y-4">
            {post.blocks.map((block, i) =>
              block.type === "code" ? (
                <CodeHighlight key={i} code={block.value} language={block.language} />
              ) : (
                <div key={i}>{renderText(block.value)}</div>
              )
            )}
          </div>
        </div>
      </PageTransition>
      <Footer />
    </div>
  );
};

export default BlogPost;
