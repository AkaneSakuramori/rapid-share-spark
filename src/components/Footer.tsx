import { motion } from "framer-motion";

const Footer = () => (
  <motion.footer
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.6 }}
    className="border-t border-border/30 py-5 px-4"
  >
    <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-muted-foreground/50">
      <a href="#api" className="hover:text-foreground transition-colors duration-300">API</a>
      <span>·</span>
      <a href="#" className="hover:text-foreground transition-colors duration-300">Terms</a>
      <span>·</span>
      <a href="#" className="hover:text-foreground transition-colors duration-300">Privacy</a>
      <span>·</span>
      <a href="#" className="hover:text-foreground transition-colors duration-300">Abuse</a>
      <span>·</span>
      <span>© 2026 Rapidx.me</span>
    </div>
  </motion.footer>
);

export default Footer;
