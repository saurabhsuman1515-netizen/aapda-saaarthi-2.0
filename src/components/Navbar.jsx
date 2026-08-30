import React, { useState, useEffect } from 'react';
import { 
  LifeBuoy, 
  Wifi, 
  WifiOff, 
  Volume2, 
  VolumeX, 
  Download, 
  User, 
  Globe, 
  AlertTriangle 
} from 'lucide-react';
import { toggleEmergencySiren } from '../utils/soundHelper';

export function Navbar({ 
  lang, 
  setLang, 
  t, 
  isOnline, 
  onOpenAuth, 
  userProfile, 
  onTriggerSOS 
}) {
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert(lang === 'hi' 
        ? "ऐप को होम स्क्रीन पर जोड़ने के लिए अपने ब्राउज़र मेनू (⋮) में 'Install App' या 'Add to Home Screen' चुनें।" 
        : "To install, tap your browser's menu (⋮) and select 'Install App' or 'Add to Home Screen'.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const handleSiren = () => {
    toggleEmergencySiren((playing) => setIsSirenActive(playing));
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-lg">
      {/* High-Alert Header Stripe */}
      <div className="bg-red-600 px-3 py-1 text-xs text-white flex items-center justify-between font-semibold tracking-wide">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          <span>{lang === 'hi' ? 'बाढ़ आपदा प्रबंधन एवं त्वरित बचाव पोर्टल' : 'NATIONAL FLOOD RESCUE & RELIEF PORTAL'}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">24x7 NDRF: <a href="tel:1078" className="underline font-bold">1078</a></span>
          <span>Emergency: <a href="tel:112" className="underline font-bold">112</a></span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-600 flex items-center justify-center shadow-md shadow-red-950/50 border border-red-500">
            <LifeBuoy className="w-6 h-6 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1">
                AAPDA <span className="text-red-500">SAARTHI</span>
              </h1>
              <span className="text-xs bg-red-950 text-red-300 border border-red-800 px-1.5 py-0.5 rounded font-bold">
                {lang === 'hi' ? 'आपदा सारथी' : 'PWA'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium truncate max-w-[180px] sm:max-w-none">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Online/Offline Status Indicator */}
          <div 
            title={isOnline ? t.onlineStatus : t.offlineStatus}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold border ${
              isOnline 
                ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-400' 
                : 'bg-amber-950/80 border-amber-600 text-amber-300 animate-pulse'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">
              {isOnline ? 'Online' : 'Offline Mode (SMS)'}
            </span>
          </div>

          {/* Emergency Siren Button */}
          <button
            onClick={handleSiren}
            title={isSirenActive ? t.sirenOn : t.sirenToggle}
            className={`p-2 rounded-lg font-semibold text-xs flex items-center gap-1 transition-all ${
              isSirenActive 
                ? 'bg-red-600 text-white animate-bounce shadow-lg shadow-red-600/50' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            {isSirenActive ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden lg:inline">{isSirenActive ? 'Siren Active' : 'Siren'}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Install PWA Button */}
          <button
            onClick={handleInstallClick}
            className="px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-sky-950 transition-colors"
            title={t.installApp}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.installApp}</span>
          </button>

          {/* User Profile / Login */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 font-medium transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-red-600/30 text-red-400 flex items-center justify-center text-[10px] font-bold">
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
            </div>
            <span className="hidden sm:inline max-w-[80px] truncate">
              {userProfile.name ? userProfile.name.split(' ')[0] : (lang === 'hi' ? 'लॉगिन' : 'Login')}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
