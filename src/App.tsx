import { useState, useEffect, useMemo } from "react";
import type { QRType, QRFormData, QRStyleConfig, RecentQRCode, QRPreset } from "./types";
import { generateQRPayload, validateQRData, getPayloadDisplaySummary } from "./utils/qrPayload";
import { evaluateScannability } from "./utils/contrast";
import { QR_PRESETS } from "./utils/presets";
import { Navbar } from "./components/Navbar";
import { TypeSelector } from "./components/TypeSelector";
import { ContentInputs } from "./components/ContentInputs";
import { StyleCustomizer } from "./components/StyleCustomizer";
import { LogoCustomizer } from "./components/LogoCustomizer";
import { PresetsGrid } from "./components/PresetsGrid";
import { HistorySection } from "./components/HistorySection";
import { QrPreview } from "./components/QrPreview";
import {
  FileText,
  Palette,
  Image as ImageIcon,
  Sparkles,
  Clock,
  ChevronDown,
  Check,
  AlertCircle,
  Info,
} from "lucide-react";

const INITIAL_FORM_DATA: QRFormData = {
  URL: { url: "https://qrcraft.app" },
  Text: { text: "Scan to learn more about QRCraft Pro Designer!" },
  Email: { email: "hello@qrcraft.app", subject: "Inquiry about QR Codes", body: "Hi there, I loved your QR design!" },
  Phone: { countryCode: "+1", phoneNumber: "5551234567" },
  "Wi-Fi": { ssid: "QRCraft-Guest", password: "SecureWifi2026!", encryption: "WPA", hidden: false },
  SMS: { phoneNumber: "+15551234567", message: "Hi! Reaching out via QR code." },
  vCard: {
    firstName: "Alex",
    lastName: "Morgan",
    organization: "QRCraft Studios",
    jobTitle: "Creative Technologist",
    phone: "+1 555 987 6543",
    email: "alex@qrcraft.app",
    website: "https://qrcraft.app",
  },
};

const DEFAULT_STYLE_CONFIG: QRStyleConfig = {
  size: 512,
  margin: 16,
  dotsColor: "#0F172A",
  dotsColor2: "#2563EB",
  isGradient: false,
  gradientType: "linear",
  gradientRotation: 45,
  backgroundColor: "#FFFFFF",
  transparentBackground: false,
  dotsType: "rounded",
  cornersSquareType: "extra-rounded",
  cornersDotType: "dot",
  customCornerColors: false,
  cornersSquareColor: "#0F172A",
  cornersDotColor: "#0F172A",
  errorCorrectionLevel: "M",
  logoUrl: undefined,
  logoSize: 0.25,
  logoMargin: 6,
  hideBackgroundDots: true,
};

export default function App() {
  // Theme state with localStorage
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("qrcraft_theme") === "dark";
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("qrcraft_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("qrcraft_theme", "light");
    }
  }, [dark]);

  // QR Form & Type state
  const [currentType, setCurrentType] = useState<QRType>("URL");
  const [formData, setFormData] = useState<QRFormData>(INITIAL_FORM_DATA);
  const [styleConfig, setStyleConfig] = useState<QRStyleConfig>(DEFAULT_STYLE_CONFIG);

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; kind?: "success" | "error" | "info" } | null>(null);
  const showToast = (message: string, kind: "success" | "error" | "info" = "success") => {
    setToast({ message, kind });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Collapsible Accordion sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    content: true,
    style: false,
    logo: false,
    presets: false,
    history: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Recent Codes History state with localStorage
  const [recentList, setRecentList] = useState<RecentQRCode[]>(() => {
    try {
      const stored = localStorage.getItem("qrcraft_recent_history");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveToHistory = (previewDataUrl?: string) => {
    const payload = generateQRPayload(currentType, formData);
    const summary = getPayloadDisplaySummary(currentType, formData);

    const newItem: RecentQRCode = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      type: currentType,
      title: summary,
      payload,
      formData: JSON.parse(JSON.stringify(formData)),
      styleConfig: JSON.parse(JSON.stringify(styleConfig)),
      previewDataUrl,
      createdAt: Date.now(),
    };

    setRecentList((prev) => {
      // Deduplicate recent item if same payload
      const filtered = prev.filter((item) => item.payload !== payload);
      const updated = [newItem, ...filtered].slice(0, 16);
      try {
        localStorage.setItem("qrcraft_recent_history", JSON.stringify(updated));
      } catch (err) {
        console.warn("localStorage quota exceeded:", err);
      }
      return updated;
    });
  };

  const handleReuseHistory = (item: RecentQRCode) => {
    setCurrentType(item.type);
    setFormData(item.formData);
    setStyleConfig(item.styleConfig);
    showToast(`Loaded "${item.title}" into editor`, "info");
    // Ensure content section is opened
    setOpenSections((prev) => ({ ...prev, content: true }));
  };

  const handleDeleteHistory = (id: string) => {
    setRecentList((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem("qrcraft_recent_history", JSON.stringify(updated));
      return updated;
    });
    showToast("Removed from history", "info");
  };

  const handleClearAllHistory = () => {
    setRecentList([]);
    localStorage.removeItem("qrcraft_recent_history");
    showToast("History cleared", "info");
  };

  // Apply visual preset
  const handleSelectPreset = (preset: QRPreset) => {
    setStyleConfig((prev) => ({
      ...prev,
      dotsColor: preset.dotsColor,
      dotsColor2: preset.dotsColor2 || preset.dotsColor,
      isGradient: preset.isGradient,
      gradientType: preset.gradientType,
      gradientRotation: preset.gradientRotation,
      backgroundColor: preset.backgroundColor,
      transparentBackground: false,
      dotsType: preset.dotsType,
      cornersSquareType: preset.cornersSquareType,
      cornersDotType: preset.cornersDotType,
      customCornerColors: Boolean(preset.cornersSquareColor),
      cornersSquareColor: preset.cornersSquareColor || preset.dotsColor,
      cornersDotColor: preset.cornersDotColor || preset.dotsColor,
      errorCorrectionLevel: preset.errorCorrectionLevel,
    }));
    showToast(`Applied preset: ${preset.name}`);
  };

  // Reset styles
  const handleResetStyle = () => {
    setStyleConfig(DEFAULT_STYLE_CONFIG);
    showToast("Reset styling to default values", "info");
  };

  // Live computed payload & validation & scannability
  const activePayload = useMemo(() => {
    return generateQRPayload(currentType, formData);
  }, [currentType, formData]);

  const validation = useMemo(() => {
    return validateQRData(currentType, formData);
  }, [currentType, formData]);

  const scannability = useMemo(() => {
    return evaluateScannability(styleConfig);
  }, [styleConfig]);

  return (
    <div className={`app ${dark ? "theme-dark" : ""}`}>
      <Navbar dark={dark} onToggleTheme={() => setDark(!dark)} />

      <main className="app-shell">
        {/* Mobile Top Live Preview */}
        <div className="mobile-preview mb-6">
          <QrPreview
            payload={activePayload}
            styleConfig={styleConfig}
            scannability={scannability}
            hasValidContent={validation.isValid}
            onToast={showToast}
            onSaveHistory={saveToHistory}
          />
        </div>

        <div className="workspace">
          {/* Left Column: Interactive Designer Controls */}
          <div className="controls-column space-y-4">
            {/* SECTION 1: Content & Type */}
            <section className="panel-section">
              <button
                type="button"
                className="section-heading"
                onClick={() => toggleSection("content")}
              >
                <div>
                  <span className="section-eyebrow">STEP 1 • PAYLOAD</span>
                  <div className="section-title flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <span>Enter Your Content</span>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-muted transition-transform duration-200 ${
                    openSections.content ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openSections.content && (
                <div className="section-body">
                  <p className="section-copy">
                    Select a QR format and enter your destination details. The QR code encodes immediately.
                  </p>

                  <TypeSelector currentType={currentType} onSelectType={setCurrentType} />

                  <div className="mt-4">
                    <ContentInputs type={currentType} formData={formData} onChange={setFormData} />
                  </div>
                </div>
              )}
            </section>

            {/* SECTION 2: Appearance & Styling */}
            <section className="panel-section">
              <button
                type="button"
                className="section-heading"
                onClick={() => toggleSection("style")}
              >
                <div>
                  <span className="section-eyebrow">STEP 2 • CUSTOMIZE</span>
                  <div className="section-title flex items-center gap-2">
                    <Palette className="w-5 h-5 text-blue-500" />
                    <span>Appearance & Colors</span>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-muted transition-transform duration-200 ${
                    openSections.style ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openSections.style && (
                <div className="section-body">
                  <p className="section-copy">
                    Customize colors, gradients, module patterns, corner eyes, dimensions, and error tolerance.
                  </p>
                  <StyleCustomizer
                    styleConfig={styleConfig}
                    onChange={setStyleConfig}
                    onReset={handleResetStyle}
                  />
                </div>
              )}
            </section>

            {/* SECTION 3: Logo & Branding */}
            <section className="panel-section">
              <button
                type="button"
                className="section-heading"
                onClick={() => toggleSection("logo")}
              >
                <div>
                  <span className="section-eyebrow">STEP 3 • BRANDING</span>
                  <div className="section-title flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-blue-500" />
                    <span>Center Logo & Icons</span>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-muted transition-transform duration-200 ${
                    openSections.logo ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openSections.logo && (
                <div className="section-body">
                  <p className="section-copy">
                    Embed your company logo or pick from popular vector icons. The QR code automatically masks background dots.
                  </p>
                  <LogoCustomizer styleConfig={styleConfig} onChange={setStyleConfig} />
                </div>
              )}
            </section>

            {/* SECTION 4: Presets */}
            <section className="panel-section">
              <button
                type="button"
                className="section-heading"
                onClick={() => toggleSection("presets")}
              >
                <div>
                  <span className="section-eyebrow">VISUAL THEMES</span>
                  <div className="section-title flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    <span>Designer Presets</span>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-muted transition-transform duration-200 ${
                    openSections.presets ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openSections.presets && (
                <div className="section-body">
                  <PresetsGrid currentStyle={styleConfig} onSelectPreset={handleSelectPreset} />
                </div>
              )}
            </section>

            {/* SECTION 5: Recent History */}
            <section className="panel-section">
              <button
                type="button"
                className="section-heading"
                onClick={() => toggleSection("recent")}
              >
                <div>
                  <span className="section-eyebrow">PERSISTENCE</span>
                  <div className="section-title flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span>Recent QR Codes</span>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-muted transition-transform duration-200 ${
                    openSections.recent ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openSections.recent && (
                <div className="section-body">
                  <HistorySection
                    recentList={recentList}
                    onReuse={handleReuseHistory}
                    onDelete={handleDeleteHistory}
                    onClearAll={handleClearAllHistory}
                    onToast={showToast}
                  />
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Sticky Live Preview Engine on Desktop */}
          <div className="desktop-preview">
            <QrPreview
              payload={activePayload}
              styleConfig={styleConfig}
              scannability={scannability}
              hasValidContent={validation.isValid}
              onToast={showToast}
              onSaveHistory={saveToHistory}
            />
          </div>
        </div>
      </main>

      {/* Floating Toast Feedback */}
      {toast && (
        <div className={`toast-pro ${toast.kind || "success"}`}>
          <div className="toast-icon">
            {toast.kind === "error" ? (
              <AlertCircle className="w-4 h-4" />
            ) : toast.kind === "info" ? (
              <Info className="w-4 h-4" />
            ) : (
              <Check className="w-4 h-4" />
            )}
          </div>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
