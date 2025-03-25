import Providers from "./providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Toaster } from "sonner";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VICoach",
  description:
    "A virtual interview coach that helps you prepare for your next job interview.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Suspense fallback={null}>
            <div className="mx-auto h-full w-full items-center justify-center">
              {children}
            </div>
          </Suspense>
          <Toaster richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
