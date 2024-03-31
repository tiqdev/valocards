"use client";

import { Inter as FontSans } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

import { Provider } from "react-redux";
import store from "@/stores";
import { Toaster } from "@/components/ui/sonner";
import MenuBar from "@/components/menu-bar";
import Logo from "@/components/logo";
import PageHead from "@/components/head";
import SelectLanguage from "@/components/select-lang";
import useIsMobile from "@/hooks/useIsMobile";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }) {
  let isMobile = useIsMobile();
  return (
    <Provider store={store}>
      <html>
        <PageHead />

        <body
          className={cn(
            "min-h-svh h-svh font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="h-full w-full dark:bg-black bg-white  dark:bg-grid-red-600/[0.2] bg-grid-black/[0.1] relative flex items-center justify-center">
              <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]"></div>
              <div className="z-20">
                <Logo />
                {isMobile ? null : (
                  <>
                    <SelectLanguage />
                    <MenuBar />
                    <Toaster position="top-center" richColors />
                  </>
                )}

                <div className="w-full">{children}</div>
              </div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </Provider>
  );
}
