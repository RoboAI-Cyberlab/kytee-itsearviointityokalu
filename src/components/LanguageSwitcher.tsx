import { useAppStore } from "@/store/appStore";
import { useRouter } from "@tanstack/react-router";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { code: "fi", label: "FI", name: "Suomi" },
  { code: "en", label: "EN", name: "English" },
  { code: "sv", label: "SV", name: "Svenska" },
];

export function LanguageSwitcher() {
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const router = useRouter();

  const currentLanguage = languages.find((lang) => lang.code === language);

  const handleLanguageChange = async (newLanguage: string) => {
    // Wait for language to update in store
    await setLanguage(newLanguage);
    // Then invalidate all routes to reload with new language
    router.invalidate();
  };

  return (
    <Select value={language} onValueChange={handleLanguageChange}>
      <SelectTrigger
        className="h-8 w-fit gap-1.5 border-0 bg-transparent px-1 text-lg font-medium shadow-none hover:bg-accent hover:text-accent-foreground focus:ring-0 focus:ring-offset-0 [&>svg:last-child]:hidden"
        aria-label="Select language"
      >
        <Globe className="h-5 w-5" aria-hidden="true" />
        <SelectValue>{currentLanguage?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="text-sm">{lang.label} - {lang.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
