import type { Metadata } from "next";
import { Work_Sans, Playfair_Display } from "next/font/google"; // Google Fontları
import "./globals.css";

// Font Ayarları
const workSans = Work_Sans({ 
  subsets: ["latin"], 
  variable: "--font-work-sans" 
});
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair" 
});

export const metadata: Metadata = {
  title: "Yerel Gazete",
  description: "En güncel yerel haberler",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark"> 
      {/* className="dark" ekledik ki her zaman dark mode olsun */}
      <body className={`${workSans.variable} ${playfair.variable} bg-dark-bg text-light-text font-display antialiased`}>
        {children}
      </body>
    </html>
  );
}