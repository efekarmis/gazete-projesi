import { getArticles } from "@/lib/api";
import { Article } from "@/types";
import { Eye, FileText, Activity, Plus } from "lucide-react";
import Link from "next/link";
import DashboardTable from "@/components/admin/DashboardTable"; // Az önce oluşturduğumuz tablo

export default async function DashboardPage() {
  // 1. Verileri Çek (Server Side)
  // Not: Gerçek bir projede "getStats" diye ayrı bir endpoint yazarız ama
  // şimdilik elimizdeki veriden hesaplayalım (MVP Yöntemi).
  const articles: Article[] = await getArticles();

  // 2. İstatistikleri Hesapla
  const totalArticles = articles.length;
  const totalViews = articles.reduce((sum, item) => sum + item.views, 0); // Tüm okunmaları topla

  return (
    <div className="p-8 w-full max-w-7xl mx-auto text-light-text">
      
      {/* Üst Başlık */}
      <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
          Dashboard
        </h1>
        <Link href="/admin/articles/new">
          <button className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold hover:bg-primary/90 transition-colors">
            <Plus size={20} />
            <span className="truncate">Yeni Haber Ekle</span>
          </button>
        </Link>
      </header>

      {/* İstatistik Kartları */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Kart 1: Toplam Okunma */}
        <div className="flex flex-col gap-2 rounded-lg p-6 bg-background-light dark:bg-card-dark border border-gray-200 dark:border-dark-border">
          <div className="flex items-center gap-2 text-gray-600 dark:text-light-text-secondary">
            <Eye size={24} />
            <p className="text-base font-medium">Toplam Okunma</p>
          </div>
          <p className="text-black dark:text-white text-3xl font-bold">
            {totalViews.toLocaleString('tr-TR')}
          </p>
        </div>

        {/* Kart 2: Toplam Haber */}
        <div className="flex flex-col gap-2 rounded-lg p-6 bg-background-light dark:bg-card-dark border border-gray-200 dark:border-dark-border">
          <div className="flex items-center gap-2 text-gray-600 dark:text-light-text-secondary">
            <FileText size={24} />
            <p className="text-base font-medium">Toplam Haber</p>
          </div>
          <p className="text-black dark:text-white text-3xl font-bold">
            {totalArticles}
          </p>
        </div>

        {/* Kart 3: Nöbetçi Eczane (Statik) */}
        <div className="flex flex-col gap-2 rounded-lg p-6 bg-background-light dark:bg-card-dark border border-gray-200 dark:border-dark-border">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-light-text-secondary">
                <Activity size={24} />
                <p className="text-base font-medium">Nöbetçi Eczane</p>
              </div>
              <p className="text-black dark:text-white text-3xl font-bold">Merkez Eczanesi</p>
            </div>
            <button className="text-gray-500 dark:text-light-text-secondary hover:text-white text-sm font-medium underline">
              Düzenle
            </button>
          </div>
        </div>
      </section>

      {/* Tablo Başlığı */}
      <h2 className="text-black dark:text-white text-[22px] font-bold mb-4">Son Eklenen Haberler</h2>

      {/* Dinamik Tablo Bileşeni */}
      <DashboardTable initialArticles={articles} />

    </div>
  );
}