import type { Config } from "next/config";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}", // lib klasörünü de ekledik
  ],
  darkMode: 'class', // Dark mode'u sınıf bazlı yapıyoruz
  theme: {
    extend: {
      colors: {
        "primary": "#ef4444", // Kırmızı vurgu rengi
        "dark-bg": "#121212",   // Koyu arka plan
        "dark-card": "#1e1e1e", // Kart rengi
        "dark-border": "#333333", // Çerçeve rengi
        "light-text": "#e0e0e0",  // Açık gri metin
        "light-text-secondary": "#a0a0a0" // Daha soluk metin
      },
      fontFamily: {
        "display": ["var(--font-work-sans)", "sans-serif"], // Ana font
        "serif": ["var(--font-playfair)", "serif"]          // Başlık fontu
      },
    },
  },
  plugins: [],
};
export default config;