"use client";
import { ToggleTheme } from "@/components/toggle-theme";
import Logo from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import CardForm from "@/components/form-card";
import { useEffect } from "react";
import { getPlayerCards, getTitles } from "@/stores/main/actions";

const Sidebar = () => {
  useEffect(() => {
    getTitles();
    getPlayerCards();
  }, []);

  return (
    <aside className="fixed top-0 left-0 w-[400px] z-10 h-full  bg-gray-200 dark:bg-zinc-950 flex flex-col gap-4 items-center justify-start px-4 pt-6 pb-6">
      <Logo />

      <h2 className="scroll-m-20 border-b pb-4 text-xl font-semibold text-center tracking-tight mt-4 w-full first:mt-0">
        Create your card
      </h2>

      <CardForm />

      <Separator className="mt-auto" />

      <div className="flex flex-row justify-between items-center w-full">
        <Link
          href="https://tiqdev.vercel.app"
          target="_blank"
          className="font-medium  text-zinc-950 dark:text-white"
        >
          @tiqdev💛
        </Link>
        <ToggleTheme />
      </div>
    </aside>
  );
};

export default Sidebar;
