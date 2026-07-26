import type { Metadata } from "next";
import { Cormorant_Garamond, Alex_Brush, Lora } from "next/font/google";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const alexBrush = Alex_Brush({
  variable: "--font-alex-brush",
  subsets: ["latin"],
  weight: ["400"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Nolen & Syrel's Wedding | October 2, 2027",
  description: "Join us in celebrating the wedding of Nolen Young & Syrel at Woodland Meadow Farms in Snohomish, Washington.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${cormorantGaramond.variable} ${alexBrush.variable} ${lora.variable} antialiased bg-[#FDFBF7] text-[#2E3834] selection:bg-[#D48C7B] selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
