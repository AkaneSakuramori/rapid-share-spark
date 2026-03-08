import { Zap, Github, Twitter } from "lucide-react";

const footerLinks = {
  Product: ["Upload", "API", "Pricing", "Changelog"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Legal: ["Terms", "Privacy", "DMCA"],
};

const Footer = () => (
  <footer className="border-t border-border py-12 px-4">
    <div className="container mx-auto max-w-5xl">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {/* Brand */}
        <div>
          <a href="/" className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">Rapidx</span>
          </a>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The fastest way to host and share images. Built for creators & developers.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="font-display text-sm font-semibold text-foreground mb-3">{title}</h4>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">© 2026 Rapidx.me — All rights reserved. Made with ❤️ for creators & developers.</p>
        <div className="flex items-center gap-3">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub"><Github className="w-4 h-4" /></a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter"><Twitter className="w-4 h-4" /></a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
