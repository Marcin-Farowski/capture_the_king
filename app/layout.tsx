import type { Metadata } from "next";
import { Catamaran } from "next/font/google";
import "./globals.css";

const catamaran = Catamaran({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zdominuj Schwytaj Króla | Twoje Narzędzie do Sukcesu w Grze",
  description: "Skorzystaj z naszej aplikacji, aby zdobywać przewagę w Schwytaj Króla. Optymalizuj swoje strategie, śledź postępy i wykorzystaj zaawansowane funkcje wspomagające grę. Osiągnij mistrzostwo w Schwytaj Króla już dziś!",
  keywords: ['Schwytaj Króla', 'Aplikacja do Schwytaj Króla', 'Narzędzie do Schwytaj Króla', 'Pomoc w Schwytaj Króla'],
  creator: 'Marcin Farowski',
  publisher: 'Marcin Farowski',
  metadataBase: new URL('https://capture-the-king.vercel.app/'),
  openGraph: {
    title: 'Zdominuj Schwytaj Króla',
    description: 'Skorzystaj z naszej aplikacji, aby zdobywać przewagę w Schwytaj Króla.',
    type: 'website',
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
