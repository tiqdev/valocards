"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "@/hooks/use-translations";
import { isLanguageCode, languages } from "@/lib/i18n";

export const LanguageSelect = () => {
  const { lang, setLang } = useLanguage();
  const t = useTranslations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" aria-label={t.language_label}>
          <Languages />
          <span className="font-display uppercase tracking-wider">
            {lang.slice(0, 2)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>{t.language_label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={lang}
          onValueChange={(value) => {
            if (isLanguageCode(value)) setLang(value);
          }}
        >
          {languages.map((language) => (
            <DropdownMenuRadioItem key={language.value} value={language.value}>
              {language.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
