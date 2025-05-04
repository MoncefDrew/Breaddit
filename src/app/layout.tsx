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
    <html lang="en" className="light">
      <body
        className={cn("min-h-screen bg-[#f9fafb] antialiased", inter.className)}
      >
        <div className="bg-[#f9fafb] min-h-screen">
          <Providers>
            {/* @ts-ignore */}
            <Navbar />
            {authModal}
            <div className="md:container  w-full md:max-w-5xl md:mx-auto pt-12 bg-[#f9fafb]">
              {children}
            </div>
          </Providers>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
