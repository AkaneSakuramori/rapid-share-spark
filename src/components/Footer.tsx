import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-secondary/50 py-12 px-4">
    <div className="container mx-auto max-w-6xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground tracking-tight">Rapidx</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Fast, secure file sharing. Upload and share files instantly with anyone.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="font-display font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Product</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Upload</Link></li>
            <li><Link to="/api" className="text-sm text-muted-foreground hover:text-foreground transition-colors">API</Link></li>
            <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-display font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Legal</h4>
          <ul className="space-y-2">
            <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
            <li><Link to="/abuse" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Report Abuse</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-display font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Resources</h4>
          <ul className="space-y-2">
            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">GitHub</a></li>
            <li><Link to="/api" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</Link></li>
            <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Changelog</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Rapidx.me — All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
          <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
