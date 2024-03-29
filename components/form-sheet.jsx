"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import CardForm from "@/components/form-card";
import { useEffect } from "react";
import { getAgents, getPlayerCards, getTitles } from "@/stores/main/actions";

const SheetForm = () => {
  useEffect(() => {
    getTitles();
    getPlayerCards();
    getAgents();
  }, []);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Edit Card</Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="w-[340px] md:w-[400px] p-0 px-2">
        <aside className="z-10 h-full flex flex-col gap-4 items-center justify-start py-6 px-4">
          <h2 className="scroll-m-20 border-b pb-4 text-xl font-semibold text-center tracking-tight mt-4 w-full first:mt-0">
            Create your card
          </h2>
          <CardForm />
        </aside>
      </SheetContent>
    </Sheet>
  );
};

export default SheetForm;
