import { useState, useRef, useCallback } from 'react';
import { Temple } from '@/types';
import { useTempleData } from '@/hooks/useTempleData';
import { useAdmin } from '@/hooks/useAdmin';
import { useSchedule } from '@/hooks/useSchedule';
import { Navbar } from '@/components/layout/Navbar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingButtons } from '@/components/layout/FloatingButtons';
import { Schedule } from '@/components/schedule/Schedule';
import { AdminLoginDialog } from '@/components/admin/AdminLoginDialog';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { TempleCard } from '@/components/temple/TempleCard';
import GeminiGuide from '@/components/GeminiGuide';
import { Toaster } from '@/ui/sonner';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardTitle } from '@/ui/card';
import { APP_CONFIG } from '@/constants';
import { ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const { temples, selectedTemple, selectTemple, updateTemple, importTemples, exportTemples } = useTempleData();
  const { isAdmin, login, logout } = useAdmin();
  const { context, buildGoogleMapsRoute } = useSchedule(temples);

  const [showLogin, setShowLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const itineraryRef = useRef<HTMLDivElement>(null);

  const scrollToItinerary = useCallback(() => {
    itineraryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleLogin = (password: string): boolean => {
    const success = login(password);
    if (success) {
      toast.success('Admin mode activated');
      setShowLogin(false);
    } else {
      toast.error('Invalid password');
    }
    return success;
  };

  const handleExport = useCallback(() => {
    const data = exportTemples();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'phanthiet-temples.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  }, [exportTemples]);

  const handleImport = useCallback((data: Temple[]) => {
    importTemples(data);
    toast.success('Data imported successfully');
  }, [importTemples]);

  const handleTempleUpdate = useCallback((updated: Temple) => {
    updateTemple(updated.id, updated);
    selectTemple(updated);
  }, [updateTemple, selectTemple]);

  return (
    <div className="min-h-screen bg-[#FDFCFB] selection:bg-orange-100 overflow-x-hidden">
      <Toaster />

      <AdminLoginDialog
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
      />

      <AdminPanel
        open={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
        onExport={handleExport}
        onImport={handleImport}
        onLogout={logout}
      />

      <Navbar
        isAdmin={isAdmin}
        onLoginClick={() => setShowLogin(true)}
        onLogout={logout}
        onAdminPanelClick={() => setShowAdminPanel(true)}
      />

      <Header context={context} onStartRoute={scrollToItinerary} />

      <main>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-8 md:gap-12 -mt-8 md:-mt-12 relative z-20 pb-32">
          <div className="lg:col-span-3">
            <div className="glass-card-light p-6 md:p-8 sticky top-28">
              <Schedule temples={temples} />

              <button
                onClick={buildGoogleMapsRoute}
                className="w-full mt-8 bg-stone-900 text-white py-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Маршрут
              </button>
            </div>
          </div>

          <div ref={itineraryRef} className="lg:col-span-9 space-y-10">
            <div className="grid md:grid-cols-2 gap-8">
              {temples.map((t, i) => (
                <Card
                  key={t.id}
                  className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1 h-full"
                  onClick={() => selectTemple(t)}
                >
                  <div className="h-56 md:h-64 relative overflow-hidden">
                    {t.imageUrl ? (
                      <img
                        src={t.imageUrl}
                        alt={t.name}
                        className="w-full h-full object-cover transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.classList.add('card-placeholder');
                        }}
                      />
                    ) : (
                      <div className="w-full h-full card-placeholder" />
                    )}
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full font-semibold text-[10px] text-[#1A1A1A]">
                      {i + 1}
                    </div>
                    {t.isNightActive && (
                      <div className="absolute top-4 right-4 px-3 py-1.5 bg-orange-600 text-white rounded-full font-medium text-[9px] uppercase tracking-wide">
                        Вечером
                      </div>
                    )}
                  </div>
                  <CardContent className="p-7 flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-orange-600">{t.culture}</span>
                      <span className="text-[11px] font-medium text-[#6B7280]">{t.duration}</span>
                    </div>
                    <CardTitle className="text-[22px] font-extrabold mb-3 text-[#111827]">{t.name}</CardTitle>
                    <CardDescription className="text-[#4B5563] text-sm leading-[1.625] line-clamp-3 mb-5 flex-1">{t.description}</CardDescription>
                    <div className="mt-auto pt-4 border-t border-[#F3F4F6] flex justify-between items-center">
                      <span className="text-[12px] font-medium text-[#6B7280]">Подробнее</span>
                      <ArrowRight className="w-4 h-4 text-[#6B7280] ml-2 transition-transform duration-200" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <section className="bg-stone-900 rounded-3xl p-8 md:p-16 text-white">
              <div className="max-w-xl">
                <h2 className="text-2xl md:text-4xl font-bold mb-4">Нужен живой гид?</h2>
                <p className="text-stone-400 text-base mb-8 leading-relaxed">
                  Профессиональный гид знает историю каждого камня. Забронируйте экскурсию.
                </p>
                <a
                  href={APP_CONFIG.TRIPSTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-orange-600 px-6 py-3 rounded-full font-medium hover:bg-orange-700 transition-colors cursor-pointer"
                >
                  Забронировать
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer isAdmin={isAdmin} onAdminToggle={() => isAdmin ? logout() : setShowLogin(true)} />

      <FloatingButtons onOpenChat={() => {}} />

      {selectedTemple && (
        <TempleCard
          temple={selectedTemple}
          onClose={() => selectTemple(null)}
          onSave={isAdmin ? handleTempleUpdate : undefined}
        />
      )}

      <GeminiGuide />
    </div>
  );
};

export default App;
