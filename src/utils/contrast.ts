import type { ScannabilityInfo, QRStyleConfig } from "../types";

/**
 * Converts a hex color string (#RGB, #RRGGBB) to { r, g, b } (0-255).
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  if (clean.length !== 6) return null;
  const num = parseInt(clean, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Calculates standard sRGB relative luminance according to WCAG 2.1 specifications.
 */
export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0.5;
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculates WCAG contrast ratio between two colors (range: 1.0 to 21.0).
 */
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
}

/**
 * Evaluates real-time scan reliability of a QR configuration.
 */
export function evaluateScannability(style: QRStyleConfig): ScannabilityInfo {
  const bg = style.transparentBackground ? "#FFFFFF" : style.backgroundColor;
  const fg = style.dotsColor;
  const fg2 = style.isGradient ? style.dotsColor2 : style.dotsColor;

  const contrast1 = getContrastRatio(fg, bg);
  const contrast2 = getContrastRatio(fg2, bg);
  const minContrast = Math.min(contrast1, contrast2);

  const lumFg = getLuminance(fg);
  const lumBg = getLuminance(bg);
  const isInverted = lumFg > lumBg; // Light foreground on dark background

  const warnings: string[] = [];
  const recommendations: string[] = [];

  let score = 100;

  // 1. Contrast checks
  if (minContrast < 2.0) {
    score -= 50;
    warnings.push("Extremely low color contrast. Camera sensors may fail to distinguish code modules.");
    recommendations.push("Increase the contrast between foreground and background colors.");
  } else if (minContrast < 3.2) {
    score -= 30;
    warnings.push("Sub-optimal color contrast. Scanning may be slow or fail in low light.");
    recommendations.push("Use a darker foreground or lighter background for better readability.");
  } else if (minContrast < 4.5) {
    score -= 10;
  }

  // 2. Inverted colors check
  if (isInverted) {
    score -= 15;
    warnings.push("Inverted color scheme (light dots on dark background).");
    recommendations.push("Most smartphone cameras support inverted codes, but standard barcode hardware scanners may reject them.");
  }

  // 3. Logo and Error Correction check
  if (style.logoUrl) {
    if (style.errorCorrectionLevel === "L") {
      score -= 25;
      warnings.push("Logo embedded with Low ('L' 7%) error correction.");
      recommendations.push("Switch Error Correction to 'H' (30%) or 'Q' (25%) so the QR code can recover the data covered by the logo.");
    } else if (style.errorCorrectionLevel === "M") {
      score -= 10;
      warnings.push("Logo embedded with Medium ('M' 15%) error correction.");
      recommendations.push("We recommend setting Error Correction to 'H' (High - 30%) for maximum scan reliability with a logo.");
    }

    if (style.logoSize > 0.35) {
      score -= 10;
      warnings.push("Logo is relatively large compared to QR matrix size.");
      recommendations.push("Reduce logo size or increase Error Correction level.");
    }
  }

  // 4. Quiet zone / Margin check
  if (style.margin < 8) {
    score -= 8;
    warnings.push("Quiet zone (margin) is very small.");
    recommendations.push("Maintain at least 12-16px margin so camera autofocus can identify QR boundaries.");
  }

  // Final score clamping
  score = Math.max(10, Math.min(100, score));

  let status: "Excellent" | "Good" | "Risky" | "Poor" = "Excellent";
  if (score < 45 || minContrast < 2.0) {
    status = "Poor";
  } else if (score < 75 || minContrast < 3.2) {
    status = "Risky";
  } else if (score < 90) {
    status = "Good";
  } else {
    status = "Excellent";
  }

  return {
    score,
    status,
    contrastRatio: minContrast,
    isInverted,
    warnings,
    recommendations,
  };
}
