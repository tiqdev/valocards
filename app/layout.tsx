import type { Metadata } from "next";
import { Inter, Roboto_Condensed } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/app/providers";
import { getPreferredLanguage } from "@/lib/server/initial-config";

const fontSans = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-inter",
});

const fontCondensed = Roboto_Condensed({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "700"],
  variable: "--font-condensed",
});

const title = "ValoCards | tiqdev";
const description =
  "Valorant Player Card Generator is a tool to create custom player cards for Valorant players.";

export const metadata: Metadata = {
  metadataBase: new URL("https://valocards.vercel.app"),
  title,
  description,
  openGraph: {
    type: "website",
    url: "/",
    title,
    description,
    images: "/valocards_og.png",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: "/valocards_og.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const lang = await getPreferredLanguage();

  return (
    <html lang={lang.slice(0, 2)} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-svh font-sans antialiased",
          fontSans.variable,
          fontCondensed.variable
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
