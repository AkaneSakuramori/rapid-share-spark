import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeHighlightProps {
  code: string;
  language?: string;
}

const keywords = /\b(const|let|var|function|return|import|from|export|default|if|else|for|while|async|await|new|class|extends|try|catch|throw|typeof|instanceof|in|of|with|as|true|false|null|undefined|void|delete|yield|switch|case|break|continue|do|finally|this|super|static|get|set|def|print|open|requests|headers|files)\b/g;
const strings = /(["'`])(?:(?=(\\?))\2.)*?\1/g;
const comments = /(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/gm;
const methods = /\.([a-zA-Z_]\w*)\s*\(/g;
const numbers = /\b(\d+\.?\d*)\b/g;
const curlFlags = /(-[A-Z]+|--[a-z-]+)/g;

const highlight = (code: string): string => {
  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Order matters: comments first, then strings, then keywords
  html = html.replace(comments, '<span class="text-muted-foreground/60 italic">$&</span>');
  html = html.replace(strings, '<span class="text-emerald-600 dark:text-emerald-400">$&</span>');
  html = html.replace(keywords, '<span class="text-primary font-semibold">$&</span>');
  html = html.replace(methods, '.<span class="text-amber-600 dark:text-amber-400">$1</span>(');
  html = html.replace(numbers, '<span class="text-orange-500">$1</span>');
  html = html.replace(curlFlags, '<span class="text-sky-500">$1</span>');

  return html;
};

const CodeHighlight = ({ code, language }: CodeHighlightProps) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg bg-secondary border border-border overflow-hidden">
      {language && (
        <div className="flex items-center justify-between px-4 py-1.5 border-b border-border bg-secondary/80">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">{language}</span>
          <button
            onClick={copy}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
            aria-label="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
      {!language && (
        <button
          onClick={copy}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100 p-1.5 rounded bg-secondary/80"
          aria-label="Copy code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      )}
      <pre className="p-4 text-sm font-mono overflow-x-auto leading-relaxed">
        <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
      </pre>
    </div>
  );
};

export default CodeHighlight;
