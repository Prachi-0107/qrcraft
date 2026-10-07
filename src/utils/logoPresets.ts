export interface LogoPreset {
  id: string;
  name: string;
  dataUrl: string;
}

// Crisp vector SVG icons encoded as Data URIs for instant embedding without network dependencies
const svgToDataUrl = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export const LOGO_PRESETS: LogoPreset[] = [
  {
    id: "globe",
    name: "Web / Link",
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="46" fill="#2563EB"/>
        <circle cx="50" cy="50" r="42" fill="none" stroke="#FFFFFF" stroke-width="4"/>
        <ellipse cx="50" cy="50" rx="20" ry="42" fill="none" stroke="#FFFFFF" stroke-width="4"/>
        <line x1="8" y1="50" x2="92" y2="50" stroke="#FFFFFF" stroke-width="4"/>
        <line x1="16" y1="28" x2="84" y2="28" stroke="#FFFFFF" stroke-width="3.5"/>
        <line x1="16" y1="72" x2="84" y2="72" stroke="#FFFFFF" stroke-width="3.5"/>
      </svg>
    `),
  },
  {
    id: "wifi",
    name: "Wi-Fi",
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="24" fill="#059669"/>
        <path d="M18 36 A48 48 0 0 1 82 36" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/>
        <path d="M28 48 A32 32 0 0 1 72 48" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/>
        <path d="M38 60 A16 16 0 0 1 62 60" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/>
        <circle cx="50" cy="74" r="5" fill="#FFFFFF"/>
      </svg>
    `),
  },
  {
    id: "mail",
    name: "Email",
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="24" fill="#DC2626"/>
        <rect x="20" y="28" width="60" height="44" rx="6" fill="none" stroke="#FFFFFF" stroke-width="6"/>
        <polyline points="22,34 50,56 78,34" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `),
  },
  {
    id: "phone",
    name: "Phone",
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="24" fill="#10B981"/>
        <path d="M32 26 C32 24 35 24 37 28 L42 38 C43 40 42 43 39 45 L36 47 C40 55 45 60 53 64 L55 61 C57 58 60 57 62 58 L72 63 C76 65 76 68 74 70 C70 76 62 76 56 74 C42 69 31 58 26 44 C24 38 24 30 30 26 Z" fill="#FFFFFF"/>
      </svg>
    `),
  },
  {
    id: "github",
    name: "GitHub",
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="24" fill="#181717"/>
        <path fill="#FFFFFF" fill-rule="evenodd" d="M50 20C33.4 20 20 33.4 20 50c0 13.3 8.6 24.5 20.6 28.5 1.5.3 2-.6 2-1.4v-5.2c-8.3 1.8-10.1-4-10.1-4-1.4-3.5-3.3-4.4-3.3-4.4-2.7-1.9.2-1.8.2-1.8 3 0.2 4.6 3.1 4.6 3.1 2.7 4.6 7 3.3 8.7 2.5 0.3-2 1.1-3.3 2-4-6.7-0.8-13.7-3.3-13.7-14.8 0-3.3 1.2-5.9 3.1-8-0.3-0.8-1.3-3.8 0.3-7.9 0 0 2.5-0.8 8.2 3.1 2.4-0.7 5-1 7.5-1s5.1 0.3 7.5 1c5.7-3.9 8.2-3.1 8.2-3.1 1.6 4.1 0.6 7.1 0.3 7.9 1.9 2.1 3.1 4.7 3.1 8 0 11.5-7 14-13.7 14.8 1.1 0.9 2.1 2.8 2.1 5.7v8.5c0 0.8 0.5 1.7 2 1.4C71.4 74.5 80 63.3 80 50c0-16.6-13.4-30-30-30z"/>
      </svg>
    `),
  },
  {
    id: "star",
    name: "Star",
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="24" fill="#F59E0B"/>
        <polygon points="50,18 60,38 82,41 66,57 70,79 50,68 30,79 34,57 18,41 40,38" fill="#FFFFFF"/>
      </svg>
    `),
  },
  {
    id: "heart",
    name: "Heart",
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" rx="24" fill="#E11D48"/>
        <path d="M50 74 C48 72 24 54 24 38 C24 28 32 22 40 22 C45 22 48 25 50 28 C52 25 55 22 60 22 C68 22 76 28 76 38 C76 54 52 72 50 74 Z" fill="#FFFFFF"/>
      </svg>
    `),
  },
];
