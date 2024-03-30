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
import ToggleTheme from "@/components/toggle-theme";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

/*TODO:
    - Sidebar
    [x] add dropdown for selecting different player titles
    [x] add input field for player username
    [x] add select card image button for oppening dialog for selecting image 
    [x] sidebar ı sheet ile değiştir.
    [] animasyonlar ekle.
    [] toast mesajları ekle.
    [] temaları düzenle.
    [] rank seçme kısmını da ekle.
    [] background image ekle.
    [] card border a bak düzenle.
    [] card image yüklenene kadar skeleton göster.

*/

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Provider store={store}>
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
            <div className="h-full w-full dark:bg-black bg-white  dark:bg-grid-white/[0.1] bg-grid-black/[0.1] relative flex items-center justify-center">
              {/* Radial gradient for the container to give a faded look */}
              <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]"></div>
              <div className=" z-20">
                <Logo />
                <ToggleTheme />
                <MenuBar />
                <Toaster position="bottom-center" richColors />
                <div className="w-full">{children}</div>
              </div>
            </div>
          </ThemeProvider>
        </body>
      </Provider>
    </html>
  );
}
