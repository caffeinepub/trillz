import { defaultTranslations, translations } from "../lib/translations";

export function useTranslations() {
  try {
    const raw = localStorage.getItem("trillz_user");
    if (raw) {
      const user = JSON.parse(raw);
      const lang = user?.language as string;
      if (lang && translations[lang as keyof typeof translations]) {
        return translations[lang as keyof typeof translations];
      }
    }
  } catch {}
  return defaultTranslations;
}
