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
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { motion } from "framer-motion";
import useIsMobile from "@/hooks/useIsMobile";
import FunPreview from "@/components/preview-fun";

export default function Home() {
  let cardPreview = useCardPreview();
  let titles = useTitles();
  let agents = useAgents();
  let tiers = useTiers();
  let playerCards = usePlayerCards();
  let isPng = useIsPng();
  let selectedLanguage = useSelectedLanguage();

  let isMobile = useIsMobile();

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

  const cardVariants = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <main className="flex min-h-svh w-full flex-col items-center justify-center absolute top-0 left-0 ">
      {isMobile ? (
        <div className="flex items-center justify-center">
          <h1 className="text-md text-center font-bold">
            This app is not supported on mobile
          </h1>
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            {cardPreview.type === "card" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                exit="hidden"
                className="flex flex-col items-center md:gap-4 gap-0"
                key={"card"}
              >
                <CardPreview />
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
              </motion.div>
            )}

            {cardPreview.type === "banner" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                exit="hidden"
                className="flex flex-col items-center gap-4"
                key={"banner"}
              >
                <BannerPreview />
              </motion.div>
            )}

            {cardPreview.type === "fun" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                exit="hidden"
                className="flex flex-col items-center md:gap-4 gap-0"
                key={"fun"}
              >
                <FunPreview />
              </motion.div>
            )}
          </AnimatePresence>

          <SheetForm />
        </>
      )}
    </main>
  );
}
