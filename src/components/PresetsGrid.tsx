import { QR_PRESETS } from "../utils/presets";
import type { QRPreset, QRStyleConfig } from "../types";
import { Check, Sparkles } from "lucide-react";

interface PresetsGridProps {
  currentStyle: QRStyleConfig;
  onSelectPreset: (preset: QRPreset) => void;
}

export function PresetsGrid({ currentStyle, onSelectPreset }: PresetsGridProps) {
  return (
    <div className="presets-wrapper space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">
          Pick a curated aesthetic foundation, then customize any parameter freely.
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QR_PRESETS.map((preset) => {
          const isSelected =
            currentStyle.dotsColor === preset.dotsColor &&
            currentStyle.backgroundColor === preset.backgroundColor &&
            currentStyle.dotsType === preset.dotsType;

          return (
            <button
              key={preset.id}
              type="button"
              className={`preset-card-pro ${isSelected ? "selected" : ""}`}
              onClick={() => onSelectPreset(preset)}
            >
              {isSelected && (
                <div className="preset-check-badge">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}

              {/* Mini visual swatch representing this preset */}
              <div
                className="preset-preview-mini"
                style={{
                  backgroundColor: preset.backgroundColor,
                  borderColor: isSelected ? "var(--blue)" : "var(--line)",
                }}
              >
                <div
                  className="preset-preview-icon"
                  style={{
                    background: preset.isGradient
                      ? `linear-gradient(${preset.gradientRotation}deg, ${preset.dotsColor}, ${preset.dotsColor2 || preset.dotsColor})`
                      : preset.dotsColor,
                  }}
                />
              </div>

              <div className="text-left w-full">
                <div className="font-semibold text-xs leading-tight">{preset.name}</div>
                <div className="text-[10px] text-muted line-clamp-1 mt-0.5">{preset.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
