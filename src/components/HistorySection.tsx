import type { RecentQRCode } from "../types";
import { Clock, Trash2, ArrowUpRight, Copy, Check, Sparkles } from "lucide-react";
import { useState } from "react";

interface HistorySectionProps {
  recentList: RecentQRCode[];
  onReuse: (item: RecentQRCode) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onToast: (msg: string) => void;
}

function formatTimeAgo(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export function HistorySection({
  recentList,
  onReuse,
  onDelete,
  onClearAll,
  onToast,
}: HistorySectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPayload = (item: RecentQRCode) => {
    navigator.clipboard.writeText(item.payload);
    setCopiedId(item.id);
    onToast("Payload copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (recentList.length === 0) {
    return (
      <div className="recent-empty">
        <div>
          <Sparkles className="w-5 h-5 text-blue-500" />
        </div>
        <strong>No recent QR codes saved yet</strong>
        <p>When you customize, download, or copy a QR code, it will be automatically saved here for quick reuse.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="recent-head flex justify-between items-center text-xs text-muted mb-2">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          Saved locally in browser ({recentList.length})
        </span>
        <button
          type="button"
          onClick={onClearAll}
          className="text-red-500 hover:underline font-semibold"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {recentList.map((item) => (
          <div key={item.id} className="recent-card-pro">
            <div className="flex gap-3 items-start">
              {item.previewDataUrl ? (
                <div className="w-14 h-14 rounded-lg bg-white p-1 border border-[var(--line)] shrink-0 overflow-hidden flex items-center justify-center shadow-sm">
                  <img src={item.previewDataUrl} alt={item.title} className="max-w-full max-h-full object-contain" />
                </div>
              ) : (
                <div
                  className="w-14 h-14 rounded-lg border border-[var(--line)] shrink-0 flex items-center justify-center font-bold text-xs"
                  style={{
                    backgroundColor: item.styleConfig.backgroundColor,
                    color: item.styleConfig.dotsColor,
                  }}
                >
                  QR
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="type-badge">{item.type}</span>
                  <span className="text-[10px] text-muted">{formatTimeAgo(item.createdAt)}</span>
                </div>
                <div className="font-semibold text-xs truncate" title={item.title}>
                  {item.title}
                </div>
                <div className="text-[10px] text-muted truncate mt-0.5" title={item.payload}>
                  {item.payload}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-[var(--line)]">
              <button
                type="button"
                className="button secondary text-xs py-1 px-2.5 flex-1 flex items-center justify-center gap-1 font-semibold"
                onClick={() => onReuse(item)}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                Reuse
              </button>

              <button
                type="button"
                className="button ghost text-xs py-1 px-2 text-muted hover:text-blue-500"
                onClick={() => handleCopyPayload(item)}
                title="Copy Payload Text"
              >
                {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                className="button ghost text-xs py-1 px-2 text-muted hover:text-red-500"
                onClick={() => onDelete(item.id)}
                title="Delete from history"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
