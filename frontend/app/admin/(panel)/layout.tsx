import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display">
      {/* Sidebar sadece admin rotalarında görünecek */}
      {/* Not: Login sayfasında gizlemek için CSS veya Route Group kullanmak daha iyidir ama şimdilik basit tutalım */}
      <div className="hidden md:block"> 
        <Sidebar />
      </div>
      
      <main className="flex-1 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}