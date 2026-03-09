import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CloudUpload, Link2, X, Clipboard, CheckCircle2, ArrowUp, RotateCcw, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { uploadToTelegram } from "@/lib/uploadToTelegram";

interface FileItem {
  id: string;
  file: File;
  preview: string;
  progress: number;
  done: boolean;
  url: string;
  error?: string;
}

const HeroUpload = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (item: FileItem) => {
    try {
      const result = await uploadToTelegram(item.file, (progress) => {
        setFiles((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, progress } : f))
        );
      });
      setFiles((prev) =>
        prev.map((f) =>
          f.id === item.id
            ? { ...f, done: true, progress: 100, url: result.downloadLink }
            : f
        )
      );
    } catch (err: any) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === item.id
            ? { ...f, error: err.message, progress: 0 }
            : f
        )
      );
      toast.error(`Upload failed: ${err.message}`);
    }
  }, []);

  const addFiles = useCallback((newFiles: File[]) => {
    const items: FileItem[] = newFiles.map((file) => ({
      id: Math.random().toString(36).slice(2),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      done: false,
      url: "",
    }));
    setFiles((prev) => [...prev, ...items]);
    // Start uploading each file
    items.forEach((item) => uploadFile(item));
  }, [uploadFile]);

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

  const resetUpload = () => setFiles([]);
  const allDone = files.length > 0 && files.every((f) => f.done);

  return (
    <section className="flex flex-col items-center justify-center pt-24 pb-12 px-4 min-h-[calc(100vh-3.5rem)]" id="upload-zone">
      <div className="w-full max-w-2xl">
        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight mb-3">
            <span className="text-gradient">Instant</span>{" "}
            <span className="text-foreground">Image Hosting</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto">
            Drop, paste, or upload — get shareable links in seconds.
          </p>
        </motion.div>

        {/* Upload zone */}
        <AnimatePresence mode="wait">
          {!allDone ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
                className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 sm:p-14 text-center transition-all duration-500 ${
                  isDragging
                    ? "border-primary bg-primary/5 glow-border-strong scale-[1.01]"
                    : "border-border/60 hover:border-primary/40 glass cinematic-shadow"
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

                <motion.div
                  animate={isDragging ? { y: -8, scale: 1.1 } : { y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <CloudUpload className="w-7 h-7 text-primary" />
                  </div>
                </motion.div>

                <p className="text-base font-medium text-foreground mb-1">
                  {isDragging ? "Drop your images here" : "Drop images here or click to upload"}
                </p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG, GIF, WebP — 50 MB max
                </p>
                <p className="text-xs text-muted-foreground/60 mt-3 flex items-center justify-center gap-1.5">
                  Paste from clipboard{" "}
                  <kbd className="px-1.5 py-0.5 rounded-md bg-secondary text-[10px] font-mono text-muted-foreground border border-border">⌘V</kbd>
                </p>
              </motion.div>

              {/* URL upload */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="mt-3 flex gap-2"
              >
                <div className="flex-1 flex items-center gap-2 glass rounded-xl px-3.5 h-10 transition-all focus-within:glow-border">
                  <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input
                    type="url"
                    placeholder="Paste image URL..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUrlUpload()}
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button size="default" onClick={handleUrlUpload} className="gap-1.5">
                    <ArrowUp className="w-4 h-4" /> Upload
                  </Button>
                </motion.div>
              </motion.div>

              {/* File queue */}
              <AnimatePresence>
                {files.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 space-y-2"
                  >
                    {files.map((f, i) => (
                      <motion.div
                        key={f.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass rounded-xl p-3 flex items-center gap-3"
                      >
                        <img src={f.preview} alt="" className="w-10 h-10 rounded-lg object-cover ring-1 ring-border" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-foreground">{f.file.name}</p>
                          <p className="text-xs text-muted-foreground">{(f.file.size / 1024).toFixed(0)} KB</p>
                          {!f.done && (
                            <div className="mt-1.5 h-1 rounded-full bg-secondary overflow-hidden">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                                initial={{ width: 0 }}
                                animate={{ width: `${f.progress}%` }}
                                transition={{ ease: "easeOut" }}
                              />
                            </div>
                          )}
                        </div>
                        {f.done ? (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                            <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                          </motion.div>
                        ) : (
                          <span className="text-xs text-muted-foreground font-mono w-10 text-right">{Math.round(f.progress)}%</span>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                          className="p-1 rounded-lg hover:bg-secondary transition-colors"
                          aria-label="Remove"
                        >
                          <X className="w-3.5 h-3.5 text-muted-foreground" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <ResultsPanel key="results" files={files} onReset={resetUpload} />
          )}
        </AnimatePresence>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex items-center justify-center gap-4 text-xs text-muted-foreground/50"
        >
          <span>No signup needed</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/20" />
          <span>CDN-powered</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/20" />
          <span>rapidx.me</span>
        </motion.div>
      </div>
    </section>
  );
};

/* ─── Link Formats ─── */
const linkFormats = (url: string, name: string) => [
  { label: "Direct Link", value: url, icon: ExternalLink },
  { label: "Markdown", value: `![${name}](${url})`, icon: Copy },
  { label: "HTML", value: `<img src="${url}" alt="${name}" />`, icon: Copy },
  { label: "BBCode", value: `[img]${url}[/img]`, icon: Copy },
];

/* ─── Results Panel ─── */
const ResultsPanel = ({ files, onReset }: { files: FileItem[]; onReset: () => void }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const activeFile = files[activeTab];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 text-accent" />
          </div>
          <span className="text-sm font-medium text-foreground">
            {files.length} image{files.length > 1 ? "s" : ""} uploaded
          </span>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button variant="ghost" size="sm" onClick={onReset} className="gap-1.5 text-muted-foreground hover:text-foreground">
            <RotateCcw className="w-3.5 h-3.5" /> Upload more
          </Button>
        </motion.div>
      </div>

      {/* Preview + links */}
      {activeFile && (
        <motion.div
          className="glass rounded-2xl overflow-hidden cinematic-shadow"
          layout
        >
          {/* Image preview */}
          <div className="bg-secondary/20 flex items-center justify-center p-6 max-h-72">
            <motion.img
              src={activeFile.preview}
              alt=""
              className="max-h-60 max-w-full rounded-xl object-contain"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Thumbnails */}
          {files.length > 1 && (
            <div className="flex gap-1.5 px-4 py-3 border-t border-border/50 overflow-x-auto">
              {files.map((f, i) => (
                <motion.button
                  key={f.id}
                  onClick={() => setActiveTab(i)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`shrink-0 w-11 h-11 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    activeTab === i ? "border-primary glow-border" : "border-transparent hover:border-border"
                  }`}
                >
                  <img src={f.preview} alt="" className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          )}

          {/* Link formats */}
          <div className="px-4 py-3 space-y-1.5 border-t border-border/50">
            {linkFormats(activeFile.url, activeFile.file.name).map((fmt, idx) => (
              <motion.div
                key={fmt.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-2 group"
              >
                <span className={`text-xs w-20 shrink-0 flex items-center gap-1 ${
                  fmt.destructive ? "text-destructive" : "text-muted-foreground"
                }`}>
                  <fmt.icon className="w-3 h-3" />
                  {fmt.label}
                </span>
                <div className="flex-1 bg-secondary/40 rounded-lg px-2.5 py-1.5 text-xs font-mono text-foreground/80 truncate border border-border/30">
                  {fmt.value}
                </div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(fmt.value, idx)}
                    className="shrink-0 h-7 px-2 text-muted-foreground hover:text-foreground"
                  >
                    {copiedIdx === idx ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <CheckCircle2 className="w-3 h-3 text-accent" />
                      </motion.div>
                    ) : (
                      <Clipboard className="w-3 h-3" />
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HeroUpload;
