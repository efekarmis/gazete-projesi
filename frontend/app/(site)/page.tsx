import { getArticles, getHeadlines, getCategories } from '@/lib/api';
import { Article, Category } from '@/types';
import Link from 'next/link';
import { Newspaper, Search } from 'lucide-react'; // İkonlar
import { format } from 'date-fns'; // Tarih formatlama
import { tr } from 'date-fns/locale'; // Türkçe tarih için

export default async function Home() {
  // 1. Verileri Çek
  const headlinesData: Promise<Article[]> = getHeadlines();
  const articlesData: Promise<Article[]> = getArticles();
  const categoriesData: Promise<Category[]> = getCategories();

  const [headlines, articles, categories] = await Promise.all([
    headlinesData, 
    articlesData, 
    categoriesData
  ]);

  // Manşet Mantığı: İlk haber Büyük, sonraki 2 haber yanındaki küçükler
  const mainHeadline = headlines[0];
  const subHeadlines = headlines.slice(1, 3);
  
  // Bugünün Tarihi
  const currentDate = format(new Date(), 'd MMMM yyyy, EEEE', { locale: tr });

  return (
      <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6">
        
        {/* HERO SECTION (Slider Alanı) */}
        {mainHeadline && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            
            {/* Büyük Manşet (Sol) */}
            <div className="lg:col-span-2">
              <div className="flex flex-col rounded-lg bg-dark-card border border-dark-border overflow-hidden h-full">
                <div 
                  className="w-full bg-center bg-no-repeat aspect-[16/9] bg-cover" 
                  style={{ backgroundImage: `url("${mainHeadline.image_url}")` }}
                ></div>
                <div className="p-6">
                  <span className="text-primary text-sm font-bold uppercase mb-2">
                    {mainHeadline.category?.name || 'Gündem'}
                  </span>
                  <Link href={`/haber/${mainHeadline.slug}`}>
                    <h1 className="font-serif text-3xl md:text-4xl font-bold leading-tight text-white mb-3 hover:text-primary transition-colors">
                      {mainHeadline.title}
                    </h1>
                  </Link>
                  <p className="text-light-text text-base leading-relaxed line-clamp-2">
                    {mainHeadline.summary}
                  </p>
                  <Link href={`/haber/${mainHeadline.slug}`}>
                    <button className="mt-4 rounded-lg h-10 px-5 bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
                      Haberi Oku
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Yan Manşetler (Sağ) */}
            <div className="flex flex-col gap-6">
              {subHeadlines.map((news) => (
                <div key={news.ID} className="p-4 bg-dark-card rounded-lg border border-dark-border h-full">
                  <div className="flex items-start justify-between gap-4 h-full">
                    
                    {/* Yazı Alanı */}
                    <div className="flex flex-1 flex-col gap-2">
                      <Link href={`/haber/${news.slug}`}>
                        <p className="text-white text-base font-bold leading-tight hover:text-primary line-clamp-3">
                          {news.title}
                        </p>
                      </Link>
                      <p className="text-light-text-secondary text-xs mt-auto">
                        {format(new Date(news.published_at), 'd MMM yyyy', { locale: tr })}
                      </p>
                    </div>

                    {/* Resim Alanı (DÜZELTİLDİ) */}
                    <div 
                      className="w-32 h-24 bg-center bg-no-repeat bg-cover rounded-lg shrink-0 border border-dark-border/50" 
                      style={{ backgroundImage: `url("${news.image_url}")` }}
                    ></div>
                    
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- ALT KISIM (Grid ve Sidebar) --- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sol Kolon: Son Haberler Listesi */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl font-bold border-b-2 border-primary pb-2 mb-6 text-white">
              Son Dakika
            </h2>
            <div className="space-y-6">
              {articles.map((news) => (
                <div key={news.ID} className="flex flex-col sm:flex-row gap-4 p-4 bg-dark-card rounded-lg border border-dark-border hover:border-primary/50 transition-colors">
                  <div 
                    className="w-full sm:w-1/3 h-48 sm:h-auto bg-center bg-no-repeat bg-cover rounded-lg shrink-0" 
                    style={{ backgroundImage: `url("${news.image_url}")` }}
                  ></div>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-primary uppercase">
                        {news.category?.name}
                      </span>
                      <span className="text-light-text-secondary">•</span>
                      <p className="text-light-text-secondary">
                        {format(new Date(news.published_at), 'd MMMM yyyy', { locale: tr })}
                      </p>
                    </div>
                    <Link href={`/haber/${news.slug}`}>
                      <h3 className="text-white text-lg font-bold leading-tight hover:text-primary transition-colors">
                        {news.title}
                      </h3>
                    </Link>
                    <p className="text-light-text text-sm leading-normal line-clamp-3">
                      {news.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ Kolon: Sidebar (Eczane, Vefat vb.) */}
          <aside className="space-y-8">
            
            {/* Nöbetçi Eczane Widget */}
            <div className="p-4 bg-dark-card rounded-lg border border-dark-border">
              <h3 className="font-serif text-lg font-bold mb-4 text-white flex items-center gap-2">
                Nöbetçi Eczane
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              </h3>
              <div className="space-y-2">
                <p className="font-bold text-primary text-xl">Merkez Eczanesi</p>
                <p className="text-sm text-light-text">Atatürk Cad. No:12 (Belediye Karşısı)</p>
                <p className="text-sm text-light-text font-mono">Tel: (0212) 555 12 34</p>
                <button className="w-full mt-2 py-2 rounded bg-green-700 text-white text-xs font-bold uppercase hover:bg-green-600 transition">
                  Haritada Göster
                </button>
              </div>
            </div>

            {/* Vefat İlanları Widget */}
            <div className="p-4 bg-dark-card rounded-lg border border-dark-border">
              <h3 className="font-serif text-lg font-bold mb-4 text-white">Vefat İlanları</h3>
              <ul className="space-y-3">
                {/* Şimdilik manuel veri, sonra buraya API bağlarız */}
                <li className="border-b border-dark-border pb-2">
                  <p className="font-semibold text-light-text">Ahmet Yılmaz</p>
                  <p className="text-xs text-light-text-secondary">Defin: Merkez Mezarlığı</p>
                </li>
                <li className="border-b border-dark-border pb-2">
                  <p className="font-semibold text-light-text">Fatma Demir</p>
                  <p className="text-xs text-light-text-secondary">Defin: Köy Mezarlığı</p>
                </li>
              </ul>
              <button className="text-primary text-xs font-bold mt-2 hover:underline">
                Tümünü Gör →
              </button>
            </div>

            {/* Çok Okunanlar Widget */}
            <div className="p-4 bg-dark-card rounded-lg border border-dark-border">
              <h3 className="font-serif text-lg font-bold mb-4 text-white">Çok Okunanlar</h3>
              <ol className="list-decimal list-inside space-y-3 text-sm text-light-text">
                {articles.slice(0, 5).map((news) => (
                  <li key={news.ID}>
                    <Link href={`/haber/${news.slug}`} className="hover:text-primary transition-colors line-clamp-1">
                      {news.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>

          </aside>
        </section>
      </main>

  );
}