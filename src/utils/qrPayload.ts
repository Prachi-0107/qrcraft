import type { QRType, QRFormData } from "../types";

/**
 * Escapes characters for Wi-Fi QR code standard (ZXing).
 * Escapes backslash, semicolon, comma, and colon.
 */
function escapeWifi(str: string): string {
  return str.replace(/([\\;,":])/g, "\\$1");
}

/**
 * Validates whether a string has a valid URL structure.
 */
export function isValidUrl(url: string): boolean {
  if (!url || !url.trim()) return false;
  try {
    const parsed = new URL(url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`);
    return parsed.hostname.length > 0 && parsed.hostname.includes(".");
  } catch {
    return false;
  }
}

/**
 * Validates email address format.
 */
export function isValidEmail(email: string): boolean {
  if (!email || !email.trim()) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates phone number (digits, +, spaces, hyphens, parentheses).
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || !phone.trim()) return false;
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, "");
  return cleaned.length >= 4 && /^(\+)?[0-9]+$/.test(cleaned);
}

/**
 * Returns validation result for current form state.
 */
export function validateQRData(type: QRType, formData: QRFormData): { isValid: boolean; error?: string } {
  switch (type) {
    case "URL": {
      const url = formData.URL.url.trim();
      if (!url) return { isValid: false, error: "Please enter a website URL" };
      if (!isValidUrl(url)) return { isValid: false, error: "Please enter a valid URL (e.g. https://example.com)" };
      return { isValid: true };
    }
    case "Text": {
      const text = formData.Text.text.trim();
      if (!text) return { isValid: false, error: "Please enter some text" };
      return { isValid: true };
    }
    case "Email": {
      const email = formData.Email.email.trim();
      if (!email) return { isValid: false, error: "Please enter a recipient email address" };
      if (!isValidEmail(email)) return { isValid: false, error: "Please enter a valid email address" };
      return { isValid: true };
    }
    case "Phone": {
      const phone = formData.Phone.phoneNumber.trim();
      if (!phone) return { isValid: false, error: "Please enter a phone number" };
      if (!isValidPhone(phone)) return { isValid: false, error: "Please enter a valid phone number" };
      return { isValid: true };
    }
    case "Wi-Fi": {
      const ssid = formData["Wi-Fi"].ssid.trim();
      if (!ssid) return { isValid: false, error: "Network Name (SSID) is required" };
      if (formData["Wi-Fi"].encryption === "WPA" && formData["Wi-Fi"].password.length > 0 && formData["Wi-Fi"].password.length < 8) {
        return { isValid: false, error: "WPA/WPA2 passwords must be at least 8 characters" };
      }
      return { isValid: true };
    }
    case "SMS": {
      const phone = formData.SMS.phoneNumber.trim();
      if (!phone) return { isValid: false, error: "Recipient phone number is required" };
      if (!isValidPhone(phone)) return { isValid: false, error: "Please enter a valid phone number" };
      return { isValid: true };
    }
    case "vCard": {
      const fn = formData.vCard.firstName.trim();
      const ln = formData.vCard.lastName.trim();
      if (!fn && !ln) return { isValid: false, error: "First name or last name is required" };
      if (formData.vCard.email && !isValidEmail(formData.vCard.email)) {
        return { isValid: false, error: "Please enter a valid contact email" };
      }
      return { isValid: true };
    }
    default:
      return { isValid: true };
  }
}

/**
 * Generates the standardized QR code payload string based on type and input.
 */
export function generateQRPayload(type: QRType, formData: QRFormData): string {
  switch (type) {
    case "URL": {
      let url = formData.URL.url.trim();
      if (!url) return "https://qrcraft.app";
      if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
      }
      return url;
    }

    case "Text": {
      const text = formData.Text.text;
      return text || "Welcome to QRCraft QR Code Designer";
    }

    case "Email": {
      const { email, subject, body } = formData.Email;
      if (!email.trim()) return "mailto:hello@example.com";
      const params = new URLSearchParams();
      if (subject.trim()) params.append("subject", subject.trim());
      if (body.trim()) params.append("body", body.trim());
      const query = params.toString();
      return `mailto:${email.trim()}${query ? `?${query}` : ""}`;
    }

    case "Phone": {
      const { countryCode, phoneNumber } = formData.Phone;
      const combined = `${countryCode}${phoneNumber}`.replace(/[\s\-\(\)]/g, "");
      return combined ? `tel:${combined}` : "tel:+15551234567";
    }

    case "Wi-Fi": {
      const { ssid, password, encryption, hidden } = formData["Wi-Fi"];
      if (!ssid.trim()) return "WIFI:T:WPA;S:MyNetwork;P:MyPassword;;";
      const enc = encryption === "nopass" ? "nopass" : encryption;
      const p = enc === "nopass" ? "" : escapeWifi(password);
      const s = escapeWifi(ssid.trim());
      const h = hidden ? "true" : "false";
      return `WIFI:T:${enc};S:${s};P:${p};H:${h};;`;
    }

    case "SMS": {
      const { phoneNumber, message } = formData.SMS;
      const phone = phoneNumber.replace(/[\s\-\(\)]/g, "");
      return `smsto:${phone || "+15551234567"}:${message || ""}`;
    }

    case "vCard": {
      const { firstName, lastName, organization, jobTitle, phone, email, website } = formData.vCard;
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${lastName.trim()};${firstName.trim()};;;`,
        `FN:${[firstName.trim(), lastName.trim()].filter(Boolean).join(" ") || "Contact"}`,
        organization.trim() ? `ORG:${organization.trim()}` : "",
        jobTitle.trim() ? `TITLE:${jobTitle.trim()}` : "",
        phone.trim() ? `TEL:${phone.trim()}` : "",
        email.trim() ? `EMAIL:${email.trim()}` : "",
        website.trim() ? `URL:${website.trim()}` : "",
        "END:VCARD",
      ]
        .filter(Boolean)
        .join("\n");
    }

    default:
      return "https://qrcraft.app";
  }
}

/**
 * Creates human-readable short summary for display in history cards.
 */
export function getPayloadDisplaySummary(type: QRType, formData: QRFormData): string {
  switch (type) {
    case "URL":
      return formData.URL.url || "https://qrcraft.app";
    case "Text":
      return formData.Text.text.slice(0, 35) || "Text note";
    case "Email":
      return formData.Email.email || "hello@example.com";
    case "Phone":
      return `${formData.Phone.countryCode} ${formData.Phone.phoneNumber}` || "+1 555-1234";
    case "Wi-Fi":
      return formData["Wi-Fi"].ssid || "Wi-Fi Network";
    case "SMS":
      return `SMS: ${formData.SMS.phoneNumber}` || "SMS Message";
    case "vCard":
      return `${formData.vCard.firstName} ${formData.vCard.lastName}`.trim() || "Contact Card";
  }
}
