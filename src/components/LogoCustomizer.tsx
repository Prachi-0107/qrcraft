import { useRef } from "react";
import type { QRStyleConfig } from "../types";
import { LOGO_PRESETS } from "../utils/logoPresets";
import { Image, Upload, Trash2, AlertTriangle, ShieldCheck } from "lucide-react";

interface LogoCustomizerProps {
  styleConfig: QRStyleConfig;
  onChange: (updater: (prev: QRStyleConfig) => QRStyleConfig) => void;
}

export function LogoCustomizer({ styleConfig, onChange }: LogoCustomizerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert("Image file size should be less than 3 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onChange((prev) => ({
          ...prev,
          logoUrl: dataUrl,
          // Proactively bump error correction to Q or H if currently L
          errorCorrectionLevel: prev.errorCorrectionLevel === "L" ? "Q" : prev.errorCorrectionLevel,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (dataUrl: string) => {
    onChange((prev) => ({
      ...prev,
      logoUrl: dataUrl,
      errorCorrectionLevel: prev.errorCorrectionLevel === "L" ? "Q" : prev.errorCorrectionLevel,
    }));
  };

  const handleRemoveLogo = () => {
    onChange((prev) => ({
      ...prev,
      logoUrl: undefined,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const updateStyle = <K extends keyof QRStyleConfig>(key: K, val: QRStyleConfig[K]) => {
    onChange((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="logo-customizer space-y-4">
      {/* Upload button & current logo preview */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          className="hidden"
          onChange={handleFileUpload}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="upload-drop-btn flex-1"
        >
          <div className="upload-icon-circle">
            <Upload className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-xs">Upload Custom Logo</div>
            <div className="text-[11px] text-muted">PNG, JPG, SVG, or WEBP up to 3MB</div>
          </div>
        </button>

        {styleConfig.logoUrl && (
          <div className="flex items-center gap-2 p-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
            <div className="w-12 h-12 rounded-lg bg-white p-1 flex items-center justify-center border border-[var(--line)] overflow-hidden">
              <img
                src={styleConfig.logoUrl}
                alt="Active QR Logo"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Remove Logo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Preset Logos */}
      <div>
        <label className="field-label block mb-2">Or Choose from Quick Brand Icons</label>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {LOGO_PRESETS.map((preset) => {
            const isSelected = styleConfig.logoUrl === preset.dataUrl;
            return (
              <button
                key={preset.id}
                type="button"
                className={`logo-preset-btn ${isSelected ? "selected" : ""}`}
                onClick={() => handleSelectPreset(preset.dataUrl)}
                title={preset.name}
              >
                <div className="w-7 h-7 flex items-center justify-center">
                  <img src={preset.dataUrl} alt={preset.name} className="w-6 h-6 object-contain" />
                </div>
                <span className="text-[10px] truncate max-w-full">{preset.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Logo options if logo is present */}
      {styleConfig.logoUrl && (
        <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] space-y-4">
          <div className="range-control mb-0">
            <div className="control-label">
              <span>Logo Scale Ratio</span>
              <output>{Math.round(styleConfig.logoSize * 100)}%</output>
            </div>
            <input
              type="range"
              aria-label="Logo Scale"
              min={0.15}
              max={0.38}
              step={0.01}
              value={styleConfig.logoSize}
              onChange={(e) => updateStyle("logoSize", Number(e.target.value))}
              style={{
                "--progress": `${((styleConfig.logoSize - 0.15) / (0.38 - 0.15)) * 100}%`,
              } as React.CSSProperties}
            />
          </div>

          <div className="range-control mb-0">
            <div className="control-label">
              <span>Logo Padding (Quiet Margin)</span>
              <output>{styleConfig.logoMargin}px</output>
            </div>
            <input
              type="range"
              aria-label="Logo Margin"
              min={0}
              max={16}
              step={2}
              value={styleConfig.logoMargin}
              onChange={(e) => updateStyle("logoMargin", Number(e.target.value))}
              style={{
                "--progress": `${(styleConfig.logoMargin / 16) * 100}%`,
              } as React.CSSProperties}
            />
          </div>

          <label className="toggle-label flex items-center justify-between cursor-pointer text-xs font-medium pt-1">
            <span>Clear background dots directly behind logo</span>
            <input
              type="checkbox"
              className="sr-only"
              checked={styleConfig.hideBackgroundDots}
              onChange={(e) => updateStyle("hideBackgroundDots", e.target.checked)}
            />
            <div className={`switch-track ${styleConfig.hideBackgroundDots ? "active" : ""}`}>
              <div className="switch-thumb" />
            </div>
          </label>

          {styleConfig.errorCorrectionLevel === "L" && (
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Tip: Low ('L') error correction can make logo codes unscannable. Consider switching to High ('H') in Style settings.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
