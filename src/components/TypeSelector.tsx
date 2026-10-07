import type { QRType } from "../types";
import { Link, AlignLeft, Mail, Phone, Wifi, MessageSquare, Contact } from "lucide-react";

interface TypeSelectorProps {
  currentType: QRType;
  onSelectType: (type: QRType) => void;
}

const TYPE_CONFIGS: { type: QRType; label: string; icon: typeof Link }[] = [
  { type: "URL", label: "URL", icon: Link },
  { type: "Text", label: "Plain Text", icon: AlignLeft },
  { type: "Email", label: "Email", icon: Mail },
  { type: "Phone", label: "Phone", icon: Phone },
  { type: "Wi-Fi", label: "Wi-Fi", icon: Wifi },
  { type: "SMS", label: "SMS", icon: MessageSquare },
  { type: "vCard", label: "Contact", icon: Contact },
];

export function TypeSelector({ currentType, onSelectType }: TypeSelectorProps) {
  return (
    <div className="type-selector-bar" role="tablist" aria-label="QR Code Type">
      {TYPE_CONFIGS.map(({ type, label, icon: IconComponent }) => {
        const isSelected = currentType === type;
        return (
          <button
            key={type}
            role="tab"
            aria-selected={isSelected}
            className={`type-tab-btn ${isSelected ? "selected" : ""}`}
            onClick={() => onSelectType(type)}
            type="button"
          >
            <IconComponent className="w-4 h-4 shrink-0" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
