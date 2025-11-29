"use client"; // Bu bir Client Component (Etkileşim var)

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Newspaper, User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  
  // State'ler (Verileri tutan değişkenler)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Giriş Yap Butonuna Basılınca Çalışan Fonksiyon
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Sayfanın yenilenmesini engelle
    setIsLoading(true);
    setError("");

    try {
      // 1. Backend'e İstek At
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Giriş başarısız");
      }

      // 2. Başarılıysa Token'ı Cookie'ye Kaydet
      // (Expires: 3 gün sonra silinir)
      document.cookie = `admin_token=${data.token}; path=/; max-age=259200; SameSite=Lax`;

      // 3. Yönlendir
      router.push("/admin/dashboard");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-dark-bg overflow-hidden font-display">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="flex w-full max-w-md flex-col items-center gap-8">
            
            {/* LOGIN KARTI */}
            <div className="flex w-full flex-col items-center justify-center gap-6 rounded-xl border border-dark-border bg-dark-card p-6 sm:p-8 shadow-lg">
              
              {/* Başlık ve İkon */}
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Newspaper size={28} />
                </div>
                <div className="flex flex-col gap-1">
                  <h1 className="font-serif text-[32px] font-bold leading-tight tracking-tight text-light-text">
                    Yerel Gazete Admin
                  </h1>
                  <p className="text-base font-normal leading-normal text-light-text-secondary">
                    Yönetim Paneline Hoşgeldiniz
                  </p>
                </div>
              </div>

              {/* Hata Mesajı Kutusu */}
              {error && (
                <div className="w-full bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
                  {error}
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleLogin} className="flex w-full flex-col gap-4">
                
                {/* Kullanıcı Adı */}
                <div className="flex w-full flex-col">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="pb-2 text-base font-medium leading-normal text-light-text">Kullanıcı Adı</p>
                    <div className="relative flex w-full items-center">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-light-text-secondary">
                        <User size={20} />
                      </div>
                      <input 
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-dark-border bg-[#271c1c] p-[15px] pl-12 text-base font-normal leading-normal text-light-text placeholder:text-light-text-secondary/50 focus:border-primary focus:outline-0 focus:ring-1 focus:ring-primary/50" 
                        placeholder="Kullanıcı adınızı girin" 
                      />
                    </div>
                  </label>
                </div>

                {/* Şifre */}
                <div className="flex w-full flex-col">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="pb-2 text-base font-medium leading-normal text-light-text">Şifre</p>
                    <div className="relative flex w-full items-center">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-light-text-secondary">
                        <Lock size={20} />
                      </div>
                      <input 
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-dark-border bg-[#271c1c] p-[15px] pl-12 pr-12 text-base font-normal leading-normal text-light-text placeholder:text-light-text-secondary/50 focus:border-primary focus:outline-0 focus:ring-1 focus:ring-primary/50" 
                        placeholder="Şifrenizi girin" 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-4 text-light-text-secondary hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </label>
                </div>

                {/* Giriş Butonu */}
                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="flex h-12 min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-5 text-base font-bold leading-normal tracking-[0.015em] text-white transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <span className="truncate">Giriş Yap</span>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Ana Sayfaya Dön Linki */}
            <Link href="/" className="text-sm font-medium text-light-text underline-offset-4 hover:text-white hover:underline transition-colors">
              Ana Sayfaya Dön
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}