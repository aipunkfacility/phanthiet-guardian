
import React, { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { TEMPLES as INITIAL_TEMPLES, APP_CONFIG } from './constants';
import { Temple } from './types';
import TempleCard from './components/TempleCard';
import GeminiGuide from './components/GeminiGuide';
import { exportTemples, importTemples } from './utils/importExport';
import { Button } from './ui/button';
import { Card, CardContent, CardTitle, CardDescription } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Toaster } from './ui/sonner';
import { toast } from 'sonner';
import { Input } from './ui/input';
import { ArrowRight, X } from 'lucide-react';

const App: React.FC = () => {
  const [temples, setTemples] = useState<Temple[]>(INITIAL_TEMPLES);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [chatSheetOpen, setChatSheetOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const itineraryRef = useRef<HTMLDivElement>(null);

  const TRAVEL_GAP = 15;

  const getPlanContext = () => {
    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;

    if (currentHour >= 18) {
      return { mode: 'tomorrow', label: 'План на завтра', startH: 8, startM: 30, desc: 'Солнце село. Время планировать идеальное утро в Фантьете.' };
    }
    if (currentHour < 10) {
      return { mode: 'morning', label: 'Свежий старт', startH: 9, startM: 0, desc: 'Город просыпается. Идеальное время для первых храмов и прохлады.' };
    }
    return { mode: 'now', label: 'Маршрут "Сейчас"', startH: now.getHours(), startM: now.getMinutes(), desc: 'Едем! Мы рассчитали тайминг так, чтобы вы успели самое важное.' };
  };

  const context = getPlanContext();

  const buildGoogleMapsRoute = () => {
    if (temples.length === 0) return;
    const origin = encodeURIComponent(temples[0].location.address);
    const destination = encodeURIComponent(temples[temples.length - 1].location.address);
    const waypoints = temples
      .slice(1, -1)
      .map(t => encodeURIComponent(t.location.address))
      .join('|');
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const renderSchedule = () => {
    const currentTime = new Date();
    if (context.mode === 'tomorrow') currentTime.setDate(currentTime.getDate() + 1);
    currentTime.setHours(context.startH, context.startM, 0);

    return (
      <div className="space-y-6">
        {temples.map((t, idx) => {
          const arrival = new Date(currentTime);
          const dur = parseInt(t.duration) || 30;
          const arrivalDec = arrival.getHours() + arrival.getMinutes() / 60;

          const openH = t.openTime ? parseFloat(t.openTime.split(':')[0]) + parseFloat(t.openTime.split(':')[1])/60 : 7.5;
          const closeH = t.closeTime ? parseFloat(t.closeTime.split(':')[0]) + parseFloat(t.closeTime.split(':')[1])/60 : 17;
          
          const isLunch = t.hasLunchBreak && (arrivalDec >= 11.5 && arrivalDec < 13.5);
          const isClosed = (arrivalDec < openH || arrivalDec >= closeH) && !t.isNightActive;
          const isGolden = t.isNightActive && arrivalDec >= 16.75 && arrivalDec <= 18.5;

          currentTime.setMinutes(currentTime.getMinutes() + dur + TRAVEL_GAP);

          return (
            <div key={t.id} className={`flex gap-4 relative transition-all duration-300 ${isClosed ? 'opacity-40' : 'opacity-100'}`}>
              {idx !== temples.length - 1 && <div className="absolute left-[11px] top-6 bottom-[-24px] w-px bg-stone-200"></div>}
              
              <div className={`w-5 h-5 rounded-full shrink-0 z-10 border-3 border-white shadow-sm flex items-center justify-center transition-all ${
                isLunch ? 'bg-amber-500' : 
                isClosed ? 'bg-stone-400' : 
                isGolden ? 'bg-indigo-500 scale-110 shadow-indigo-500/30 shadow-lg' : 'bg-orange-600'
              }`}>
                {isClosed ? null : <span className="w-2 h-2 bg-white rounded-full"></span>}
              </div>

              <div className="flex-1 min-w-0 pb-3">
                <div className="flex justify-between items-baseline gap-2">
                  <span className={`text-xs font-semibold tabular-nums ${isGolden ? 'text-indigo-500' : 'text-stone-500'}`}>
                    {arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isLunch && <span className="text-[10px] font-medium text-amber-600 uppercase">Обед</span>}
                  {isGolden && <span className="text-[9px] font-semibold text-indigo-500 uppercase tracking-tight">Магия</span>}
                </div>
                <h5 className={`text-xs font-medium truncate leading-tight mt-0.5 ${isClosed ? 'text-stone-400' : 'text-stone-700'}`}>{t.name}</h5>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const scrollToItinerary = () => {
    itineraryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAdminLogin = () => {
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    if (adminPassword === correctPassword) {
      setIsAdmin(true);
      setAdminDialogOpen(false);
      setAdminPassword('');
      toast.success('Admin mode activated');
    } else {
      toast.error('Invalid password');
    }
  };

  const handleExport = () => {
    exportTemples(temples);
    toast.success('Data exported successfully');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const imported = await importTemples(file);
      setTemples(imported);
      toast.success('Data imported successfully');
    } catch (err) {
      toast.error('Failed to import data');
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] selection:bg-orange-100 overflow-x-hidden">
      <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Mode</DialogTitle>
            <DialogDescription>Enter password to enable editing</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input 
              type="password" 
              placeholder="Password" 
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdminDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAdminLogin}>Login</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={adminPanelOpen} onOpenChange={setAdminPanelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Panel</DialogTitle>
            <DialogDescription>Manage your temple data</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex flex-col gap-3">
              <Button onClick={handleExport} className="w-full">
                📥 Export Data
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                📤 Import Data
              </Button>
            </div>
            <p className="text-xs text-stone-400 text-center">
              Exported data includes all temple information and customizations
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdminPanelOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button 
        className="fixed bottom-6 right-6 z-[90] rounded-full w-14 h-14 shadow-2xl"
        onClick={() => setChatSheetOpen(true)}
      >
        💬
      </Button>

      {chatSheetOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setChatSheetOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full sm:w-[540px] z-50 bg-white flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-stone-900">AI Гид</h2>
              <button 
                onClick={() => setChatSheetOpen(false)} 
                className="p-1 hover:bg-stone-100 rounded cursor-pointer"
              >
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <GeminiGuide />
            </div>
          </div>
        </>
      )}

      <Toaster />
      {isAdmin && (
        <div className="fixed top-24 left-6 z-[110] bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full shadow-2xl animate-bounce">
          Admin Mode Active
        </div>
      )}

      <nav className="fixed top-0 inset-x-0 z-[100] bg-white/90 backdrop-blur-xl border-b border-stone-100 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-sm font-semibold tracking-tight text-stone-900 flex items-center gap-2 hover:text-orange-600 transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
            Храмы Фантьета
          </button>
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <>
                <Button variant="outline" size="sm" onClick={() => setAdminPanelOpen(true)}>
                  ⚙️ Admin
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsAdmin(false)}>
                  Выйти
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setAdminDialogOpen(true)}>
                Login
              </Button>
            )}
            <Button asChild>
              <a href={APP_CONFIG.TRIPSTER_URL} target="_blank" rel="noopener noreferrer">
                Экскурсия
              </a>
            </Button>
          </div>
        </div>
      </nav>

      <header className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col items-center justify-center bg-stone-900 overflow-hidden pt-16 px-6 text-center">
        <img 
          src="/hero.jpg" 
          className="absolute inset-0 w-full h-full object-cover opacity-40" 
          alt="Phan Thiet" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/50 to-stone-900/30"></div>
        
        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
          <span className="text-orange-500 font-semibold uppercase tracking-[0.3em] text-xs md:text-sm mb-6">Phan Thiết</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-white">
            {APP_CONFIG.TITLE}
          </h1>
          <p className="text-lg md:text-xl text-stone-300 mb-10 max-w-lg mx-auto leading-relaxed">
            {context.desc}
          </p>
          <Button 
            onClick={scrollToItinerary}
            size="lg"
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-semibold transition-colors cursor-pointer"
          >
            Начать маршрут
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-8 md:gap-12 -mt-8 md:-mt-12 relative z-20 pb-32">
        <div className="lg:col-span-3">
          <div className="glass-card-light p-6 md:p-8 sticky top-28">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500 mb-6 border-b border-stone-200 pb-4">Таймлайн</h3>
            {renderSchedule()}
            
            <button 
              onClick={buildGoogleMapsRoute}
              className="w-full mt-8 bg-stone-900 text-white py-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              Маршрут
            </button>

            <div className="mt-6 pt-6 border-t border-stone-200">
               <div className="flex items-center gap-3 text-indigo-600">
                 <span className="text-xl font-bold">17:15</span>
                 <span className="text-[10px] uppercase font-medium tracking-wider leading-none">Закат</span>
               </div>
            </div>
          </div>
        </div>

        <div ref={itineraryRef} className="lg:col-span-9 space-y-10">
          <div className="grid md:grid-cols-2 gap-8">
            {temples.map((t, i) => (
              <Card 
                key={t.id}
                className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1 h-full"
                onClick={() => setSelectedTemple(t)}
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
      </main>

      <footer className="bg-stone-50 border-t border-stone-200 py-12 px-6 text-center">
        <div className="max-w-lg mx-auto">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-lg font-semibold mb-4 text-stone-800 hover:text-orange-600 transition-colors cursor-pointer"
          >
            Храмы Фантьета
          </button>
          <p className="text-stone-500 text-sm mb-6">
            Интерактивный путеводитель по культурным местам города.
          </p>
          <button 
            onClick={() => {
              setIsAdmin(!isAdmin);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className={`text-xs font-medium uppercase tracking-wider transition-colors ${isAdmin ? 'text-red-600' : 'text-stone-300 hover:text-stone-600'}`}
          >
            {isAdmin ? 'Выйти из admin' : 'Admin'}
          </button>
        </div>
      </footer>

      {selectedTemple && (
        <TempleCard 
          temple={selectedTemple} 
          onClose={() => setSelectedTemple(null)}
          {...(isAdmin ? { onSave: (updated) => {
            const newTemples = temples.map(t => t.id === updated.id ? updated : t);
            setTemples(newTemples);
            setSelectedTemple(updated);
          }} : {})}
        />
      )}
      <GeminiGuide />
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}

export default App;
