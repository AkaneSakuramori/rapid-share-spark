import { Link } from "react-router-dom";
import { ArrowLeft, Key, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CodeHighlight from "@/components/CodeHighlight";
import PageTransition from "@/components/PageTransition";

const EndpointBlock = ({ title, method, path, description, request, response }: {
  title: string; method: string; path: string; description: string;
  request: { language: string; code: string };
  response: { language: string; code: string };
}) => (
  <div className="rounded-xl border border-border bg-card overflow-hidden">
    <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-secondary/50">
      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
        method === "POST" ? "bg-primary/10 text-primary" :
        method === "GET" ? "bg-emerald-500/10 text-emerald-600" :
        "bg-destructive/10 text-destructive"
      }`}>{method}</span>
      <code className="text-sm font-mono text-foreground">{path}</code>
    </div>
    <div className="p-5 space-y-4">
      <div>
        <h3 className="font-display font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Request</p>
        <CodeHighlight code={request.code} language={request.language} />
      </div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Response</p>
        <CodeHighlight code={response.code} language={response.language} />
      </div>
    </div>
  </div>
);

const ApiDocs = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <PageTransition>
      <div className="flex-1 container mx-auto max-w-4xl px-4 pt-24 pb-16">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="mb-12">
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">API Documentation</h1>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            Integrate Rapidx file sharing into your applications. Our REST API supports file upload, download, and management with simple HTTP requests.
          </p>
        </div>

        {/* Auth */}
        <div className="rounded-xl border border-border bg-card p-6 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Key className="w-4 h-4 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Authentication</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-3">Include your API key in the request header for authenticated endpoints.</p>
          <CodeHighlight code='Authorization: Bearer YOUR_API_KEY' />
        </div>

        {/* Rate Limits */}
        <div className="rounded-xl border border-border bg-card p-6 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Rate Limits</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-secondary rounded-lg p-3"><p className="text-muted-foreground">Free Tier</p><p className="font-semibold text-foreground">100 req/hr</p></div>
            <div className="bg-secondary rounded-lg p-3"><p className="text-muted-foreground">Pro Tier</p><p className="font-semibold text-foreground">1,000 req/hr</p></div>
            <div className="bg-secondary rounded-lg p-3"><p className="text-muted-foreground">Max File Size</p><p className="font-semibold text-foreground">50 MB</p></div>
          </div>
        </div>

        {/* Endpoints */}
        <h2 className="font-display text-xl font-semibold text-foreground mb-6">Endpoints</h2>
        <div className="space-y-6">
          <EndpointBlock
            title="Upload a File" method="POST" path="/api/v1/upload"
            description="Upload a file and receive a shareable download link."
            request={{ language: "bash", code: `curl -X POST https://api.rapidx.me/v1/upload \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@/path/to/file.png"` }}
            response={{ language: "JSON", code: `{
  "success": true,
  "data": {
    "id": "f7k2m9x",
    "filename": "file.png",
    "size": 245760,
    "download_url": "https://rapidx.me/d/f7k2m9x",
    "direct_url": "https://cdn.rapidx.me/f7k2m9x/file.png",
    "created_at": "2026-03-10T12:00:00Z",
    "expires_at": "2026-04-10T12:00:00Z"
  }
}` }}
          />
          <EndpointBlock
            title="Download a File" method="GET" path="/api/v1/files/:id/download"
            description="Retrieve a file by its ID. Returns a redirect to the CDN URL."
            request={{ language: "bash", code: `curl -X GET https://api.rapidx.me/v1/files/f7k2m9x/download \\
  -H "Authorization: Bearer YOUR_API_KEY"` }}
            response={{ language: "HTTP", code: `HTTP/1.1 302 Found
Location: https://cdn.rapidx.me/f7k2m9x/file.png` }}
          />
          <EndpointBlock
            title="Get File Info" method="GET" path="/api/v1/files/:id"
            description="Retrieve metadata about an uploaded file."
            request={{ language: "bash", code: `curl -X GET https://api.rapidx.me/v1/files/f7k2m9x \\
  -H "Authorization: Bearer YOUR_API_KEY"` }}
            response={{ language: "JSON", code: `{
  "success": true,
  "data": {
    "id": "f7k2m9x",
    "filename": "file.png",
    "size": 245760,
    "mime_type": "image/png",
    "download_count": 12,
    "download_url": "https://rapidx.me/d/f7k2m9x",
    "created_at": "2026-03-10T12:00:00Z",
    "expires_at": "2026-04-10T12:00:00Z"
  }
}` }}
          />
          <EndpointBlock
            title="Delete a File" method="DELETE" path="/api/v1/files/:id"
            description="Permanently delete an uploaded file. This action cannot be undone."
            request={{ language: "bash", code: `curl -X DELETE https://api.rapidx.me/v1/files/f7k2m9x \\
  -H "Authorization: Bearer YOUR_API_KEY"` }}
            response={{ language: "JSON", code: `{
  "success": true,
  "message": "File deleted successfully"
}` }}
          />

          {/* Error Codes */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display font-semibold text-foreground mb-4">Error Codes</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold text-foreground">Code</th>
                    <th className="text-left py-2 pr-4 font-semibold text-foreground">Status</th>
                    <th className="text-left py-2 font-semibold text-foreground">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50"><td className="py-2 pr-4 font-mono">400</td><td className="py-2 pr-4">Bad Request</td><td className="py-2">Missing or invalid parameters</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 pr-4 font-mono">401</td><td className="py-2 pr-4">Unauthorized</td><td className="py-2">Invalid or missing API key</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 pr-4 font-mono">404</td><td className="py-2 pr-4">Not Found</td><td className="py-2">File not found or expired</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 pr-4 font-mono">413</td><td className="py-2 pr-4">Payload Too Large</td><td className="py-2">File exceeds 50MB limit</td></tr>
                  <tr><td className="py-2 pr-4 font-mono">429</td><td className="py-2 pr-4">Too Many Requests</td><td className="py-2">Rate limit exceeded</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SDK Examples */}
        <h2 className="font-display text-xl font-semibold text-foreground mt-12 mb-6">SDK Examples</h2>
        <div className="space-y-6">
          <CodeHighlight language="JavaScript" code={`const form = new FormData();
form.append("file", fs.createReadStream("./photo.png"));

const res = await fetch("https://api.rapidx.me/v1/upload", {
  method: "POST",
  headers: { Authorization: "Bearer YOUR_API_KEY" },
  body: form,
});

const { data } = await res.json();
console.log(data.download_url);`} />

          <CodeHighlight language="Python" code={`import requests

with open("photo.png", "rb") as f:
    res = requests.post(
        "https://api.rapidx.me/v1/upload",
        headers={"Authorization": "Bearer YOUR_API_KEY"},
        files={"file": f},
    )

print(res.json()["data"]["download_url"])`} />
        </div>
      </div>
    </PageTransition>
    <Footer />
  </div>
);

export default ApiDocs;
