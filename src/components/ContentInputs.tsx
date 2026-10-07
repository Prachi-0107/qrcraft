import { useState } from "react";
import type { QRType, QRFormData } from "../types";
import { isValidUrl, isValidEmail, isValidPhone } from "../utils/qrPayload";
import { Link, AlignLeft, Mail, Phone, Wifi, Eye, EyeOff, Shield, User, Globe, Check, AlertCircle } from "lucide-react";

interface ContentInputsProps {
  type: QRType;
  formData: QRFormData;
  onChange: (updater: (prev: QRFormData) => QRFormData) => void;
}

export function ContentInputs({ type, formData, onChange }: ContentInputsProps) {
  const [showWifiPassword, setShowWifiPassword] = useState(false);

  // URL handlers
  const urlVal = formData.URL.url;
  const isUrlValid = isValidUrl(urlVal);
  const handleUrlChange = (value: string) => {
    onChange((prev) => ({
      ...prev,
      URL: { ...prev.URL, url: value },
    }));
  };

  const handleUrlPrefix = (prefix: string) => {
    let clean = urlVal.replace(/^https?:\/\//i, "");
    handleUrlChange(`${prefix}${clean}`);
  };

  // Text handlers
  const textVal = formData.Text.text;
  const handleTextChange = (value: string) => {
    onChange((prev) => ({
      ...prev,
      Text: { ...prev.Text, text: value },
    }));
  };

  // Email handlers
  const emailData = formData.Email;
  const isEmailValid = isValidEmail(emailData.email);
  const handleEmailField = (field: keyof typeof emailData, val: string) => {
    onChange((prev) => ({
      ...prev,
      Email: { ...prev.Email, [field]: val },
    }));
  };

  // Phone handlers
  const phoneData = formData.Phone;
  const isPhoneValid = isValidPhone(phoneData.phoneNumber);
  const handlePhoneField = (field: keyof typeof phoneData, val: string) => {
    onChange((prev) => ({
      ...prev,
      Phone: { ...prev.Phone, [field]: val },
    }));
  };

  // Wi-Fi handlers
  const wifiData = formData["Wi-Fi"];
  const handleWifiField = <K extends keyof typeof wifiData>(field: K, val: (typeof wifiData)[K]) => {
    onChange((prev) => ({
      ...prev,
      "Wi-Fi": { ...prev["Wi-Fi"], [field]: val },
    }));
  };

  // SMS handlers
  const smsData = formData.SMS;
  const handleSmsField = (field: keyof typeof smsData, val: string) => {
    onChange((prev) => ({
      ...prev,
      SMS: { ...prev.SMS, [field]: val },
    }));
  };

  // vCard handlers
  const vcardData = formData.vCard;
  const handleVCardField = (field: keyof typeof vcardData, val: string) => {
    onChange((prev) => ({
      ...prev,
      vCard: { ...prev.vCard, [field]: val },
    }));
  };

  return (
    <div className="content-inputs-wrapper">
      {/* 1. URL */}
      {type === "URL" && (
        <div className="space-y-3">
          <div className="field-wrap">
            <div className="flex items-center justify-between">
              <label className="field-label" htmlFor="qr-url-input">
                Website URL
              </label>
              <div className="flex gap-1">
                <button
                  type="button"
                  className="quick-badge-btn"
                  onClick={() => handleUrlPrefix("https://")}
                >
                  https://
                </button>
                <button
                  type="button"
                  className="quick-badge-btn"
                  onClick={() => handleUrlPrefix("http://")}
                >
                  http://
                </button>
              </div>
            </div>
            <div
              className={`field ${
                urlVal && !isUrlValid ? "has-error" : ""
              } ${urlVal && isUrlValid ? "has-success" : ""}`}
            >
              <Link className="w-4 h-4 text-muted shrink-0" />
              <input
                id="qr-url-input"
                type="text"
                placeholder="https://yourcompany.com/page"
                value={urlVal}
                onChange={(e) => handleUrlChange(e.target.value)}
                autoComplete="url"
              />
              {urlVal && isUrlValid && (
                <span className="success-icon" title="Valid URL">
                  <Check className="w-3 h-3" />
                </span>
              )}
              {urlVal && !isUrlValid && (
                <span className="text-red-500" title="Invalid URL">
                  <AlertCircle className="w-4 h-4" />
                </span>
              )}
            </div>
            {urlVal && !isUrlValid && (
              <span className="helper error-text flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                Please enter a valid web URL (e.g. https://example.com)
              </span>
            )}
          </div>
        </div>
      )}

      {/* 2. Plain Text */}
      {type === "Text" && (
        <div className="field-wrap">
          <label className="field-label" htmlFor="qr-text-input">
            Plain Text or Notes
          </label>
          <div className="field textarea-field">
            <textarea
              id="qr-text-input"
              rows={4}
              placeholder="Enter any text, instructions, serial number, or note..."
              value={textVal}
              onChange={(e) => handleTextChange(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-muted mt-1">
            <span>Standard alphanumeric text</span>
            <span>{textVal.length} characters</span>
          </div>
        </div>
      )}

      {/* 3. Email */}
      {type === "Email" && (
        <div className="space-y-3">
          <div className="field-wrap">
            <label className="field-label" htmlFor="qr-email-addr">
              Recipient Email Address <span className="text-red-500">*</span>
            </label>
            <div
              className={`field ${
                emailData.email && !isEmailValid ? "has-error" : ""
              } ${emailData.email && isEmailValid ? "has-success" : ""}`}
            >
              <Mail className="w-4 h-4 text-muted shrink-0" />
              <input
                id="qr-email-addr"
                type="email"
                placeholder="support@example.com"
                value={emailData.email}
                onChange={(e) => handleEmailField("email", e.target.value)}
              />
              {emailData.email && isEmailValid && (
                <span className="success-icon">
                  <Check className="w-3 h-3" />
                </span>
              )}
            </div>
            {emailData.email && !isEmailValid && (
              <span className="helper error-text flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                Please enter a valid email address (name@domain.com)
              </span>
            )}
          </div>

          <div className="field-wrap">
            <label className="field-label" htmlFor="qr-email-subj">
              Subject Line (Optional)
            </label>
            <div className="field">
              <input
                id="qr-email-subj"
                type="text"
                placeholder="Customer Inquiry / Project Feedback"
                value={emailData.subject}
                onChange={(e) => handleEmailField("subject", e.target.value)}
              />
            </div>
          </div>

          <div className="field-wrap">
            <label className="field-label" htmlFor="qr-email-body">
              Default Message Body (Optional)
            </label>
            <div className="field textarea-field">
              <textarea
                id="qr-email-body"
                rows={3}
                placeholder="Hello, I would like to learn more about..."
                value={emailData.body}
                onChange={(e) => handleEmailField("body", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. Phone */}
      {type === "Phone" && (
        <div className="space-y-3">
          <div className="field-wrap">
            <label className="field-label">Phone Number</label>
            <div className="phone-row">
              <div className="country">
                <select
                  aria-label="Country Dial Code"
                  className="country-select"
                  value={phoneData.countryCode}
                  onChange={(e) => handlePhoneField("countryCode", e.target.value)}
                >
                  <option value="+1">US/CA (+1)</option>
                  <option value="+44">UK (+44)</option>
                  <option value="+91">IN (+91)</option>
                  <option value="+61">AU (+61)</option>
                  <option value="+49">DE (+49)</option>
                  <option value="+33">FR (+33)</option>
                  <option value="+81">JP (+81)</option>
                  <option value="+86">CN (+86)</option>
                  <option value="+55">BR (+55)</option>
                  <option value="">Other / None</option>
                </select>
              </div>
              <div
                className={`field flex-1 ${
                  phoneData.phoneNumber && !isPhoneValid ? "has-error" : ""
                } ${phoneData.phoneNumber && isPhoneValid ? "has-success" : ""}`}
              >
                <Phone className="w-4 h-4 text-muted shrink-0" />
                <input
                  type="tel"
                  placeholder="555 123 4567"
                  value={phoneData.phoneNumber}
                  onChange={(e) => handlePhoneField("phoneNumber", e.target.value)}
                />
                {phoneData.phoneNumber && isPhoneValid && (
                  <span className="success-icon">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
            {phoneData.phoneNumber && !isPhoneValid && (
              <span className="helper error-text flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                Please enter a valid phone number
              </span>
            )}
          </div>
        </div>
      )}

      {/* 5. Wi-Fi */}
      {type === "Wi-Fi" && (
        <div className="space-y-3">
          <div className="field-wrap">
            <label className="field-label" htmlFor="qr-wifi-ssid">
              Network Name (SSID) <span className="text-red-500">*</span>
            </label>
            <div className="field">
              <Wifi className="w-4 h-4 text-muted shrink-0" />
              <input
                id="qr-wifi-ssid"
                type="text"
                placeholder="Office-Guest-WiFi"
                value={wifiData.ssid}
                onChange={(e) => handleWifiField("ssid", e.target.value)}
              />
            </div>
            {!wifiData.ssid.trim() && (
              <span className="helper error-text flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                Network name is required
              </span>
            )}
          </div>

          <div className="field-wrap">
            <label className="field-label" htmlFor="qr-wifi-pass">
              Password
            </label>
            <div className="field">
              <Shield className="w-4 h-4 text-muted shrink-0" />
              <input
                id="qr-wifi-pass"
                type={showWifiPassword ? "text" : "password"}
                placeholder={wifiData.encryption === "nopass" ? "No password needed" : "Network Security Key"}
                value={wifiData.password}
                disabled={wifiData.encryption === "nopass"}
                onChange={(e) => handleWifiField("password", e.target.value)}
              />
              {wifiData.encryption !== "nopass" && (
                <button
                  type="button"
                  className="field-action p-1"
                  onClick={() => setShowWifiPassword(!showWifiPassword)}
                  title={showWifiPassword ? "Hide password" : "Show password"}
                >
                  {showWifiPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>
            {wifiData.encryption === "WPA" && wifiData.password.length > 0 && wifiData.password.length < 8 && (
              <span className="helper error-text flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                WPA passwords must be at least 8 characters
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <div className="field-wrap">
              <label className="field-label">Encryption Type</label>
              <div className="field">
                <select
                  value={wifiData.encryption}
                  onChange={(e) => handleWifiField("encryption", e.target.value as "WPA" | "WEP" | "nopass")}
                >
                  <option value="WPA">WPA / WPA2 / WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None (Open Network)</option>
                </select>
              </div>
            </div>

            <label className="check-row cursor-pointer mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                checked={wifiData.hidden}
                onChange={(e) => handleWifiField("hidden", e.target.checked)}
              />
              <span className="text-xs font-medium">Hidden Network (SSID)</span>
            </label>
          </div>
        </div>
      )}

      {/* 6. SMS */}
      {type === "SMS" && (
        <div className="space-y-3">
          <div className="field-wrap">
            <label className="field-label">Recipient Phone Number</label>
            <div className="field">
              <Phone className="w-4 h-4 text-muted shrink-0" />
              <input
                type="tel"
                placeholder="+1 555 123 4567"
                value={smsData.phoneNumber}
                onChange={(e) => handleSmsField("phoneNumber", e.target.value)}
              />
            </div>
          </div>
          <div className="field-wrap">
            <label className="field-label">Pre-filled Message</label>
            <div className="field textarea-field">
              <textarea
                rows={3}
                placeholder="Text message to automatically fill into SMS app..."
                value={smsData.message}
                onChange={(e) => handleSmsField("message", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 7. vCard Contact Card */}
      {type === "vCard" && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="field-wrap">
              <label className="field-label">First Name</label>
              <div className="field">
                <User className="w-4 h-4 text-muted shrink-0" />
                <input
                  type="text"
                  placeholder="Jane"
                  value={vcardData.firstName}
                  onChange={(e) => handleVCardField("firstName", e.target.value)}
                />
              </div>
            </div>
            <div className="field-wrap">
              <label className="field-label">Last Name</label>
              <div className="field">
                <input
                  type="text"
                  placeholder="Doe"
                  value={vcardData.lastName}
                  onChange={(e) => handleVCardField("lastName", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="field-wrap">
              <label className="field-label">Organization / Company</label>
              <div className="field">
                <input
                  type="text"
                  placeholder="Acme Corp"
                  value={vcardData.organization}
                  onChange={(e) => handleVCardField("organization", e.target.value)}
                />
              </div>
            </div>
            <div className="field-wrap">
              <label className="field-label">Job Title</label>
              <div className="field">
                <input
                  type="text"
                  placeholder="Creative Director"
                  value={vcardData.jobTitle}
                  onChange={(e) => handleVCardField("jobTitle", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="field-wrap">
              <label className="field-label">Phone</label>
              <div className="field">
                <Phone className="w-4 h-4 text-muted shrink-0" />
                <input
                  type="tel"
                  placeholder="+1 555 987 6543"
                  value={vcardData.phone}
                  onChange={(e) => handleVCardField("phone", e.target.value)}
                />
              </div>
            </div>
            <div className="field-wrap">
              <label className="field-label">Email</label>
              <div className="field">
                <Mail className="w-4 h-4 text-muted shrink-0" />
                <input
                  type="email"
                  placeholder="jane@acme.com"
                  value={vcardData.email}
                  onChange={(e) => handleVCardField("email", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="field-wrap">
            <label className="field-label">Website</label>
            <div className="field">
              <Globe className="w-4 h-4 text-muted shrink-0" />
              <input
                type="text"
                placeholder="https://janedoe.me"
                value={vcardData.website}
                onChange={(e) => handleVCardField("website", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
