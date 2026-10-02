import { useEffect, useMemo, useState } from "react";

type IconName =
  | "arrow"
  | "check"
  | "chevron"
  | "clipboard"
  | "download"
  | "eye"
  | "image"
  | "link"
  | "moon"
  | "phone"
  | "refresh"
  | "sparkle"
  | "sun"
  | "trash"
  | "wifi";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m8 10 4 4 4-4" />,
    clipboard: <><rect x="6" y="5" width="12" height="15" rx="2" /><path d="M9 5V3h6v2" /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M5 21h14" /></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="3" /><path d="m3 16 5-5 4 4 2-2 7 6M16 9h.01" /></>,
    link: <><path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" /><path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" /></>,
    moon: <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />,
    phone: <path d="M6.5 3h3l1.5 5-2 1.5a15 15 0 0 0 5.5 5.5l1.5-2 5 1.5v3c0 1.7-1.3 3-3 3A15 15 0 0 1 3.5 6c0-1.7 1.3-3 3-3Z" />,
    refresh: <><path d="M20 7v5h-5" /><path d="M19 12a7 7 0 1 0-2 5" /></>,
    sparkle: <><path d="m12 3 1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4L12 3Z" /><path d="m19 16 .6 1.9 1.9.6-1.9.6L19 22l-.6-1.9-1.9-.6 1.9-.6L19 16Z" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    trash: <><path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7m4 4v6m4-6v6" /></>,
    wifi: <><path d="M3 9a14 14 0 0 1 18 0M6 13a9 9 0 0 1 12 0m-9 4a4.5 4.5 0 0 1 6 0" /><circle cx="12" cy="20" r=".8" fill="currentColor" /></>,
  };
  return <svg aria-hidden="true" className="icon" width={size} height={size} viewBox="0 0 24 24">{paths[name]}</svg>;
}

function Button({
  children,
  variant = "secondary",
  onClick,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return <button className={`button ${variant} ${className}`} onClick={onClick} disabled={disabled}>{children}</button>;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  icon,
  error,
  success,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: IconName;
  error?: string;
  success?: boolean;
  type?: string;
}) {
  return (
    <label className="field-wrap">
      <span className="field-label">{label}</span>
      <span className={`field ${error ? "has-error" : ""} ${success ? "has-success" : ""}`}>
        {icon && <Icon name={icon} />}
        <input value={value} type={type} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
        {success && <span className="success-icon"><Icon name="check" size={14} /></span>}
      </span>
      {error && <span className="helper error-text">{error}</span>}
    </label>
  );
}

function Section({
  title,
  eyebrow,
  children,
  open,
  onToggle,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  open?: boolean;
  onToggle?: () => void;
}) {
  return (
    <section className={`panel-section ${open === false ? "collapsed" : ""}`}>
      <button className="section-heading" onClick={onToggle} type="button">
        <span>
          {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
          <span className="section-title">{title}</span>
        </span>
        {onToggle && <span className="mobile-chevron"><Icon name="chevron" /></span>}
      </button>
      <div className="section-body">{children}</div>
    </section>
  );
}

const qrTypes = ["URL", "Text", "Email", "Phone", "Wi-Fi"];
const presets = [
  { name: "Classic", fg: "#172033", bg: "#FFFFFF", tone: "classic" },
  { name: "Midnight", fg: "#E9F1FF", bg: "#13203A", tone: "midnight" },
  { name: "Ocean", fg: "#1458B8", bg: "#EAF5FF", tone: "ocean" },
  { name: "Sunset", fg: "#B53049", bg: "#FFF1E9", tone: "sunset" },
  { name: "Forest", fg: "#176B4A", bg: "#ECF8EF", tone: "forest" },
  { name: "Neon", fg: "#6C24FF", bg: "#F4EEFF", tone: "neon" },
];

function QrMark({ tone = "classic", large = false }: { tone?: string; large?: boolean }) {
  const cells = useMemo(() => Array.from({ length: 21 * 21 }, (_, index) => {
    const x = index % 21;
    const y = Math.floor(index / 21);
    const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
    const edge = finder && (x % 7 === 0 || x % 7 === 6 || y % 7 === 0 || y % 7 === 6);
    const core = finder && x % 7 >= 2 && x % 7 <= 4 && y % 7 >= 2 && y % 7 <= 4;
    return edge || core || (!finder && ((x * y + x + y * 3) % 7 < 3));
  }), []);
  return (
    <div className={`qr-mark ${tone} ${large ? "large" : ""}`} aria-label="QR code preview">
      {cells.map((active, index) => <i key={index} className={active ? "on" : ""} />)}
    </div>
  );
}

function Preview({
  hasContent,
  tone,
  reliability,
  onToast,
}: {
  hasContent: boolean;
  tone: string;
  reliability: "Good" | "Risky" | "Poor";
  onToast: (message: string, kind?: string) => void;
}) {
  return (
    <aside className="preview-card">
      <div className="preview-topline">
        <div>
          <span className="preview-kicker">LIVE PREVIEW</span>
          <div className="preview-title" role="heading" aria-level={2}>Your QR code</div>
        </div>
        <span className="live-pill"><i /> Live</span>
      </div>
      <div className="qr-stage">
        {hasContent ? <QrMark tone={tone} large /> : (
          <div className="empty-preview">
            <div className="empty-illustration"><Icon name="sparkle" size={25} /><span /></div>
            <strong>Ready when you are</strong>
            <p>Enter some content to generate your QR code.</p>
          </div>
        )}
      </div>
      <div className="reliability-row">
        <span>Scan reliability</span>
        <span className={`reliability ${reliability.toLowerCase()}`}><i /> {reliability}</span>
      </div>
      {reliability !== "Good" && (
        <div className="warning-banner">
          <strong>{reliability === "Poor" ? "Low contrast" : "Check readability"}</strong>
          Foreground and background may be difficult to scan.
        </div>
      )}
      <div className="preview-actions">
        <Button variant="primary" onClick={() => onToast("Downloaded")} disabled={!hasContent}>
          <Icon name="download" /> Download PNG
        </Button>
        <Button onClick={() => onToast("Copied")} disabled={!hasContent}><Icon name="clipboard" /> Copy</Button>
        <Button onClick={() => onToast("Downloaded")} disabled={!hasContent}>SVG</Button>
      </div>
      <p className="privacy-note">Generated privately in your browser. Nothing is uploaded.</p>
    </aside>
  );
}

function RangeControl({ label, value, min, max, unit, onChange }: {
  label: string; value: number; min: number; max: number; unit: string; onChange: (value: number) => void;
}) {
  const progress = ((value - min) / (max - min)) * 100;
  return (
    <div className="range-control">
      <div className="control-label"><span>{label}</span><output>{value}{unit}</output></div>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ "--progress": `${progress}%` } as React.CSSProperties}
      />
      <div className="range-minmax"><span>{min}{unit}</span><span>{max}{unit}</span></div>
    </div>
  );
}

function ContentFields({
  type,
  value,
  setValue,
}: {
  type: string;
  value: string;
  setValue: (value: string) => void;
}) {
  const [secondary, setSecondary] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  if (type === "URL") return <Field label="Website URL" value={value} onChange={setValue} icon="link" placeholder="https://example.com" success={value.startsWith("http")} error={value && !value.startsWith("http") ? "Enter a valid URL" : undefined} />;
  if (type === "Text") return (
    <label className="field-wrap">
      <span className="field-label">Your text</span>
      <span className="field textarea-field"><textarea value={value} onChange={(e) => setValue(e.target.value)} maxLength={300} placeholder="Type or paste your text here..." /></span>
      <span className="counter">{value.length} / 300</span>
    </label>
  );
  if (type === "Email") return <div className="field-grid"><Field label="Email address" value={value} onChange={setValue} placeholder="hello@company.com" /><Field label="Subject" value={secondary} onChange={setSecondary} placeholder="Let’s connect" /><Field label="Message" value="" onChange={() => {}} placeholder="Optional message" /></div>;
  if (type === "Phone") return <div className="phone-row"><label className="field-wrap country"><span className="field-label">Code</span><span className="field"><select aria-label="Country code"><option>US +1</option><option>UK +44</option><option>FR +33</option></select></span></label><Field label="Phone number" value={value} onChange={setValue} icon="phone" placeholder="(555) 123-4567" /></div>;
  return <div className="field-grid"><Field label="Network name (SSID)" value={value} onChange={setValue} icon="wifi" placeholder="My network" /><label className="field-wrap"><span className="field-label">Password</span><span className="field"><input value={secondary} type={showPassword ? "text" : "password"} onChange={(e) => setSecondary(e.target.value)} placeholder="Network password" /><button className="field-action" onClick={() => setShowPassword(!showPassword)} type="button"><Icon name="eye" /></button></span></label><div className="field-split"><label className="field-wrap"><span className="field-label">Encryption</span><span className="field"><select><option>WPA / WPA2</option><option>WEP</option><option>None</option></select></span></label><label className="check-row"><input type="checkbox" /> Hidden network</label></div></div>;
}

function Designer() {
  const [type, setType] = useState("URL");
  const [content, setContent] = useState("https://qrcraft.app/hello");
  const [size, setSize] = useState(512);
  const [margin, setMargin] = useState(24);
  const [preset, setPreset] = useState(0);
  const [foreground, setForeground] = useState("#172033");
  const [background, setBackground] = useState("#FFFFFF");
  const [dotStyle, setDotStyle] = useState("Rounded");
  const [correction, setCorrection] = useState("M");
  const [gradient, setGradient] = useState(false);
  const [toast, setToast] = useState<{ message: string; kind?: string } | null>(null);
  const [recent, setRecent] = useState([
    { type: "URL", content: "qrcraft.app/spring-campaign", time: "2 min ago", tone: "ocean" },
    { type: "Wi-Fi", content: "Studio Guest Network", time: "Yesterday", tone: "classic" },
    { type: "Text", content: "Thanks for stopping by!", time: "Mar 14", tone: "forest" },
  ]);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ content: true, style: false, presets: false, recent: false });

  const showToast = (message: string, kind?: string) => setToast({ message, kind });
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const selectType = (next: string) => {
    setType(next);
    setContent("");
  };
  const choosePreset = (index: number) => {
    setPreset(index);
    setForeground(presets[index].fg);
    setBackground(presets[index].bg);
  };
  const hexDistance = Math.abs(parseInt(foreground.slice(1), 16) - parseInt(background.slice(1), 16));
  const reliability: "Good" | "Risky" | "Poor" = hexDistance > 5000000 ? "Good" : hexDistance > 1500000 ? "Risky" : "Poor";
  const toggleSection = (name: string) => setOpenSections((current) => ({ ...current, [name]: !current[name] }));

  return (
    <main className="app-shell">
      <div className="mobile-preview">
        <Preview hasContent={!!content} tone={presets[preset].tone} reliability={reliability} onToast={showToast} />
      </div>
      <div className="workspace">
        <div className="controls-column">
          <Section title="What should your QR do?" eyebrow="CONTENT" open={openSections.content} onToggle={() => toggleSection("content")}>
            <div className="type-tabs" role="tablist">
              {qrTypes.map((item) => <button key={item} role="tab" aria-selected={type === item} onClick={() => selectType(item)}>{item}</button>)}
            </div>
            <ContentFields type={type} value={content} setValue={setContent} />
          </Section>

          <Section title="Make it yours" eyebrow="STYLE" open={openSections.style} onToggle={() => toggleSection("style")}>
            <RangeControl label="Export size" value={size} min={128} max={1024} unit="px" onChange={setSize} />
            <div className="color-grid">
              <label className="field-wrap"><span className="field-label">Foreground</span><span className="color-field"><input type="color" value={foreground} onChange={(e) => setForeground(e.target.value.toUpperCase())} /><input value={foreground} onChange={(e) => setForeground(e.target.value)} /></span></label>
              <label className="field-wrap"><span className="field-label">Background</span><span className="color-field"><input type="color" value={background} onChange={(e) => setBackground(e.target.value.toUpperCase())} /><input value={background} onChange={(e) => setBackground(e.target.value)} /></span></label>
            </div>
            <div className="control-block">
              <span className="field-label">Error correction <span className="info">i<span>Higher levels remain scannable if part of the code is obscured.</span></span></span>
              <div className="mini-segment">{["L", "M", "Q", "H"].map((item) => <button key={item} className={correction === item ? "selected" : ""} title={`${item} error correction`} onClick={() => setCorrection(item)}>{item}</button>)}</div>
            </div>
            <RangeControl label="Quiet zone" value={margin} min={0} max={64} unit="px" onChange={setMargin} />
            <div className="two-controls">
              <div className="control-block"><span className="field-label">Dot style</span><div className="dot-options">{["Square", "Rounded", "Dots"].map((item) => <button key={item} title={item} className={`${item.toLowerCase()} ${dotStyle === item ? "selected" : ""}`} onClick={() => setDotStyle(item)}><i /></button>)}</div></div>
              <label className="toggle-row"><span><strong>Gradient</strong><small>Blend two colors</small></span><input type="checkbox" checked={gradient} onChange={(e) => setGradient(e.target.checked)} /><i /></label>
            </div>
            <button className="upload-drop" onClick={() => showToast("Logo upload ready")}><span><Icon name="image" /></span><strong>Add a logo</strong><small>PNG or SVG, up to 2 MB</small></button>
            <button className="reset-link" onClick={() => { setSize(512); setMargin(24); setPreset(0); setForeground("#172033"); setBackground("#FFFFFF"); }}><Icon name="refresh" size={15} /> Reset to defaults</button>
          </Section>

          <Section title="Start with a look" eyebrow="PRESETS" open={openSections.presets} onToggle={() => toggleSection("presets")}>
            <p className="section-copy">Choose a preset, then fine-tune every setting.</p>
            <div className="preset-scroll">
              {presets.map((item, index) => (
                <button className={`preset-card ${preset === index ? "selected" : ""}`} key={item.name} onClick={() => choosePreset(index)}>
                  <span className="preset-qr"><QrMark tone={item.tone} /></span>
                  <strong>{item.name}</strong>
                  {preset === index && <span className="preset-check"><Icon name="check" size={12} /></span>}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Recent QR codes" eyebrow="RECENT" open={openSections.recent} onToggle={() => toggleSection("recent")}>
            <div className="recent-head"><span>Saved locally on this device.</span><button onClick={() => setRecent([])}>Clear all</button></div>
            {recent.length ? <div className="recent-grid">{recent.map((item, index) => (
              <article className="recent-card" key={`${item.content}-${index}`}>
                <div className="recent-qr"><QrMark tone={item.tone} /></div>
                <div className="recent-info"><span className="type-badge">{item.type}</span><strong>{item.content}</strong><small>{item.time}</small></div>
                <div className="recent-actions"><button onClick={() => { setType(item.type); setContent(item.content); }}>Reuse</button><button aria-label="Delete" onClick={() => setRecent((current) => current.filter((_, i) => i !== index))}><Icon name="trash" size={16} /></button></div>
              </article>
            ))}</div> : <div className="recent-empty"><div><Icon name="sparkle" /></div><strong>No recent QR codes yet</strong><p>Your creations will appear here.</p></div>}
          </Section>
        </div>
        <div className="desktop-preview">
          <Preview hasContent={!!content} tone={presets[preset].tone} reliability={reliability} onToast={showToast} />
        </div>
      </div>
      {toast && <div className={`toast ${toast.kind || ""}`}><span><Icon name={toast.kind === "error" ? "refresh" : "check"} size={15} /></span>{toast.message}</div>}
    </main>
  );
}

function ComponentLibrary() {
  return (
    <main className="library">
      <div className="library-hero"><span className="section-eyebrow">QRAFT UI</span><div role="heading" aria-level={1}>Component library</div><p>A compact, accessible system for browser-native creation tools.</p></div>
      <section className="library-section"><div className="lib-title">Buttons</div><div className="component-row"><Button variant="primary"><Icon name="download" /> Primary</Button><Button>Secondary</Button><Button variant="ghost">Ghost</Button><Button disabled>Disabled</Button></div></section>
      <section className="library-section"><div className="lib-title">Inputs & states</div><div className="library-grid"><Field label="Default" value="" onChange={() => {}} placeholder="Enter a value" /><Field label="Success" value="https://qrcraft.app" onChange={() => {}} success /><Field label="Error" value="qrcraft" onChange={() => {}} error="Enter a valid URL" /></div></section>
      <section className="library-section"><div className="lib-title">Badges & feedback</div><div className="component-row"><span className="reliability good"><i /> Good</span><span className="reliability risky"><i /> Risky</span><span className="reliability poor"><i /> Poor</span><span className="type-badge">URL</span><div className="toast static"><span><Icon name="check" size={15} /></span>Downloaded</div></div></section>
      <section className="library-section"><div className="lib-title">Presets</div><div className="preset-scroll">{presets.slice(0, 4).map((item, index) => <button className={`preset-card ${index === 0 ? "selected" : ""}`} key={item.name}><span className="preset-qr"><QrMark tone={item.tone} /></span><strong>{item.name}</strong></button>)}</div></section>
    </main>
  );
}

export default function App() {
  const [dark, setDark] = useState(false);
  const [page, setPage] = useState<"designer" | "library">("designer");
  return (
    <div className={dark ? "theme-dark app" : "app"}>
      <nav className="navbar">
        <button className="brand" onClick={() => setPage("designer")} aria-label="QRCraft home"><span className="brand-mark"><i /><i /><i /></span><span>QR<span>Craft</span></span></button>
        <div className="nav-center"><button className={page === "designer" ? "active" : ""} onClick={() => setPage("designer")}>Designer</button><button className={page === "library" ? "active" : ""} onClick={() => setPage("library")}>Components</button></div>
        <button className="theme-toggle" aria-label="Toggle theme" onClick={() => setDark(!dark)}><Icon name={dark ? "sun" : "moon"} /><span>{dark ? "Light" : "Dark"}</span></button>
      </nav>
      {page === "designer" ? <Designer /> : <ComponentLibrary />}
    </div>
  );
}
