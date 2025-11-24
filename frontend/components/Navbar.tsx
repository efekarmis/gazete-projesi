import Link from 'next/link';
import { Newspaper, Search } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { getCategories } from '@/lib/api'; // Kategorileri buradan çekeceğiz
import { Category } from '@/types';

export default async function Navbar() {
  // Navbar kendi verisini kendi çeker (Server Component gücü)
  const categories: Category[] = await getCategories();
  const currentDate = format(new Date(), 'd MMMM yyyy, EEEE', { locale: tr });

  return (
    <div className="w-full bg-dark-bg/80 shadow-sm sticky top-0 z-50 backdrop-blur-sm border-b border-dark-border">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between whitespace-nowrap px-4 sm:px-6 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 text-white hover:opacity-80 transition-opacity">
            <div className="size-6 text-primary">
              <Newspaper />
            </div>
            <h2 className="text-xl font-bold tracking-tight font-serif">Yerel Gazete</h2>
          </Link>

          {/* Menü (Kategoriler) */}
          <nav className="hidden md:flex items-center gap-9">
            {categories.map((cat) => (
              <Link 
                key={cat.ID} 
                href={`/kategori/${cat.slug}`} 
                className="text-sm font-medium text-light-text-secondary hover:text-white transition-colors uppercase"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Tarih ve Arama */}
          <div className="flex items-center gap-4">
            <p className="text-light-text-secondary text-sm font-normal hidden sm:block">
              {currentDate}
            </p>
            <button className="flex items-center justify-center rounded-full h-10 w-10 bg-dark-card text-light-text-secondary hover:bg-dark-border/50 hover:text-white transition-colors">
              <Search size={20} />
            </button>
          </div>
        </header>
      </div>
    </div>
  );
}