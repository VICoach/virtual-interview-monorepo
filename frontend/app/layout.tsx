import Providers from "./providers";
import type { Metadata } from "next";
import { Roboto, Sansita } from "next/font/google";

import "./globals.css";
import { Toaster } from "sonner";
import { Suspense } from "react";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const sansita = Sansita({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-sansita",
});

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
      <body className={`${roboto.variable} ${sansita.variable}`}>
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
