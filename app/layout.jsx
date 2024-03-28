"use client";

import { Inter as FontSans } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

import { Provider } from "react-redux";
import store from "@/stores";
import Sidebar from "@/components/sidebar";

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
            "min-h-dvh h-dvh font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="w-full">{children}</div>
          </ThemeProvider>
        </body>
      </Provider>
    </html>
  );
}
