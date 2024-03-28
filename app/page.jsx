"use client";

import SheetForm from "@/components/form-sheet";
import CardPreview from "@/components/preview-card";

export default function Home() {
  return (
    <main className="flex min-h-svh w-full flex-col items-center justify-center md:gap-12 gap-4">
      <CardPreview />
      <SheetForm />
    </main>
  );
}
