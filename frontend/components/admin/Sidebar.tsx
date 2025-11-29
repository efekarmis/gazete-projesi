"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, FileText, User, Settings, LogOut, Newspaper } from "lucide-react";

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    // Çerezi sil (Tarihi geçmişe alarak)
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/admin/login");
  };

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-background-light dark:bg-card-dark border-r border-transparent dark:border-dark-border">
      <div className="flex flex-col justify-between flex-grow p-4">
        
        {/* Logo Alanı */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 px-3">
            <div className="flex items-center justify-center bg-primary/10 rounded-full size-10 text-primary">
              <Newspaper size={20} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-black dark:text-light-text text-base font-bold leading-normal">Yerel Gazete</h1>
              <p className="text-gray-500 dark:text-light-text-secondary text-sm font-normal leading-normal">CMS Panel</p>
            </div>
          </div>

          {/* Menü Linkleri */}
          <nav className="flex flex-col gap-2">
            <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20 text-primary">
              <LayoutDashboard size={20} />
              <p className="text-sm font-medium leading-normal">Dashboard</p>
            </Link>
            
            <Link href="/admin/articles" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-600 dark:text-light-text transition-colors">
              <FileText size={20} />
              <p className="text-sm font-medium leading-normal">Haberler</p>
            </Link>

            <Link href="/admin/obituaries" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-600 dark:text-light-text transition-colors">
              <User size={20} />
              <p className="text-sm font-medium leading-normal">Vefat İlanları</p>
            </Link>

            <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-600 dark:text-light-text transition-colors">
              <Settings size={20} />
              <p className="text-sm font-medium leading-normal">Ayarlar</p>
            </Link>
          </nav>
        </div>

        {/* Çıkış Yap */}
        <div className="flex flex-col">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-gray-600 dark:text-light-text hover:text-red-500 transition-colors w-full text-left">
            <LogOut size={20} />
            <p className="text-sm font-medium leading-normal">Çıkış Yap</p>
          </button>
        </div>
      </div>
    </aside>
  );
}