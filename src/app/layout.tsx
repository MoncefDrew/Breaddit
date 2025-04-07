import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { Toaster } from "../components/ui/toaster";
import "@/styles/globals.css";
import Providers from "@/components/Providers";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin-ext"] });

export const metadata = {
  title: "Breadit",
  description: "A Reddit clone built with Next.js and TypeScript.",
};

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn("min-h-screen bg-[#0E1113] antialiased", inter.className)}
      >
        <div className="bg-[#0E1113] min-h-screen">
          <Providers>
            {/* @ts-ignore */}
            <Navbar />
            <div className="container max-w-[1400px] mx-auto pt-12 bg-[#0E1113]">
              {children}
            </div>
          </Providers>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
