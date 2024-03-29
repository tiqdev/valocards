"use client";
import { Sheet, SheetContent } from "@/components/ui/sheet";

import CardForm from "@/components/form-card";
import { useSheetOpen } from "@/stores/main/hooks";
import { setSheetOpen } from "@/stores/main/actions";

const SheetForm = () => {
  const isSheetOpen = useSheetOpen();

  return (
    <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
      <SheetContent side={"left"} className="w-[340px] md:w-[400px] p-0 px-2">
        <aside className="z-10 h-full flex flex-col gap-4 items-center justify-start py-6 px-4">
          <CardForm />
        </aside>
      </SheetContent>
    </Sheet>
  );
};

export default SheetForm;
