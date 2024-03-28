"use client";

import CardPreview from "@/components/preview-card";
import { useIsLoading } from "@/stores/main/hooks";

export default function Home() {
  const isLoading = useIsLoading();

  return (
    <main className="flex min-h-screen w-full flex-col items-center ml-40 justify-center py-12">
      <CardPreview />
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
    </main>
  );
}
