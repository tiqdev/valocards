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
        <head>
          <meta name="theme-color" content={"#291911"} id="theme-color-meta" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <title>ValoCards | tiqdev</title>
          <meta name="title" content="ValoCards | tiqdev" />

          <link rel="shortcut icon" href="/static/favicon.ico" />
          <meta
            name="description"
            content="Valorant Player Card Generator is a tool to create custom player cards for Valorant players."
          />

          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://valocards.vercel.app/" />
          <meta property="og:title" content="ValoCards | tiqdev" />
          <meta
            property="og:description"
            content="Valorant Player Card Generator is a tool to create custom player cards for Valorant players."
          />
          <meta
            property="og:image"
            content="https://valocards.vercel.app/valocards_og.png"
          />

          <meta property="twitter:card" content="summary_large_image" />
          <meta
            property="twitter:url"
            content="https://valocards.vercel.app/"
          />
          <meta property="twitter:title" content="ValoCards | tiqdev" />
          <meta
            property="twitter:description"
            content="Valorant Player Card Generator is a tool to create custom player cards for Valorant players."
          />
          <meta
            property="twitter:image"
            content="https://valocards.vercel.app/valocards_og.png"
          />

          <meta name="robots" content="index, follow" />
          <meta name="googlebot" content="index, follow" />
          <meta
            property="og:image"
            content="https://valocards.vercel.app/valocards_og.png"
          />
        </head>

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
              {/* Radial gradient for the container to give a faded look */}
              <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]"></div>
              <div className=" z-20">
                <Logo />

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
