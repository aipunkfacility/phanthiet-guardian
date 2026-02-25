
import React, { useState, useRef, useEffect } from 'react';
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
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from './ui/sheet';
import { Toaster } from './ui/sonner';
import { toast } from 'sonner';
import { Input } from './ui/input';

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

  useEffect(() => {
    const saved = localStorage.getItem('custom_temples_data');
    if (saved) {
      try {
        setTemples(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved temples", e);
      }
    }
  }, []);

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
            <div key={t.id} className={`flex gap-4 relative transition-all duration-300 ${isClosed ? 'opacity-30' : 'opacity-100'}`}>
              {idx !== temples.length - 1 && <div className="absolute left-[11px] top-6 bottom-[-24px] w-px bg-stone-200"></div>}
              
              <div className={`w-6 h-6 rounded-full shrink-0 z-10 border-4 border-white shadow-sm flex items-center justify-center transition-all ${
                isLunch ? 'bg-amber-400' : 
                isClosed ? 'bg-stone-800' : 
                isGolden ? 'bg-indigo-600 scale-110 shadow-indigo-200 shadow-lg' : 'bg-orange-600'
              }`}>
                {isClosed ? <span className="text-[8px] text-white">🔒</span> : null}
              </div>

              <div className="flex-1 min-w-0 pb-2">
                <div className="flex justify-between items-baseline gap-2">
                  <span className={`text-[10px] font-black tabular-nums ${isGolden ? 'text-indigo-600' : 'text-stone-400'}`}>
                    {arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isLunch && <span className="text-[8px] font-bold text-amber-600 uppercase">Обед</span>}
                  {isGolden && <span className="text-[7px] font-black text-indigo-500 uppercase tracking-tighter animate-pulse">Магия ✨</span>}
                </div>
                <h5 className="text-[11px] font-bold text-stone-800 truncate leading-tight mt-0.5">{t.name}</h5>
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
    if (adminPassword === 'admin123') {
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
      localStorage.setItem('custom_temples_data', JSON.stringify(imported));
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

      <Sheet open={chatSheetOpen} onOpenChange={setChatSheetOpen}>
        <SheetTrigger asChild>
          <Button className="fixed bottom-6 right-6 z-[90] rounded-full w-14 h-14 shadow-2xl">
            💬
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:w-[540px] p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>AI Гид</SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100%-60px)]">
            <GeminiGuide />
          </div>
        </SheetContent>
      </Sheet>

      <Toaster />
      {isAdmin && (
        <div className="fixed top-24 left-6 z-[110] bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full shadow-2xl animate-bounce">
          Admin Mode Active
        </div>
      )}

      <nav className="fixed top-0 inset-x-0 z-[100] bg-white/90 backdrop-blur-xl border-b border-stone-100 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-sm font-black italic tracking-tighter text-stone-900 flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
            Guardian of PHAN THIET
          </div>
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
          src="https://images.unsplash.com/photo-1590547411364-5f43f07a6a42?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 animate-[slow-zoom_20s_infinite_alternate]" 
          alt="Phan Thiet" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCFB] via-stone-900/20 to-stone-900/40"></div>
        
        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
          <p className="text-orange-400 font-bold uppercase tracking-[0.4em] text-[10px] md:text-[11px] mb-4 drop-shadow-lg">{context.label}</p>
          <h1 className="text-4xl md:text-8xl font-black tracking-tighter mb-4 md:mb-6 leading-[1] text-white drop-shadow-2xl">
            {APP_CONFIG.TITLE}
          </h1>
          <p className="text-sm md:text-2xl italic font-serif text-white/95 mb-8 md:mb-10 max-w-xl mx-auto leading-relaxed drop-shadow-md px-4">
            "{context.desc}"
          </p>
          <Button 
            onClick={scrollToItinerary}
            size="lg"
            className="gap-3"
          >
            Построить маршрут
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 -mt-12 md:-mt-16 relative z-20 pb-32">
        <div className="lg:col-span-3">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-stone-100 sticky top-28">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-stone-400 mb-8 border-b border-stone-50 pb-4">Таймлайн</h3>
            {renderSchedule()}
            
            <button 
              onClick={buildGoogleMapsRoute}
              className="w-full mt-10 bg-stone-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-xl active:scale-95"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              Маршрут в Google Maps
            </button>

            <div className="mt-6 pt-6 border-t border-stone-100">
               <div className="flex items-center gap-3 text-indigo-600">
                 <span className="text-2xl font-black">17:15</span>
                 <span className="text-[8px] uppercase font-bold tracking-widest leading-none">Закат в Муйне</span>
               </div>
            </div>
          </div>
        </div>

        <div ref={itineraryRef} className="lg:col-span-9 space-y-12">
          <div className="grid md:grid-cols-2 gap-8">
            {temples.map((t, i) => (
              <Card 
                key={t.id}
                className="overflow-hidden border-stone-50 shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer flex flex-col hover:-translate-y-2"
                onClick={() => setSelectedTemple(t)}
              >
                <div className="h-56 md:h-80 relative overflow-hidden">
                  <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
                  <div className="absolute top-4 left-4 md:top-6 md:left-6 px-3 py-1.5 md:px-4 md:py-2 bg-white/90 backdrop-blur-md rounded-full font-black text-stone-900 text-[9px] md:text-[10px] shadow-lg">
                    Остановка {i + 1}
                  </div>
                  {t.isNightActive && (
                    <div className="absolute top-4 right-4 md:top-6 md:right-6 px-3 py-1.5 md:px-4 md:py-2 bg-indigo-600 text-white rounded-full font-black text-[8px] md:text-[9px] uppercase tracking-widest shadow-xl animate-pulse">
                      Магия ✨
                    </div>
                  )}
                </div>
                <CardContent className="p-7 md:p-10 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-4 md:mb-6">
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] text-orange-600">{t.culture}</span>
                    <span className="text-[9px] md:text-[10px] font-bold text-stone-300 tabular-nums">{t.duration}</span>
                  </div>
                  <CardTitle className="text-xl md:text-3xl font-bold mb-3 md:mb-4 text-stone-900 leading-tight group-hover:text-orange-800 transition-colors">{t.name}</CardTitle>
                  <CardDescription className="text-stone-500 text-xs md:text-base italic leading-relaxed line-clamp-2 mb-8 md:mb-10 font-serif">{t.description}</CardDescription>
                  <div className="mt-auto pt-5 md:pt-6 border-t border-stone-50 flex justify-between items-center text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 group-hover:text-orange-600 transition-colors">
                    <span>Подробнее</span>
                    <svg className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <section className="bg-stone-900 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-24 text-white relative overflow-hidden shadow-3xl">
            <div className="absolute right-0 top-0 w-full md:w-1/2 h-full opacity-20 md:opacity-30 pointer-events-none">
              <img src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Culture" />
            </div>
            <div className="relative z-10 max-w-xl">
              <h2 className="text-3xl md:text-6xl font-black mb-6 md:mb-8 tracking-tighter leading-none">Нужен живой рассказ?</h2>
              <p className="text-stone-400 text-base md:text-xl mb-10 md:mb-12 font-serif italic leading-relaxed">
                Алгоритмы безупречны, но только профессиональный гид знает историю каждого камня. Посмотрите проверенную экскурсию.
              </p>
              <a 
                href={APP_CONFIG.TRIPSTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-orange-600 px-8 py-4 md:px-12 md:py-6 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-orange-700 transition-all shadow-2xl"
              >
                На Tripster
              </a>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-white border-t border-stone-100 py-16 md:py-24 px-10 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl md:text-2xl font-black mb-6 italic tracking-tighter uppercase tracking-widest">The Guardian</h2>
          <p className="text-stone-400 leading-relaxed text-xs md:text-sm mb-10 px-6">
            Интерактивный путеводитель по культурным кодам города. Создано, чтобы вы не теряли время на закрытые двери и сиесту.
          </p>
          <button 
            onClick={() => {
              setIsAdmin(!isAdmin);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-colors ${isAdmin ? 'text-red-600' : 'text-stone-200 hover:text-stone-900'}`}
          >
            {isAdmin ? 'Выйти из режима гида' : 'Вход для гида (Admin)'}
          </button>
        </div>
      </footer>

      {selectedTemple && (
        <TempleCard 
          temple={selectedTemple} 
          onClose={() => setSelectedTemple(null)}
          onSave={isAdmin ? (updated) => {
            const newTemples = temples.map(t => t.id === updated.id ? updated : t);
            setTemples(newTemples);
            localStorage.setItem('custom_temples_data', JSON.stringify(newTemples));
            setSelectedTemple(updated);
          } : undefined}
        />
      )}
      <GeminiGuide />
      
      <style>{`
        @keyframes slow-zoom {
          from { transform: scale(1.05); }
          to { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}

export default App;
