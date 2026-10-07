import type { QRStyleConfig } from "../types";
import type { DotType, CornerSquareType, CornerDotType, ErrorCorrectionLevel } from "qr-code-styling";
import { Sliders, Palette, Shapes, Shield, RotateCw, Check } from "lucide-react";

interface StyleCustomizerProps {
  styleConfig: QRStyleConfig;
  onChange: (updater: (prev: QRStyleConfig) => QRStyleConfig) => void;
  onReset: () => void;
}

const DOT_STYLES: { type: DotType; label: string }[] = [
  { type: "square", label: "Square" },
  { type: "rounded", label: "Rounded" },
  { type: "dots", label: "Dots" },
  { type: "classy", label: "Classy" },
  { type: "classy-rounded", label: "Classy Round" },
  { type: "extra-rounded", label: "Extra Round" },
];

const CORNER_SQUARE_STYLES: { type: CornerSquareType; label: string }[] = [
  { type: "square", label: "Square" },
  { type: "extra-rounded", label: "Rounded" },
  { type: "dot", label: "Circle" },
];

const CORNER_DOT_STYLES: { type: CornerDotType; label: string }[] = [
  { type: "square", label: "Square" },
  { type: "dot", label: "Dot" },
];

const ERROR_CORRECTIONS: { level: ErrorCorrectionLevel; label: string; desc: string; percent: string }[] = [
  { level: "L", label: "Low", desc: "Best for clean QR codes with high data density", percent: "7%" },
  { level: "M", label: "Medium", desc: "Standard general-purpose balance", percent: "15%" },
  { level: "Q", label: "Quartile", desc: "Good resilience against scratches and minor covers", percent: "25%" },
  { level: "H", label: "High", desc: "Recommended when embedding logos or artwork", percent: "30%" },
];

export function StyleCustomizer({ styleConfig, onChange, onReset }: StyleCustomizerProps) {
  const updateStyle = <K extends keyof QRStyleConfig>(key: K, val: QRStyleConfig[K]) => {
    onChange((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="style-customizer-space space-y-6">
      {/* 1. Colors & Gradient */}
      <div className="sub-section">
        <div className="flex items-center justify-between mb-3">
          <span className="sub-section-title flex items-center gap-1.5 font-semibold text-xs text-muted uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5 text-blue-500" />
            Color Palette & Gradients
          </span>
          <label className="toggle-label flex items-center gap-2 cursor-pointer text-xs font-medium">
            <span>Gradient</span>
            <input
              type="checkbox"
              className="sr-only"
              checked={styleConfig.isGradient}
              onChange={(e) => updateStyle("isGradient", e.target.checked)}
            />
            <div className={`switch-track ${styleConfig.isGradient ? "active" : ""}`}>
              <div className="switch-thumb" />
            </div>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          {/* Foreground Color 1 */}
          <div className="field-wrap">
            <span className="field-label">{styleConfig.isGradient ? "Gradient Start" : "Foreground Color"}</span>
            <div className="color-field">
              <input
                type="color"
                aria-label="Foreground Color"
                value={styleConfig.dotsColor}
                onChange={(e) => updateStyle("dotsColor", e.target.value)}
              />
              <input
                type="text"
                aria-label="Foreground Color Hex"
                value={styleConfig.dotsColor}
                onChange={(e) => updateStyle("dotsColor", e.target.value)}
                maxLength={7}
              />
            </div>
          </div>

          {/* Foreground Color 2 (if Gradient) OR Background */}
          {styleConfig.isGradient ? (
            <div className="field-wrap">
              <span className="field-label">Gradient End</span>
              <div className="color-field">
                <input
                  type="color"
                  aria-label="Gradient End Color"
                  value={styleConfig.dotsColor2}
                  onChange={(e) => updateStyle("dotsColor2", e.target.value)}
                />
                <input
                  type="text"
                  aria-label="Gradient End Color Hex"
                  value={styleConfig.dotsColor2}
                  onChange={(e) => updateStyle("dotsColor2", e.target.value)}
                  maxLength={7}
                />
              </div>
            </div>
          ) : (
            <div className="field-wrap">
              <div className="flex justify-between items-center">
                <span className="field-label">Background Color</span>
                <label className="flex items-center gap-1.5 text-[11px] text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={styleConfig.transparentBackground}
                    onChange={(e) => updateStyle("transparentBackground", e.target.checked)}
                  />
                  <span>Transparent</span>
                </label>
              </div>
              <div className={`color-field ${styleConfig.transparentBackground ? "opacity-50 pointer-events-none" : ""}`}>
                <input
                  type="color"
                  aria-label="Background Color"
                  value={styleConfig.backgroundColor}
                  onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                  disabled={styleConfig.transparentBackground}
                />
                <input
                  type="text"
                  aria-label="Background Color Hex"
                  value={styleConfig.transparentBackground ? "Transparent" : styleConfig.backgroundColor}
                  onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                  disabled={styleConfig.transparentBackground}
                  maxLength={7}
                />
              </div>
            </div>
          )}
        </div>

        {/* If Gradient is ON, show background color and gradient options */}
        {styleConfig.isGradient && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 pt-2 border-t border-[var(--line)]">
            <div className="field-wrap">
              <div className="flex justify-between items-center">
                <span className="field-label">Background Color</span>
                <label className="flex items-center gap-1.5 text-[11px] text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={styleConfig.transparentBackground}
                    onChange={(e) => updateStyle("transparentBackground", e.target.checked)}
                  />
                  <span>Transparent</span>
                </label>
              </div>
              <div className={`color-field ${styleConfig.transparentBackground ? "opacity-50 pointer-events-none" : ""}`}>
                <input
                  type="color"
                  aria-label="Background Color"
                  value={styleConfig.backgroundColor}
                  onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                  disabled={styleConfig.transparentBackground}
                />
                <input
                  type="text"
                  aria-label="Background Color Hex"
                  value={styleConfig.transparentBackground ? "Transparent" : styleConfig.backgroundColor}
                  onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                  disabled={styleConfig.transparentBackground}
                  maxLength={7}
                />
              </div>
            </div>

            <div className="field-wrap">
              <div className="flex justify-between items-center">
                <span className="field-label">Gradient Direction</span>
                <span className="text-[11px] font-bold text-blue-500">{styleConfig.gradientRotation}°</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  className={`px-2 py-1 text-xs rounded border ${
                    styleConfig.gradientType === "linear" ? "bg-blue-500 text-white border-blue-500" : "border-[var(--line-strong)] text-muted"
                  }`}
                  onClick={() => updateStyle("gradientType", "linear")}
                >
                  Linear
                </button>
                <button
                  type="button"
                  className={`px-2 py-1 text-xs rounded border ${
                    styleConfig.gradientType === "radial" ? "bg-blue-500 text-white border-blue-500" : "border-[var(--line-strong)] text-muted"
                  }`}
                  onClick={() => updateStyle("gradientType", "radial")}
                >
                  Radial
                </button>
                {styleConfig.gradientType === "linear" && (
                  <input
                    type="range"
                    aria-label="Gradient Rotation"
                    min={0}
                    max={360}
                    step={15}
                    value={styleConfig.gradientRotation}
                    onChange={(e) => updateStyle("gradientRotation", Number(e.target.value))}
                    className="flex-1"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Patterns & Shapes */}
      <div className="sub-section">
        <span className="sub-section-title flex items-center gap-1.5 font-semibold text-xs text-muted uppercase tracking-wider mb-3">
          <Shapes className="w-3.5 h-3.5 text-blue-500" />
          Pattern & Corner Shapes
        </span>

        {/* Dot Style */}
        <div className="mb-4">
          <label className="field-label block mb-1.5">Module / Body Pattern</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {DOT_STYLES.map(({ type, label }) => {
              const active = styleConfig.dotsType === type;
              return (
                <button
                  key={type}
                  type="button"
                  className={`shape-select-btn ${active ? "active" : ""}`}
                  onClick={() => updateStyle("dotsType", type)}
                >
                  <div className={`shape-glyph dot-${type}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Corner Eyes Styles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="field-label block mb-1.5">Corner Frame (Square)</label>
            <div className="grid grid-cols-3 gap-2">
              {CORNER_SQUARE_STYLES.map(({ type, label }) => {
                const active = styleConfig.cornersSquareType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    className={`shape-select-btn ${active ? "active" : ""}`}
                    onClick={() => updateStyle("cornersSquareType", type)}
                  >
                    <div className={`corner-frame-glyph frame-${type}`} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="field-label block mb-1.5">Corner Dot (Eyeball)</label>
            <div className="grid grid-cols-2 gap-2">
              {CORNER_DOT_STYLES.map(({ type, label }) => {
                const active = styleConfig.cornersDotType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    className={`shape-select-btn ${active ? "active" : ""}`}
                    onClick={() => updateStyle("cornersDotType", type)}
                  >
                    <div className={`corner-dot-glyph dot-${type}`} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Custom Corner Eye Colors */}
        <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold">Custom Corner Eye Colors</span>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
              <input
                type="checkbox"
                className="sr-only"
                checked={styleConfig.customCornerColors}
                onChange={(e) => updateStyle("customCornerColors", e.target.checked)}
              />
              <div className={`switch-track ${styleConfig.customCornerColors ? "active" : ""}`}>
                <div className="switch-thumb" />
              </div>
            </label>
          </div>

          {styleConfig.customCornerColors && (
            <div className="grid grid-cols-2 gap-3 mt-2 pt-2 border-t border-[var(--line)]">
              <div className="field-wrap">
                <span className="field-label text-[11px]">Frame Color</span>
                <div className="color-field">
                  <input
                    type="color"
                    aria-label="Corner Frame Color"
                    value={styleConfig.cornersSquareColor}
                    onChange={(e) => updateStyle("cornersSquareColor", e.target.value)}
                  />
                  <input
                    type="text"
                    aria-label="Corner Frame Color Hex"
                    value={styleConfig.cornersSquareColor}
                    onChange={(e) => updateStyle("cornersSquareColor", e.target.value)}
                    maxLength={7}
                  />
                </div>
              </div>

              <div className="field-wrap">
                <span className="field-label text-[11px]">Inner Dot Color</span>
                <div className="color-field">
                  <input
                    type="color"
                    aria-label="Corner Inner Dot Color"
                    value={styleConfig.cornersDotColor}
                    onChange={(e) => updateStyle("cornersDotColor", e.target.value)}
                  />
                  <input
                    type="text"
                    aria-label="Corner Inner Dot Color Hex"
                    value={styleConfig.cornersDotColor}
                    onChange={(e) => updateStyle("cornersDotColor", e.target.value)}
                    maxLength={7}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Error Correction Level */}
      <div className="sub-section">
        <div className="flex items-center justify-between mb-2">
          <span className="sub-section-title flex items-center gap-1.5 font-semibold text-xs text-muted uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-blue-500" />
            Error Correction Level
          </span>
          <span className="text-[11px] text-muted">Data Redundancy</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ERROR_CORRECTIONS.map(({ level, label, desc, percent }) => {
            const active = styleConfig.errorCorrectionLevel === level;
            return (
              <button
                key={level}
                type="button"
                className={`ecc-card-btn ${active ? "active" : ""}`}
                onClick={() => updateStyle("errorCorrectionLevel", level)}
                title={desc}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm">{level}</span>
                  <span className="text-[10px] font-semibold opacity-75">{percent}</span>
                </div>
                <div className="text-left font-medium text-[11px] mb-1">{label}</div>
                <div className="text-[10px] text-muted text-left line-clamp-2 leading-tight">{desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Sizing & Margin */}
      <div className="sub-section">
        <span className="sub-section-title flex items-center gap-1.5 font-semibold text-xs text-muted uppercase tracking-wider mb-3">
          <Sliders className="w-3.5 h-3.5 text-blue-500" />
          Dimensions & Spacing
        </span>

        <div className="space-y-4">
          <div className="range-control">
            <div className="control-label">
              <span>Export Resolution (Canvas Size)</span>
              <output>{styleConfig.size}px</output>
            </div>
            <input
              type="range"
              aria-label="Export Resolution"
              min={180}
              max={1024}
              step={32}
              value={styleConfig.size}
              onChange={(e) => updateStyle("size", Number(e.target.value))}
              style={{
                "--progress": `${((styleConfig.size - 180) / (1024 - 180)) * 100}%`,
              } as React.CSSProperties}
            />
            <div className="range-minmax">
              <span>180px (Compact)</span>
              <span>512px (Standard)</span>
              <span>1024px (Ultra HD)</span>
            </div>
          </div>

          <div className="range-control">
            <div className="control-label">
              <span>Quiet Zone (Padding / Margin)</span>
              <output>{styleConfig.margin}px</output>
            </div>
            <input
              type="range"
              aria-label="Quiet Zone"
              min={0}
              max={48}
              step={4}
              value={styleConfig.margin}
              onChange={(e) => updateStyle("margin", Number(e.target.value))}
              style={{
                "--progress": `${(styleConfig.margin / 48) * 100}%`,
              } as React.CSSProperties}
            />
            <div className="range-minmax">
              <span>0px (Border Flush)</span>
              <span>16px (Recommended)</span>
              <span>48px (Spacious)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reset button */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={onReset}
          className="reset-link inline-flex items-center gap-1.5 hover:underline text-xs"
        >
          <RotateCw className="w-3.5 h-3.5" />
          Reset All Style Customizations to Defaults
        </button>
      </div>
    </div>
  );
}
