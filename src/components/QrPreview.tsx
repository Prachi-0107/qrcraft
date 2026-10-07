import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import type { QRStyleConfig, ScannabilityInfo } from "../types";
import {
  Download,
  Copy,
  Check,
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileCode,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";

interface QrPreviewProps {
  payload: string;
  styleConfig: QRStyleConfig;
  scannability: ScannabilityInfo;
  hasValidContent: boolean;
  onToast: (msg: string, kind?: "success" | "error" | "info") => void;
  onSaveHistory: (previewDataUrl?: string) => void;
}

export function QrPreview({
  payload,
  styleConfig,
  scannability,
  hasValidContent,
  onToast,
  onSaveHistory,
}: QrPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCodeInstanceRef = useRef<QRCodeStyling | null>(null);
  const [copiedImage, setCopiedImage] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [showPayloadDetails, setShowPayloadDetails] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Initialize QRCodeStyling instance once
  useEffect(() => {
    if (!containerRef.current) return;

    const qr = new QRCodeStyling({
      width: 280,
      height: 280,
      data: payload || "https://qrcraft.app",
      margin: styleConfig.margin,
      qrOptions: {
        errorCorrectionLevel: styleConfig.errorCorrectionLevel,
      },
      image: styleConfig.logoUrl,
      imageOptions: {
        hideBackgroundDots: styleConfig.hideBackgroundDots,
        imageSize: styleConfig.logoSize,
        margin: styleConfig.logoMargin,
        crossOrigin: "anonymous",
      },
      dotsOptions: {
        type: styleConfig.dotsType,
        color: styleConfig.isGradient ? undefined : styleConfig.dotsColor,
        gradient: styleConfig.isGradient
          ? {
              type: styleConfig.gradientType,
              rotation: (styleConfig.gradientRotation * Math.PI) / 180,
              colorStops: [
                { offset: 0, color: styleConfig.dotsColor },
                { offset: 1, color: styleConfig.dotsColor2 || styleConfig.dotsColor },
              ],
            }
          : undefined,
      },
      cornersSquareOptions: {
        type: styleConfig.cornersSquareType,
        color: styleConfig.customCornerColors
          ? styleConfig.cornersSquareColor
          : styleConfig.isGradient
          ? undefined
          : styleConfig.dotsColor,
      },
      cornersDotOptions: {
        type: styleConfig.cornersDotType,
        color: styleConfig.customCornerColors
          ? styleConfig.cornersDotColor
          : styleConfig.isGradient
          ? undefined
          : styleConfig.dotsColor,
      },
      backgroundOptions: {
        color: styleConfig.transparentBackground ? "transparent" : styleConfig.backgroundColor,
      },
    });

    qrCodeInstanceRef.current = qr;
    containerRef.current.innerHTML = "";
    qr.append(containerRef.current);
  }, []);

  // Update QR Code on state changes
  useEffect(() => {
    const qr = qrCodeInstanceRef.current;
    if (!qr) return;

    qr.update({
      data: payload || "https://qrcraft.app",
      margin: styleConfig.margin,
      qrOptions: {
        errorCorrectionLevel: styleConfig.errorCorrectionLevel,
      },
      image: styleConfig.logoUrl,
      imageOptions: {
        hideBackgroundDots: styleConfig.hideBackgroundDots,
        imageSize: styleConfig.logoSize,
        margin: styleConfig.logoMargin,
        crossOrigin: "anonymous",
      },
      dotsOptions: {
        type: styleConfig.dotsType,
        color: styleConfig.isGradient ? undefined : styleConfig.dotsColor,
        gradient: styleConfig.isGradient
          ? {
              type: styleConfig.gradientType,
              rotation: (styleConfig.gradientRotation * Math.PI) / 180,
              colorStops: [
                { offset: 0, color: styleConfig.dotsColor },
                { offset: 1, color: styleConfig.dotsColor2 || styleConfig.dotsColor },
              ],
            }
          : undefined,
      },
      cornersSquareOptions: {
        type: styleConfig.cornersSquareType,
        color: styleConfig.customCornerColors
          ? styleConfig.cornersSquareColor
          : styleConfig.isGradient
          ? undefined
          : styleConfig.dotsColor,
      },
      cornersDotOptions: {
        type: styleConfig.cornersDotType,
        color: styleConfig.customCornerColors
          ? styleConfig.cornersDotColor
          : styleConfig.isGradient
          ? undefined
          : styleConfig.dotsColor,
      },
      backgroundOptions: {
        color: styleConfig.transparentBackground ? "transparent" : styleConfig.backgroundColor,
      },
    });
  }, [payload, styleConfig]);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // safe fallback
    }
  };

  // Helper to capture a thumbnail for history storage
  const generateThumbnail = async (): Promise<string | undefined> => {
    const qr = qrCodeInstanceRef.current;
    if (!qr) return undefined;
    try {
      const blob = await qr.getRawData("png");
      if (!blob) return undefined;
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob as Blob);
      });
    } catch {
      return undefined;
    }
  };

  // Download Handler (PNG, SVG)
  const handleDownload = async (ext: "png" | "svg") => {
    const qr = qrCodeInstanceRef.current;
    if (!qr || !hasValidContent) return;

    setIsExporting(true);
    try {
      // Temporarily set export resolution on instance
      await qr.update({
        width: styleConfig.size,
        height: styleConfig.size,
      });

      const dateStr = new Date().toISOString().slice(0, 10);
      const filename = `qrcraft-code-${dateStr}`;

      await qr.download({
        name: filename,
        extension: ext,
      });

      // Restore preview resolution
      await qr.update({
        width: 280,
        height: 280,
      });

      triggerConfetti();
      onToast(`Downloaded ${filename}.${ext}`, "success");

      // Save to recent history
      const thumb = await generateThumbnail();
      onSaveHistory(thumb);
    } catch (err) {
      console.error("Export error:", err);
      onToast("Failed to download QR Code", "error");
    } finally {
      setIsExporting(false);
    }
  };

  // Copy Image to Clipboard
  const handleCopyImage = async () => {
    const qr = qrCodeInstanceRef.current;
    if (!qr || !hasValidContent) return;

    try {
      const blob = await qr.getRawData("png");
      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob as Blob,
          }),
        ]);
        setCopiedImage(true);
        triggerConfetti();
        onToast("QR Code image copied to clipboard!", "success");
        setTimeout(() => setCopiedImage(false), 2200);

        const thumb = await generateThumbnail();
        onSaveHistory(thumb);
      } else {
        throw new Error("ClipboardItem not supported");
      }
    } catch (err) {
      console.error("Copy image failed:", err);
      // Fallback: copy payload text
      handleCopyText();
    }
  };

  // Copy Payload text
  const handleCopyText = () => {
    if (!payload) return;
    navigator.clipboard.writeText(payload);
    setCopiedText(true);
    onToast("Payload text copied to clipboard!", "info");
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <aside className="preview-card-pro">
      <div className="preview-topline flex items-center justify-between mb-4">
        <div>
          <span className="preview-kicker">REAL-TIME ENGINE</span>
          <h2 className="preview-title text-base sm:text-lg font-bold">Interactive Preview</h2>
        </div>
        <span className="live-pill">
          <i /> Live Sync
        </span>
      </div>

      {/* QR Code Canvas Stage */}
      <div className="qr-stage-pro">
        <div
          ref={containerRef}
          className="qr-render-box"
          style={{
            maxWidth: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </div>

      {/* Scannability Assessment */}
      <div className="reliability-assessment mt-4 p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-semibold text-xs">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>Scan Reliability</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted font-mono">{scannability.contrastRatio}:1 Contrast</span>
            <span
              className={`reliability-badge ${scannability.status.toLowerCase()}`}
              title={`Readability score: ${scannability.score}%`}
            >
              <i />
              {scannability.status} ({scannability.score}%)
            </span>
          </div>
        </div>

        {/* Warnings & Suggestions */}
        {scannability.warnings.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-[var(--line)] space-y-1">
            {scannability.warnings.map((warn, i) => (
              <div key={i} className="text-[11px] text-amber-600 dark:text-amber-400 flex items-start gap-1.5 leading-tight">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{warn}</span>
              </div>
            ))}
            {scannability.recommendations.map((rec, i) => (
              <div key={`rec-${i}`} className="text-[10px] text-muted flex items-start gap-1.5 pl-5 leading-tight">
                <span>💡 {rec}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div className="preview-actions-grid mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
        <button
          type="button"
          className="button primary text-xs col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5"
          onClick={() => handleDownload("png")}
          disabled={!hasValidContent || isExporting}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download PNG</span>
        </button>

        <button
          type="button"
          className="button secondary text-xs flex items-center justify-center gap-1.5"
          onClick={() => handleDownload("svg")}
          disabled={!hasValidContent || isExporting}
          title="Download resolution-independent SVG vector file"
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Vector SVG</span>
        </button>

        <button
          type="button"
          className="button secondary text-xs flex items-center justify-center gap-1.5"
          onClick={handleCopyImage}
          disabled={!hasValidContent}
          title="Copy image directly to clipboard"
        >
          {copiedImage ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedImage ? "Copied!" : "Copy PNG"}</span>
        </button>
      </div>

      {/* Collapsible: What Scanners See */}
      <div className="mt-3 pt-3 border-t border-[var(--line)]">
        <button
          type="button"
          className="w-full flex items-center justify-between text-xs text-muted hover:text-[var(--text)] transition-colors py-1"
          onClick={() => setShowPayloadDetails(!showPayloadDetails)}
        >
          <span className="font-medium flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-blue-500" />
            Encoded Data Preview
          </span>
          {showPayloadDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showPayloadDetails && (
          <div className="mt-2 p-2.5 rounded-lg bg-[var(--surface-3)] font-mono text-[11px] break-all leading-relaxed relative text-muted">
            <div className="flex justify-between items-start gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">Raw Payload</span>
              <button
                type="button"
                className="text-[10px] text-blue-500 hover:underline flex items-center gap-1"
                onClick={handleCopyText}
              >
                {copiedText ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                {copiedText ? "Copied" : "Copy"}
              </button>
            </div>
            {payload}
          </div>
        )}
      </div>

      <p className="privacy-note-pro text-[11px] text-center text-muted mt-3">
        🔒 100% Client-Side generation. Your data and images never leave your browser.
      </p>
    </aside>
  );
}
