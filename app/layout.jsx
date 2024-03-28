import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Valorant Player Card Generator",
  description: "Generate Valorant Player Card with your own name and title.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Sidebar */}
        <aside className="fixed top-0 left-0 w-80 z-10 h-full bg-gray-900 text-white flex flex-col items-center justify-start px-4 py-12">
          <h1 className="text-2xl font-bold text-center">Logo</h1>
        </aside>

        <div className="fixed top-0 left-0 w-full">{children}</div>
      </body>
    </html>
  );
}
