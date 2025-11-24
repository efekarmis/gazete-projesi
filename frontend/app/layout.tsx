import type { Metadata } from "next";
import { Work_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // <-- Ekledik
import Footer from "@/components/Footer"; // <-- Ekledik

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
      <body className={`${workSans.variable} ${playfair.variable} bg-dark-bg text-light-text font-display antialiased flex flex-col min-h-screen`}>
        
        {/* Navbar her sayfada en üstte olacak */}
        <Navbar />

        {/* Değişen sayfa içeriği burada gösterilecek */}
        {children}

        {/* Footer her sayfada en altta olacak */}
        <Footer />
        
      </body>
    </html>
  );
}