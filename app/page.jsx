"use client";

import SheetForm from "@/components/form-sheet";
import BannerPreview from "@/components/preview-banner";
import CardPreview from "@/components/preview-card";

import {
  getAgents,
  getPlayerCards,
  getTiers,
  getTitles,
} from "@/stores/main/actions";
import {
  useAgents,
  useCardPreview,
  usePlayerCards,
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

  return (
    <main className="flex min-h-svh w-full flex-col items-center justify-center md:gap-12 gap-4 absolute top-0 left-0 ">
      {cardPreview.type === "card" && <CardPreview />}
      {cardPreview.type === "banner" && <BannerPreview />}
      <SheetForm />
    </main>
  );
}
