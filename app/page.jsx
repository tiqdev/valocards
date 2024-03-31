"use client";

import SheetForm from "@/components/form-sheet";
import BannerPreview from "@/components/preview-banner";
import CardPreview from "@/components/preview-card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  getAgents,
  getPlayerCards,
  getTiers,
  getTitles,
  setIsPng,
  setSelectedLanguage,
} from "@/stores/main/actions";
import {
  useAgents,
  useCardPreview,
  useIsPng,
  usePlayerCards,
  useSelectedLanguage,
  useTiers,
  useTitles,
} from "@/stores/main/hooks";
import { useEffect } from "react";

export default function Home() {
  let cardPreview = useCardPreview();
  let titles = useTitles();
  let agents = useAgents();
  let tiers = useTiers();
  let playerCards = usePlayerCards();
  let isPng = useIsPng();
  let selectedLanguage = useSelectedLanguage();

  useEffect(() => {
    if (titles.length === 0) {
      getTitles();
    }

    if (playerCards.length === 0) {
      getPlayerCards();
    }

    if (agents.length === 0) {
      getAgents();
    }

    if (tiers.length === 0) {
      getTiers();
    }
  }, [agents.length, playerCards.length, tiers.length, titles.length]);

  useEffect(() => {
    getTitles();
    getTiers();
  }, [selectedLanguage]);

  useEffect(() => {
    const selectedLanguageFromLocalStorage =
      localStorage.getItem("selectedLanguage");

    if (selectedLanguageFromLocalStorage) {
      setSelectedLanguage(JSON.parse(selectedLanguageFromLocalStorage).name);
    }
  }, []);

  return (
    <main className="flex min-h-svh w-full flex-col items-center justify-center gap-6 absolute top-0 left-0 ">
      {cardPreview.type === "card" && <CardPreview />}
      {cardPreview.type === "card" && (
        <>
          <div className="flex items-center space-x-2">
            <Switch
              id="shape"
              checked={isPng}
              onCheckedChange={(value) => {
                setIsPng(value);
              }}
            />
            <Label htmlFor="shape">.png format</Label>
          </div>
        </>
      )}
      {cardPreview.type === "banner" && <BannerPreview />}
      <SheetForm />
    </main>
  );
}
