import type { Metadata } from "next";
import { Outfit, Roboto } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-outfit" 
});

const roboto = Roboto({ 
  subsets: ["latin"], 
  weight: ["400", "500", "700"],
  variable: "--font-roboto" 
});

export const metadata: Metadata = {
  title: "VOZ PÚBLICA | Mato Grosso do Sul 2026",
  description: "Plataforma pública de avaliação cidadã de candidatos políticos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${roboto.variable}`}>
      <body className="antialiased bg-[#141413] text-[#f5f0e8] overflow-x-hidden">{children}</body>
    </html>
  );
}
