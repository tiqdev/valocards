"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ToggleTheme } from "@/components/toggle-theme";
import Logo from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import CardForm from "@/components/form-card";
import { useEffect } from "react";
import { getPlayerCards, getTitles } from "@/stores/main/actions";

const SheetForm = () => {
  useEffect(() => {
    getTitles();
    getPlayerCards();
  }, []);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Edit Card</Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="w-[400px]">
        <aside className="z-10 h-full  flex flex-col gap-4 items-center justify-start py-6">
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
