import { motion } from "framer-motion";
import { Zap, Share2, Shield, Smartphone, Globe, Image, Star } from "lucide-react";

const features = [
  { icon: Zap, title: "Blazing Fast Upload", desc: "Drag & drop, paste, or URL — your images are live in seconds." },
  { icon: Share2, title: "Every Share Format", desc: "Direct link, Markdown, HTML, BBCode — one click to copy." },
  { icon: Globe, title: "Forever Storage", desc: "Unlimited bandwidth, CDN-powered delivery worldwide." },
  { icon: Shield, title: "Privacy-First", desc: "Anonymous uploads, no tracking. Your images, your rules." },
  { icon: Smartphone, title: "Mobile-Optimized", desc: "Beautiful experience on every device, from phone to desktop." },
  { icon: Star, title: "Pro Upgrades", desc: "200 MB uploads, albums, analytics, and custom domains." },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Features = () => (
  <section id="features" className="py-24 px-4">
    <div className="container mx-auto max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
          Everything you need. <span className="text-gradient">Nothing you don't.</span>
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">Image hosting built for speed, simplicity, and reliability.</p>
      </motion.div>

      <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={item}
            className="glass rounded-2xl p-6 hover:glow-border transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <f.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display text-base font-semibold text-foreground mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Features;
