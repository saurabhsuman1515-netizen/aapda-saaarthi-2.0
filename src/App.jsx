import React, { useState, useEffect, useCallback } from 'react';
import { 
  AlertOctagon, 
  Map as MapIcon, 
  Building2, 
  PhoneCall, 
  BookOpen, 
  ShieldCheck, 
  AlertTriangle, 
  LifeBuoy, 
  Waves,
  Send,
  Navigation
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { OfflineAlertBanner } from './components/OfflineAlertBanner';
import { SOSBeacon } from './components/SOSBeacon';
import { FloodMap } from './components/FloodMap';
import { ShelterFinder } from './components/ShelterFinder';
import { HelplineDirectory } from './components/HelplineDirectory';
import { SurvivalGuide } from './components/SurvivalGuide';
import { IAmSafeBroadcast } from './components/IAmSafeBroadcast';
import { HazardReporter } from './components/HazardReporter';
import { AuthModal } from './components/AuthModal';
import { translations } from './data/translations';

export default function App() {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('sos'); // 'sos' | 'map' | 'shelters' | 'helplines' | 'guide' | 'safe' | 'hazard'
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // User Profile
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('aapda_user_profile');
    return saved ? JSON.parse(saved) : {
      name: '',
      email: '',
      phone: '',
      bloodGroup: 'O+',
      medicalNeeds: 'None',
      familyCount: 1,
      emergencyContact1: '',
      emergencyContact2: '',
      isLoggedIn: false,
      authProvider: null
    };
  });

  // Geolocation State
  const [location, setLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const t = translations[lang] || translations.en;

  // Track Network Online/Offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch High-Precision GPS Coordinates
  const fetchLocation = useCallback(() => {
    if (!navigator.geolocation) {
      // Fallback coordinate if device does not support GPS
      setLocation({ lat: 25.5941, lng: 85.1376, accuracy: 25 });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy || 15
        });
        setIsLocating(false);
      },
      (err) => {
        console.warn("GPS lookup fallback:", err.message);
        // Default to Patna Flood Zone simulation center if user denies or fails GPS in testing
        setLocation({ lat: 25.5941, lng: 85.1376, accuracy: 50 });
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  const handleUpdateProfile = (newProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem('aapda_user_profile', JSON.stringify(newProfile));
  };

  const navTabs = [
    { id: 'sos', label: t.emergencySOS, icon: AlertOctagon, color: 'text-red-500', alert: true },
    { id: 'map', label: t.floodMapTab, icon: MapIcon, color: 'text-sky-400' },
    { id: 'shelters', label: t.sheltersTab, icon: Building2, color: 'text-emerald-400' },
    { id: 'helplines', label: t.helplinesTab, icon: PhoneCall, color: 'text-amber-400' },
    { id: 'guide', label: t.survivalGuideTab, icon: BookOpen, color: 'text-cyan-400' },
    { id: 'safe', label: t.iAmSafe, icon: ShieldCheck, color: 'text-emerald-500' },
    { id: 'hazard', label: t.reportHazardTab, icon: AlertTriangle, color: 'text-rose-400' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-red-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        t={t}
        isOnline={isOnline}
        onOpenAuth={() => setIsAuthOpen(true)}
        userProfile={userProfile}
        onTriggerSOS={() => setActiveTab('sos')}
      />

      {/* Offline Alert Banner if Internet Drops */}
      {!isOnline && (
        <OfflineAlertBanner
          t={t}
          onTriggerSMSFallback={() => setActiveTab('sos')}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-lg border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                } ${tab.alert && !isActive ? 'bg-red-950/40 text-red-300 border border-red-900/60' : ''}`}
              >
                <Icon className={`w-4 h-4 ${tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Views */}
        {activeTab === 'sos' && (
          <div className="space-y-6">
            <SOSBeacon
              t={t}
              lang={lang}
              location={location}
              isLocating={isLocating}
              fetchLocation={fetchLocation}
              userProfile={userProfile}
              isOnline={isOnline}
            />

            {/* Quick Helper Grid below SOS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Nearest Safe Camp */}
              <div 
                onClick={() => setActiveTab('shelters')}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-4 rounded-xl cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Find Nearest Shelter</h4>
                    <p className="text-[11px] text-slate-400">High ground camps & food</p>
                  </div>
                </div>
                <Navigation className="w-4 h-4 text-emerald-400" />
              </div>

              {/* Card 2: National Helplines */}
              <div 
                onClick={() => setActiveTab('helplines')}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-4 rounded-xl cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-red-950 text-red-400 border border-red-800">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Emergency Helplines</h4>
                    <p className="text-[11px] text-slate-400">112, NDRF 1078, SDRF 1070</p>
                  </div>
                </div>
                <PhoneCall className="w-4 h-4 text-red-400" />
              </div>

              {/* Card 3: I Am Safe */}
              <div 
                onClick={() => setActiveTab('safe')}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-4 rounded-xl cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-950 text-sky-400 border border-sky-800">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Broadcast "I Am Safe"</h4>
                    <p className="text-[11px] text-slate-400">Notify loved ones via SMS</p>
                  </div>
                </div>
                <Send className="w-4 h-4 text-sky-400" />
              </div>
            </div>

            {/* In-tab Live Map Preview */}
            <FloodMap
              location={location}
              lang={lang}
              t={t}
              onSelectShelter={() => setActiveTab('shelters')}
            />
          </div>
        )}

        {activeTab === 'map' && (
          <FloodMap
            location={location}
            lang={lang}
            t={t}
            onSelectShelter={() => setActiveTab('shelters')}
          />
        )}

        {activeTab === 'shelters' && (
          <ShelterFinder
            location={location}
            lang={lang}
            t={t}
          />
        )}

        {activeTab === 'helplines' && (
          <HelplineDirectory
            lang={lang}
            t={t}
          />
        )}

        {activeTab === 'guide' && (
          <SurvivalGuide
            lang={lang}
            t={t}
          />
        )}

        {activeTab === 'safe' && (
          <IAmSafeBroadcast
            location={location}
            userProfile={userProfile}
            lang={lang}
            t={t}
          />
        )}

        {activeTab === 'hazard' && (
          <HazardReporter
            location={location}
            userProfile={userProfile}
            lang={lang}
            t={t}
          />
        )}
      </main>

      {/* Profile & Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
        lang={lang}
        t={t}
      />

      {/* Bottom Emergency Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
            <LifeBuoy className="w-4 h-4 text-red-500" />
            <span>AAPDA SAARTHI (आपदा सारथी)</span>
            <span>— Flood Disaster Management & Life-Saving PWA</span>
          </div>
          <div>
            Built with Offline PWA & SMS Fallback Support • Emergency Toll-Free 112 / 1078
          </div>
        </div>
      </footer>
    </div>
  );
}
