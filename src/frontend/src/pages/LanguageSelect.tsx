import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslations } from "../hooks/useTranslations";

const languages = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "fr", label: "French", native: "Français" },
  { code: "de", label: "German", native: "Deutsch" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "zh", label: "Chinese", native: "中文" },
  { code: "ja", label: "Japanese", native: "日本語" },
];

interface LanguageSelectProps {
  onContinue: (language: string) => void;
}

export function LanguageSelect({ onContinue }: LanguageSelectProps) {
  const [selected, setSelected] = useState("en");
  const t = useTranslations();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.14 0.04 236)" }}
    >
      {/* Header */}
      <div className="px-6 pt-12 pb-6 text-center">
        <div className="flex justify-center mb-4">
          <img
            src="/assets/generated/trillz-logo-transparent.dim_400x120.png"
            alt="Trillz"
            className="h-10 object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">
          {t.chooseYourLanguage}
        </h1>
        <p className="text-sm" style={{ color: "oklch(0.65 0.08 236)" }}>
          Select the language you're most comfortable with
        </p>
      </div>

      {/* Language Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="grid grid-cols-2 gap-3">
          {languages.map((lang) => {
            const isSelected = selected === lang.code;
            return (
              <button
                type="button"
                key={lang.code}
                onClick={() => setSelected(lang.code)}
                className="rounded-xl p-4 text-left transition-all border-2"
                style={{
                  background: isSelected
                    ? "oklch(0.55 0.2 250)"
                    : "oklch(0.2 0.04 236)",
                  borderColor: isSelected
                    ? "oklch(0.7 0.22 250)"
                    : "oklch(0.28 0.05 236)",
                }}
              >
                <div
                  className="text-lg font-bold mb-0.5"
                  style={{
                    color: isSelected ? "white" : "oklch(0.85 0.05 236)",
                  }}
                >
                  {lang.native}
                </div>
                <div
                  className="text-xs"
                  style={{
                    color: isSelected
                      ? "oklch(0.9 0.08 250)"
                      : "oklch(0.55 0.06 236)",
                  }}
                >
                  {lang.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Continue Button */}
      <div className="px-6 pb-10 pt-4">
        <Button
          className="w-full h-12 text-base font-semibold rounded-xl"
          style={{
            background: "oklch(0.55 0.2 250)",
            color: "white",
          }}
          onClick={() => onContinue(selected)}
        >
          {t.continueBtn}
        </Button>
      </div>
    </div>
  );
}
