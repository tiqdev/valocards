"use client";

import SheetForm from "@/components/form-sheet";
import BannerPreview from "@/components/preview-banner";
import CardPreview from "@/components/preview-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { setCardPreview } from "@/stores/main/actions";
import { useCardPreview } from "@/stores/main/hooks";

export default function Home() {
  let cardPreview = useCardPreview();
  console.log(cardPreview);

  const tabChange = (value) => {
    cardPreview = {
      ...cardPreview,
      type: value,
    };

    setCardPreview(cardPreview);
  };

  return (
    <main className="flex min-h-svh w-full flex-col items-center justify-center md:gap-12 gap-4">
      <Tabs
        defaultValue={cardPreview.type}
        className="w-[400px] flex flex-col items-center justify-center"
      >
        <TabsList className="min-w-[268px] flex flex-row items-center justify-between">
          <TabsTrigger
            className="flex-1"
            value="card"
            onClick={() => {
              tabChange("card");
            }}
          >
            Card
          </TabsTrigger>
          <TabsTrigger
            className="flex-1 "
            value="banner"
            onClick={() => {
              tabChange("banner");
            }}
          >
            Banner
          </TabsTrigger>
        </TabsList>
        <TabsContent className="flex items-center justify-center" value="card">
          <CardPreview />
        </TabsContent>
        <TabsContent
          value="banner"
          className="flex items-center justify-center"
        >
          <BannerPreview />
        </TabsContent>
      </Tabs>

      <SheetForm />
    </main>
  );
}
