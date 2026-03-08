import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CloudUpload, Link2, X, FileImage, Clipboard, CheckCircle2, ArrowUp } from "lucide-react";
import { toast } from "sonner";

interface FileItem {
  id: string;
  file: File;
  preview: string;
  progress: number;
  done: boolean;
  url: string;
}

const generateFakeUrl = (name: string) => `https://rapidx.me/i/${Math.random().toString(36).slice(2, 10)}/${name}`;

const HeroUpload = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: File[]) => {
    const items: FileItem[] = newFiles.map((file) => ({
      id: Math.random().toString(36).slice(2),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      done: false,
      url: generateFakeUrl(file.name),
    }));
    setFiles((prev) => [...prev, ...items]);
  }, []);

  // Simulate progress
  useEffect(() => {
    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) =>
          f.done ? f : f.progress >= 100 ? { ...f, done: true, progress: 100 } : { ...f, progress: Math.min(f.progress + Math.random() * 15 + 5, 100) }
        )
      );
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
      if (droppedFiles.length) addFiles(droppedFiles);
    },
    [addFiles]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const imageFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const f = items[i].getAsFile();
          if (f) imageFiles.push(f);
        }
      }
      if (imageFiles.length) addFiles(imageFiles);
    },
    [addFiles]
  );

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const handleUrlUpload = () => {
    if (!urlInput.trim()) return;
    toast.success("URL queued for upload");
    setUrlInput("");
  };

  const allDone = files.length > 0 && files.every((f) => f.done);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4" id="upload-zone">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-3xl relative z-10">
        {/* Headline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-gradient">Instant</span> image hosting.
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Drag, drop, share instantly. No signup needed. Lightning-fast CDN delivery.
          </p>
        </motion.div>

        {/* Upload zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 sm:p-14 text-center transition-all duration-300 ${
            isDragging
              ? "border-primary bg-primary/5 glow-border-strong scale-[1.02]"
              : "border-border hover:border-primary/50 hover:bg-card/50 glass"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const selected = Array.from(e.target.files || []);
              if (selected.length) addFiles(selected);
              e.target.value = "";
            }}
          />
          <motion.div animate={isDragging ? { y: -8, scale: 1.1 } : { y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
            <CloudUpload className="w-12 h-12 mx-auto mb-4 text-primary animate-float" />
          </motion.div>
          <p className="font-display text-lg font-semibold text-foreground mb-1">
            {isDragging ? "Drop your images here!" : "Drag & drop images here"}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to browse • paste from clipboard (<kbd className="px-1.5 py-0.5 rounded bg-secondary text-xs font-mono">⌘V</kbd>)
          </p>
          <p className="text-xs text-muted-foreground mt-2">50 MB max per file • PNG, JPG, GIF, WebP</p>
        </motion.div>

        {/* URL upload */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-4 flex gap-2">
          <div className="flex-1 flex items-center gap-2 glass rounded-xl px-4 h-11">
            <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="url"
              placeholder="Paste image URL to upload..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUrlUpload()}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <Button size="default" onClick={handleUrlUpload}>
            <ArrowUp className="w-4 h-4" /> Upload
          </Button>
        </motion.div>

        {/* File queue */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-3">
              {files.map((f) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="glass rounded-xl p-3 flex items-center gap-3"
                >
                  <img src={f.preview} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-foreground">{f.file.name}</p>
                    <p className="text-xs text-muted-foreground">{(f.file.size / 1024).toFixed(0)} KB</p>
                    {!f.done && (
                      <div className="mt-1.5 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${f.progress}%` }}
                          transition={{ ease: "easeOut" }}
                        />
                      </div>
                    )}
                  </div>
                  {f.done ? (
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                  ) : (
                    <span className="text-xs text-muted-foreground font-mono w-10 text-right">{Math.round(f.progress)}%</span>
                  )}
                  <button onClick={() => removeFile(f.id)} className="p-1 rounded-lg hover:bg-secondary transition-colors" aria-label="Remove">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {allDone && <ResultsPanel files={files} />}
        </AnimatePresence>

        {/* Trust bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          {["No signup needed", "Files last forever", "CDN-powered", "Rapidx.me"].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-accent" /> {t}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const linkFormats = (url: string, name: string) => [
  { label: "Direct Link", value: url },
  { label: "Markdown", value: `![${name}](${url})` },
  { label: "HTML", value: `<img src="${url}" alt="${name}" />` },
  { label: "BBCode", value: `[img]${url}[/img]` },
];

const ResultsPanel = ({ files }: { files: FileItem[] }) => {
  const [activeTab, setActiveTab] = useState(0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!", { icon: <Clipboard className="w-4 h-4" /> });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-5 h-5 text-accent" />
        <h2 className="font-display text-lg font-semibold text-foreground">
          {files.length} image{files.length > 1 ? "s" : ""} uploaded!
        </h2>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {files.map((f, i) => (
          <button
            key={f.id}
            onClick={() => setActiveTab(i)}
            className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
              activeTab === i ? "border-primary glow-border" : "border-border hover:border-primary/50"
            }`}
          >
            <img src={f.preview} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Links */}
      {files[activeTab] && (
        <div className="glass rounded-2xl p-4 space-y-2">
          {linkFormats(files[activeTab].url, files[activeTab].file.name).map((fmt) => (
            <div key={fmt.label} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-20 shrink-0">{fmt.label}</span>
              <div className="flex-1 bg-secondary/50 rounded-lg px-3 py-2 text-xs font-mono text-foreground truncate">{fmt.value}</div>
              <Button size="sm" variant="ghost" onClick={() => copyToClipboard(fmt.value)} className="shrink-0">
                <Clipboard className="w-3.5 h-3.5" /> Copy
              </Button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default HeroUpload;
