import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-dark-card mt-12 border-t border-dark-border">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
        <p className="text-light-text-secondary">© 2025 Yerel Gazete. Tüm hakları saklıdır.</p>
        <div className="flex gap-6">
          <Link href="#" className="text-light-text-secondary hover:underline hover:text-white">Hakkımızda</Link>
          <Link href="#" className="text-light-text-secondary hover:underline hover:text-white">İletişim</Link>
          <Link href="#" className="text-light-text-secondary hover:underline hover:text-white">Künye</Link>
        </div>
      </div>
    </footer>
  );
}