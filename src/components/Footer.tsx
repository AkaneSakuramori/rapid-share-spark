const Footer = () => (
  <footer className="border-t border-border py-4 px-4">
    <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      <a href="#api" className="hover:text-foreground transition-colors">API</a>
      <span className="hidden sm:inline">·</span>
      <a href="#" className="hover:text-foreground transition-colors">Terms</a>
      <span className="hidden sm:inline">·</span>
      <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
      <span className="hidden sm:inline">·</span>
      <a href="#" className="hover:text-foreground transition-colors">Abuse</a>
      <span className="hidden sm:inline">·</span>
      <span>© 2026 Rapidx.me</span>
    </div>
  </footer>
);

export default Footer;
