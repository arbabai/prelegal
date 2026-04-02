import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, EB_Garamond } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prelegal — Legal agreements, drafted in minutes",
  description: "Draft legal agreements from templates with Prelegal.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`h-full ${dmSans.variable} ${playfair.variable} ${garamond.variable}`}
    >
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
