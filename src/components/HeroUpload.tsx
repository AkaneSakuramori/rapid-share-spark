import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CloudUpload, Link2, X, Clipboard, CheckCircle2, ArrowUp, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface FileItem {
  id: string;
  file: File;
  preview: string;
  progress: number;
  done: boolean;
  url: string;
  deleteUrl: string;
}

const generateFakeUrl = (name: string) => `https://rapidx.me/i/${Math.random().toString(36).slice(2, 10)}/${name}`;
const generateDeleteUrl = () => `https://rapidx.me/delete/${Math.random().toString(36).slice(2, 14)}`;

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
      deleteUrl: generateDeleteUrl(),
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

  const resetUpload = () => setFiles([]);

  const allDone = files.length > 0 && files.every((f) => f.done);

  return (
    <section className="flex flex-col items-center justify-center pt-20 pb-8 px-4 min-h-[calc(100vh-3.5rem)]" id="upload-zone">
      <div className="w-full max-w-2xl">
        {/* Upload zone */}
        {!allDone && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 sm:p-16 text-center transition-all duration-300 ${
              isDragging
                ? "border-primary bg-primary/5 glow-border-strong scale-[1.01]"
                : "border-border hover:border-primary/50 glass"
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
            <CloudUpload className={`w-10 h-10 mx-auto mb-4 text-primary ${isDragging ? "animate-bounce" : ""}`} />
            <p className="text-base font-medium text-foreground mb-1">
              {isDragging ? "Drop your images here" : "Drop images here or click to upload"}
            </p>
            <p className="text-sm text-muted-foreground">
              PNG, JPG, GIF, WebP — 50 MB max per file
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Paste from clipboard <kbd className="px-1.5 py-0.5 rounded bg-secondary text-xs font-mono">⌘V</kbd>
            </p>
          </motion.div>
        )}

        {/* URL upload */}
        {!allDone && (
          <div className="mt-3 flex gap-2">
            <div className="flex-1 flex items-center gap-2 glass rounded-xl px-3 h-10">
              <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="url"
                placeholder="Paste image URL..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUrlUpload()}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <Button size="default" onClick={handleUrlUpload} className="gap-1.5">
              <ArrowUp className="w-4 h-4" /> Upload
            </Button>
          </div>
        )}

        {/* File queue (uploading) */}
        <AnimatePresence>
          {files.length > 0 && !allDone && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-2">
              {files.map((f) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  className="glass rounded-xl p-3 flex items-center gap-3"
                >
                  <img src={f.preview} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-foreground">{f.file.name}</p>
                    <p className="text-xs text-muted-foreground">{(f.file.size / 1024).toFixed(0)} KB</p>
                    {!f.done && (
                      <div className="mt-1 h-1 rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${f.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  {f.done ? (
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  ) : (
                    <span className="text-xs text-muted-foreground font-mono w-10 text-right">{Math.round(f.progress)}%</span>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); removeFile(f.id); }} className="p-1 rounded-lg hover:bg-secondary transition-colors" aria-label="Remove">
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {allDone && <ResultsPanel files={files} onReset={resetUpload} />}
        </AnimatePresence>
      </div>
    </section>
  );
};

const linkFormats = (url: string, name: string, deleteUrl: string) => [
  { label: "Direct Link", value: url },
  { label: "Markdown", value: `![${name}](${url})` },
  { label: "HTML", value: `<img src="${url}" alt="${name}" />` },
  { label: "BBCode", value: `[img]${url}[/img]` },
  { label: "Delete Link", value: deleteUrl },
];

const ResultsPanel = ({ files, onReset }: { files: FileItem[]; onReset: () => void }) => {
  const [activeTab, setActiveTab] = useState(0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const activeFile = files[activeTab];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-foreground">
            {files.length} image{files.length > 1 ? "s" : ""} uploaded
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset} className="gap-1.5 text-muted-foreground">
          <RotateCcw className="w-3.5 h-3.5" /> Upload more
        </Button>
      </div>

      {/* Image preview + thumbnails */}
      {activeFile && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="bg-secondary/30 flex items-center justify-center p-4 max-h-64">
            <img src={activeFile.preview} alt="" className="max-h-56 max-w-full rounded-lg object-contain" />
          </div>

          {files.length > 1 && (
            <div className="flex gap-1.5 px-4 py-3 border-t border-border overflow-x-auto">
              {files.map((f, i) => (
                <button
                  key={f.id}
                  onClick={() => setActiveTab(i)}
                  className={`shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    activeTab === i ? "border-primary" : "border-transparent hover:border-border"
                  }`}
                >
                  <img src={f.preview} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Link formats */}
          <div className="px-4 py-3 space-y-1.5 border-t border-border">
            {linkFormats(activeFile.url, activeFile.file.name, activeFile.deleteUrl).map((fmt) => (
              <div key={fmt.label} className="flex items-center gap-2">
                <span className={`text-xs w-20 shrink-0 ${fmt.label === "Delete Link" ? "text-destructive" : "text-muted-foreground"}`}>
                  {fmt.label === "Delete Link" && <Trash2 className="w-3 h-3 inline mr-1" />}
                  {fmt.label}
                </span>
                <div className="flex-1 bg-secondary/50 rounded-lg px-2.5 py-1.5 text-xs font-mono text-foreground truncate">
                  {fmt.value}
                </div>
                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(fmt.value)} className="shrink-0 h-7 px-2">
                  <Clipboard className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HeroUpload;
