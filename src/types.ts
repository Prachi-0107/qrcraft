import type { DotType, CornerSquareType, CornerDotType, ErrorCorrectionLevel } from "qr-code-styling";

export type QRType = "URL" | "Text" | "Email" | "Phone" | "Wi-Fi" | "SMS" | "vCard";

export interface URLData {
  url: string;
}

export interface TextData {
  text: string;
}

export interface EmailData {
  email: string;
  subject: string;
  body: string;
}

export interface PhoneData {
  countryCode: string;
  phoneNumber: string;
}

export interface WifiData {
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}

export interface SMSData {
  phoneNumber: string;
  message: string;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  organization: string;
  jobTitle: string;
  phone: string;
  email: string;
  website: string;
}

export type QRFormData = {
  URL: URLData;
  Text: TextData;
  Email: EmailData;
  Phone: PhoneData;
  "Wi-Fi": WifiData;
  SMS: SMSData;
  vCard: VCardData;
};

export interface QRPreset {
  id: string;
  name: string;
  description: string;
  dotsColor: string;
  dotsColor2?: string;
  isGradient: boolean;
  gradientType: "linear" | "radial";
  gradientRotation: number;
  backgroundColor: string;
  dotsType: DotType;
  cornersSquareType: CornerSquareType;
  cornersDotType: CornerDotType;
  cornersSquareColor?: string;
  cornersDotColor?: string;
  errorCorrectionLevel: ErrorCorrectionLevel;
}

export interface QRStyleConfig {
  size: number;
  margin: number;
  dotsColor: string;
  dotsColor2: string;
  isGradient: boolean;
  gradientType: "linear" | "radial";
  gradientRotation: number;
  backgroundColor: string;
  transparentBackground: boolean;
  dotsType: DotType;
  cornersSquareType: CornerSquareType;
  cornersDotType: CornerDotType;
  customCornerColors: boolean;
  cornersSquareColor: string;
  cornersDotColor: string;
  errorCorrectionLevel: ErrorCorrectionLevel;
  // Logo
  logoUrl?: string;
  logoSize: number;
  logoMargin: number;
  hideBackgroundDots: boolean;
}

export interface ScannabilityInfo {
  score: number;
  status: "Excellent" | "Good" | "Risky" | "Poor";
  contrastRatio: number;
  isInverted: boolean;
  warnings: string[];
  recommendations: string[];
}

export interface RecentQRCode {
  id: string;
  type: QRType;
  title: string;
  payload: string;
  formData: QRFormData;
  styleConfig: QRStyleConfig;
  previewDataUrl?: string;
  createdAt: number;
}
