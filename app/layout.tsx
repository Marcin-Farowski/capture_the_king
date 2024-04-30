import type { Metadata } from "next";
import { Catamaran } from "next/font/google";
import "./globals.css";

const catamaran = Catamaran({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Schwytaj Króla",
  description: "Make the game easier for yourself",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${catamaran.className}`}>
      <body>{children}</body>
    </html>
  );
}
