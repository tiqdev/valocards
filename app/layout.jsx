import { Inter as FontSans } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { ToggleTheme } from "@/components/toggle-theme";
import Logo from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Valorant Player Card Generator",
  description: "Generate Valorant Player Card with your own name and title.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <body
          className={cn(
            "min-h-screen font-sans antialiased",
            fontSans.variable
          )}
        >
          {/* Sidebar */}
          <aside className="fixed top-0 left-0 w-80 z-10 h-full  bg-gray-200 dark:bg-zinc-950 flex flex-col gap-4 items-center justify-start px-4 pt-12 pb-6">
            <Logo />

            <h2 className="scroll-m-20 border-b pb-2 text-xl font-semibold text-center tracking-tight mt-4 w-full first:mt-0">
              Settings
            </h2>

            <Separator className="mt-auto" />

            <div className="flex flex-row justify-between items-center w-full">
              <Link
                href="https://tiqdev.com"
                target="_blank"
                className="font-medium  text-zinc-950 dark:text-white"
              >
                @tiqdev💛
              </Link>
              <ToggleTheme />
            </div>
          </aside>

          <div className="fixed top-0 left-0 w-full">{children}</div>
        </body>
      </ThemeProvider>
    </html>
  );
}
