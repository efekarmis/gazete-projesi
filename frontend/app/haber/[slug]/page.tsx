import { getArticle } from '@/lib/api';
import { Article } from '@/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, User, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

// Next.js 15 için params artık bir Promise'dir
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage(props: PageProps) {
  // 1. Önce parametreleri bekle (Next.js 15 Kuralı)
  const params = await props.params;
  
  // 2. Şimdi slug'ı kullanabiliriz
  const article: Article | null = await getArticle(params.slug);

  // 3. Haber yoksa 404 sayfasına at
  if (!article) {
    return notFound();
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 bg-dark-bg text-light-text font-display">
      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        
        {/* --- SOL KOLON: HABER İÇERİĞİ --- */}
        <div className="lg:col-span-8">
          
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 mb-6 text-sm font-medium">
            <Link href="/" className="text-light-text-secondary hover:text-primary transition-colors">Ana Sayfa</Link>
            <span className="text-light-text-secondary">/</span>
            <Link href={`/kategori/${article.category?.slug}`} className="text-light-text-secondary hover:text-primary transition-colors uppercase">
              {article.category?.name}
            </Link>
            <span className="text-light-text-secondary">/</span>
            <span className="text-white truncate max-w-[200px]">{article.title}</span>
          </div>

          {/* Kapak Fotoğrafı */}
          <div 
            className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-xl min-h-[320px] md:min-h-[450px] mb-8 shadow-lg" 
            style={{ backgroundImage: `url("${article.image_url}")` }}
          ></div>

          {/* Başlık */}
          <h1 className="text-white font-serif tracking-tight text-3xl md:text-4xl lg:text-5xl font-bold leading-tight pb-3">
            {article.title}
          </h1>

          {/* Meta Bilgiler */}
          <div className="flex items-center gap-4 text-light-text-secondary text-sm font-normal pb-8 pt-2 border-b border-dark-border mb-8">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{format(new Date(article.published_at), 'd MMMM yyyy, EEEE', { locale: tr })}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={18} />
              <span className="hover:text-primary transition-colors">Editör</span>
            </div>
          </div>

          {/* --- HABER METNİ (Rich Text) --- */}
          <div 
            className="prose prose-invert prose-lg max-w-none 
            prose-headings:font-serif prose-headings:text-white 
            prose-p:text-light-text prose-p:leading-relaxed 
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-primary prose-blockquote:bg-dark-card prose-blockquote:py-1 prose-blockquote:px-4"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          
        </div>

        {/* --- SAĞ KOLON: SIDEBAR --- */}
        <aside className="lg:col-span-4 mt-12 lg:mt-0">
          <div className="sticky top-28 space-y-8">
            
            {/* Nöbetçi Eczane */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold font-serif text-white mb-4">Nöbetçi Eczane</h3>
              <div className="space-y-3">
                <p className="text-primary font-bold text-lg">Merkez Eczanesi</p>
                <div className="flex items-start gap-3 text-light-text">
                  <MapPin size={20} className="text-light-text-secondary mt-1" />
                  <span>Atatürk Cad. No:12</span>
                </div>
                <div className="flex items-center gap-3 text-light-text">
                  <Clock size={20} className="text-light-text-secondary" />
                  <span>24 Saat Açık</span>
                </div>
              </div>
            </div>

            {/* Vefat İlanları */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold font-serif text-white mb-4">Vefat İlanları</h3>
              <ul className="space-y-4">
                <li className="border-b border-dark-border pb-3">
                  <Link href="#" className="group block">
                    <p className="font-semibold text-white group-hover:text-primary transition-colors">Ahmet Yılmaz</p>
                    <p className="text-sm text-light-text-secondary">1955 - 2025</p>
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </aside>
      </div>
    </main>
  );
}