import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CloudUpload, Link2, X, Clipboard, CheckCircle2, ArrowUp, RotateCcw, Copy, ExternalLink, AlertCircle } from "lucide-react";
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
  const [urlLoading, setUrlLoading] = useState(false);
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
      toast.error(err.message);
    }
  }, []);

  const retryFile = useCallback((id: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, error: undefined, progress: 0 } : f
      )
    );
    const item = files.find((f) => f.id === id);
    if (item) uploadFile({ ...item, error: undefined, progress: 0 });
  }, [files, uploadFile]);

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
    items.forEach((item) => uploadFile(item));
  }, [uploadFile]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
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

  const handleUrlUpload = async () => {
    const url = urlInput.trim();
    if (!url) return;
    
    setUrlLoading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Could not fetch image from URL");
      const blob = await res.blob();
      if (!blob.type.startsWith("image/") && !url.match(/\.(png|jpg|jpeg|gif|webp|svg|bmp)$/i)) {
        throw new Error("URL does not point to a valid image");
      }
      const fileName = url.split("/").pop()?.split("?")[0] || "image.png";
      const file = new File([blob], fileName, { type: blob.type || "image/png" });
      addFiles([file]);
      setUrlInput("");
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch image from URL");
    } finally {
      setUrlLoading(false);
    }
  };

  const resetUpload = () => setFiles([]);
  const allDone = files.length > 0 && files.every((f) => f.done);

  return (
    <section className="flex flex-col items-center justify-center pt-24 pb-12 px-4 min-h-[calc(100vh-3.5rem)]" id="upload-zone">
      <div className="w-full max-w-2xl">
        {/* Hero text */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight mb-3">
            <span className="text-primary">Instant</span>{" "}
            <span className="text-foreground">File Hosting</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-md mx-auto">
            Drop, paste, or upload — get shareable links in seconds.
          </p>
        </div>

        {!allDone ? (
          <div>
            {/* Upload zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-14 text-center transition-colors duration-200 ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40 bg-card"
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

              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CloudUpload className="w-6 h-6 text-primary" />
              </div>

              <p className="text-base font-medium text-foreground mb-1">
                {isDragging ? "Drop your files here" : "Drop files here or click to upload"}
              </p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG, GIF, WebP — 50 MB max
              </p>
              <p className="text-xs text-muted-foreground/60 mt-3 flex items-center justify-center gap-1.5">
                Paste from clipboard{" "}
                <kbd className="px-1.5 py-0.5 rounded-md bg-secondary text-[10px] font-mono text-muted-foreground border border-border">⌘V</kbd>
              </p>
            </div>

            {/* URL upload */}
            <div className="mt-3 flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-card rounded-xl px-3.5 h-10 border border-border focus-within:border-primary/50 transition-colors">
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
              <Button size="default" onClick={handleUrlUpload} disabled={urlLoading} className="gap-1.5">
                {urlLoading ? (
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <ArrowUp className="w-4 h-4" />
                )}
                Upload
              </Button>
            </div>

            {/* File queue */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((f) => (
                  <div
                    key={f.id}
                    className="bg-card border border-border rounded-xl p-3 flex items-center gap-3"
                  >
                    <img src={f.preview} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-foreground">{f.file.name}</p>
                      <p className="text-xs text-muted-foreground">{(f.file.size / 1024).toFixed(0)} KB</p>
                      {f.error ? (
                        <div className="mt-1 flex items-center gap-1.5">
                          <AlertCircle className="w-3 h-3 text-destructive shrink-0" />
                          <p className="text-xs text-destructive truncate">{f.error}</p>
                        </div>
                      ) : !f.done ? (
                        <div className="mt-1.5 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all duration-300"
                            style={{ width: `${f.progress}%` }}
                          />
                        </div>
                      ) : null}
                    </div>
                    {f.error ? (
                      <Button size="sm" variant="ghost" onClick={() => retryFile(f.id)} className="text-xs text-primary shrink-0">
                        Retry
                      </Button>
                    ) : f.done ? (
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                    ) : (
                      <span className="text-xs text-muted-foreground font-mono w-10 text-right">{Math.round(f.progress)}%</span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                      className="p-1 rounded-lg hover:bg-secondary transition-colors"
                      aria-label="Remove"
                    >
                      <X className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <ResultsPanel files={files} onReset={resetUpload} />
        )}

        {/* Trust bar */}
        <div className="mt-8 flex items-center justify-center gap-4 text-xs text-muted-foreground/50">
          <span>No signup needed</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/20" />
          <span>CDN-powered</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/20" />
          <span>rapidx.me</span>
        </div>
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 text-accent" />
          </div>
          <span className="text-sm font-medium text-foreground">
            {files.length} file{files.length > 1 ? "s" : ""} uploaded
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset} className="gap-1.5 text-muted-foreground hover:text-foreground">
          <RotateCcw className="w-3.5 h-3.5" /> Upload more
        </Button>
      </div>

      {/* Preview + links */}
      {activeFile && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Image preview */}
          <div className="bg-secondary/20 flex items-center justify-center p-4 sm:p-6 max-h-72">
            <img
              src={activeFile.preview}
              alt=""
              className="max-h-60 max-w-full rounded-xl object-contain"
            />
          </div>

          {/* Thumbnails */}
          {files.length > 1 && (
            <div className="flex gap-1.5 px-4 py-3 border-t border-border/50 overflow-x-auto">
              {files.map((f, i) => (
                <button
                  key={f.id}
                  onClick={() => setActiveTab(i)}
                  className={`shrink-0 w-11 h-11 rounded-lg overflow-hidden border-2 transition-colors ${
                    activeTab === i ? "border-primary" : "border-transparent hover:border-border"
                  }`}
                >
                  <img src={f.preview} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Link formats */}
          <div className="px-3 sm:px-4 py-3 space-y-1.5 border-t border-border/50">
            {linkFormats(activeFile.url, activeFile.file.name).map((fmt, idx) => (
              <div key={fmt.label} className="flex items-center gap-2">
                <span className="text-xs w-20 shrink-0 flex items-center gap-1 text-muted-foreground">
                  <fmt.icon className="w-3 h-3" />
                  {fmt.label}
                </span>
                <div className="flex-1 bg-secondary/40 rounded-lg px-2.5 py-1.5 text-xs font-mono text-foreground/80 truncate border border-border/30">
                  {fmt.value}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(fmt.value, idx)}
                  className="shrink-0 h-7 px-2 text-muted-foreground hover:text-foreground"
                >
                  {copiedIdx === idx ? (
                    <CheckCircle2 className="w-3 h-3 text-accent" />
                  ) : (
                    <Clipboard className="w-3 h-3" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroUpload;
