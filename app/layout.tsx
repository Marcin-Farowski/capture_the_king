import type { Metadata } from "next";
import { Catamaran } from "next/font/google";
import "./globals.css";

const catamaran = Catamaran({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Schwytaj Króla | Twoje Narzędzie do Sukcesu w Grze",
  description:
    "Zdobądź przewagę w Schwytaj Króla dzięki naszej aplikacji: optymalizuj strategie, śledź postępy i korzystaj z zaawansowanych funkcji.",
  keywords: [
    "Schwytaj Króla",
    "Aplikacja do Schwytaj Króla",
    "Narzędzie do Schwytaj Króla",
    "Pomoc w Schwytaj Króla",
  ],
  creator: "Marcin Farowski",
  publisher: "Marcin Farowski",
  metadataBase: new URL("https://capture-the-king.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Zdominuj Schwytaj Króla",
    description:
      "Skorzystaj z naszej aplikacji, aby zdobywać przewagę w Schwytaj Króla.",
    url: "https://capture-the-king.vercel.app",
    siteName: "Zdominuj Schwytaj Króla",
    images: [
      {
        url: "https://capture-the-king.vercel.app/assets/schwytaj-krola.jpg",
        width: 616,
        height: 353,
      },
    ],
    locale: "pl_PL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl-PL" className={`${catamaran.className}`}>
      <body>{children}</body>
    </html>
  );
}
