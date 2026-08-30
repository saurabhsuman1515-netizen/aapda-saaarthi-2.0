import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertOctagon, 
  MapPin, 
  Send, 
  Share2, 
  QrCode, 
  CheckCircle2, 
  Users, 
  HeartHandshake, 
  RefreshCw, 
  PhoneCall, 
  Copy, 
  ShieldCheck,
  Radio
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { generateSOSMessage, createSmsUri, createWhatsAppUri } from '../utils/smsHelper';

export function SOSBeacon({ 
  t, 
  lang, 
  location, 
  isLocating, 
  fetchLocation, 
  userProfile, 
  isOnline 
}) {
  const [isHolding, setIsHolding] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Distress specifics
  const [situation, setSituation] = useState(t.trappedRoof);
  const [peopleCount, setPeopleCount] = useState(1);
  const [specialNeeds, setSpecialNeeds] = useState(userProfile.medicalNeeds || "None");
  const [batteryLevel, setBatteryLevel] = useState(null);

  const holdTimerRef = useRef(null);

  // Monitor battery level if API is supported
  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      }).catch(() => {});
    }
  }, []);

  // Update situation translation when language changes
  useEffect(() => {
    setSituation(t.trappedRoof);
  }, [lang, t]);

  const handleStartHold = () => {
    setIsHolding(true);
    setCountdown(3);
    if ('vibrate' in navigator) navigator.vibrate(100);

    let current = 3;
    holdTimerRef.current = setInterval(() => {
      current -= 1;
      setCountdown(current);
      if ('vibrate' in navigator) navigator.vibrate(100);

      if (current <= 0) {
        clearInterval(holdTimerRef.current);
        triggerSOS();
      }
    }, 900);
  };

  const handleCancelHold = () => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsHolding(false);
    setCountdown(3);
  };

  const triggerSOS = () => {
    setIsHolding(false);
    setSosTriggered(true);
    if ('vibrate' in navigator) navigator.vibrate([300, 100, 300, 100, 500]);
  };

  const fullSosMessage = generateSOSMessage({
    userName: userProfile.name || "Flood Distress Victim",
    phone: userProfile.phone || "",
    location: location,
    situation: situation,
    peopleCount: peopleCount,
    bloodGroup: userProfile.bloodGroup || "Not Specified",
    specialNeeds: specialNeeds,
    batteryLevel: batteryLevel
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(fullSosMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 3000);
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '🚨 EMERGENCY FLOOD RESCUE - AAPDA SAARTHI',
          text: fullSosMessage
        });
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Background emergency accent */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row items-center gap-6 justify-between">
        {/* Left Side: The Master SOS Button */}
        <div className="flex flex-col items-center text-center w-full lg:w-5/12">
          <div className="relative flex items-center justify-center p-4">
            {/* Pulsing ring animation */}
            <div className="absolute inset-0 rounded-full border-4 border-red-600/30 animate-ping pointer-events-none"></div>
            
            <button
              onMouseDown={handleStartHold}
              onMouseUp={handleCancelHold}
              onTouchStart={handleStartHold}
              onTouchEnd={handleCancelHold}
              onClick={triggerSOS}
              className={`relative z-10 w-44 h-44 sm:w-52 sm:h-52 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all select-none cursor-pointer ${
                isHolding 
                  ? 'bg-red-700 scale-95 ring-8 ring-red-400' 
                  : 'bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 hover:scale-105 animate-sos-pulse'
              }`}
            >
              <AlertOctagon className="w-14 h-14 sm:w-16 sm:h-16 mb-1 drop-shadow" />
              <span className="text-xl sm:text-2xl font-black tracking-wider">
                {isHolding ? `${countdown}...` : t.emergencySOS}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-red-100 mt-1 opacity-90">
                {isHolding ? 'HOLDING...' : t.holdSOS}
              </span>
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-2 font-medium max-w-xs">
            {lang === 'hi' 
              ? 'बटन दबाते ही आपकी सटीक GPS लोकेशन और स्थिति के साथ ऑफलाइन SMS तैयार हो जाएगा।' 
              : 'Press or hold button to instantly prepare and dispatch offline SMS rescue beacons.'}
          </p>

          {/* GPS Location pill */}
          <div className="mt-3 w-full max-w-sm bg-slate-800/80 border border-slate-700 rounded-xl p-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-4 h-4 text-red-400 shrink-0" />
              <div className="text-left truncate">
                <div className="text-slate-400 text-[10px]">{t.yourLocation}</div>
                <div className="font-mono font-bold text-slate-200 truncate">
                  {isLocating ? (
                    <span className="text-amber-400 animate-pulse">{t.locating}</span>
                  ) : location ? (
                    `${location.lat.toFixed(4)}°, ${location.lng.toFixed(4)}° (±${Math.round(location.accuracy)}m)`
                  ) : (
                    'Location not acquired'
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={fetchLocation}
              disabled={isLocating}
              className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors shrink-0"
              title="Refresh GPS"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right Side: Emergency Situation Customizer & Instant Fallback Controls */}
        <div className="w-full lg:w-7/12 flex flex-col gap-4">
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                <span>{t.situationType}</span>
              </h3>
              <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-medium">
                {isOnline ? 'Network: Online' : 'Network: OFFLINE (SMS)'}
              </span>
            </div>

            {/* Quick situation selector chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {[
                t.trappedRoof,
                t.waterRising,
                t.boatNeeded,
                t.medicalEmergency,
                t.strandedElderly,
                t.foodWaterNeeded
              ].map((sit, idx) => (
                <button
                  key={idx}
                  onClick={() => setSituation(sit)}
                  className={`px-3 py-2 text-xs rounded-lg text-left font-medium border transition-all ${
                    situation === sit
                      ? 'bg-red-600/20 border-red-500 text-red-200 font-bold shadow-sm'
                      : 'bg-slate-900/50 border-slate-700/60 text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  • {sit}
                </button>
              ))}
            </div>

            {/* Victims count and medical requirement */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-700/60 text-xs">
              <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-700">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  {t.peopleCount}:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                    className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="font-bold text-white text-sm w-5 text-center">{peopleCount}</span>
                  <button
                    onClick={() => setPeopleCount(peopleCount + 1)}
                    className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-700">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
                  {t.bloodGroup}:
                </span>
                <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                  {userProfile.bloodGroup || "O+ (Auto)"}
                </span>
              </div>
            </div>
          </div>

          {/* SMS FALLBACK DIRECT ACTION BUTTONS */}
          <div>
            <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Send className="w-3.5 h-3.5" />
                {t.smsFallbackTitle}
              </span>
              <button
                onClick={() => setShowQR(!showQR)}
                className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
              >
                <QrCode className="w-3 h-3" />
                <span>{showQR ? 'Hide Distress QR' : 'Offline QR Code'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* SMS to 112 */}
              <a
                href={createSmsUri("112", fullSosMessage)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-lg shadow-red-950/60 transition-all text-center"
              >
                <Send className="w-4 h-4" />
                <span>{t.sendSMS112}</span>
              </a>

              {/* SMS to NDRF 1078 */}
              <a
                href={createSmsUri("1078", fullSosMessage)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-black shadow-lg shadow-orange-950/60 transition-all text-center"
              >
                <Send className="w-4 h-4" />
                <span>{t.sendSMS1078}</span>
              </a>

              {/* SMS to Emergency Contacts */}
              <a
                href={createSmsUri(userProfile.emergencyContact1 || "112", fullSosMessage)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors text-center"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>{t.sendSMSFamily}</span>
              </a>

              {/* WhatsApp / Web Share */}
              <div className="flex gap-1.5">
                <a
                  href={createWhatsAppUri(fullSosMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors text-center"
                >
                  <span>WhatsApp SOS</span>
                </a>
                <button
                  onClick={handleWebShare}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center"
                  title="Share SOS"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopy}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center"
                  title="Copy Distress Text"
                >
                  {copiedMessage ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Distress Preview & QR Code Drawer */}
          {showQR && (
            <div className="mt-2 p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center gap-4">
              <div className="p-2 bg-white rounded-lg shadow">
                <QRCodeSVG value={fullSosMessage} size={110} />
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <div className="font-bold text-white flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Offline Rescue QR Beacon</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Rescue boats, military personnel, and volunteers can scan this QR code with any smartphone camera to extract your exact GPS coordinates and medical details without internet.
                </p>
                <div className="font-mono text-[10px] text-slate-400 bg-slate-900 p-1.5 rounded border border-slate-800 break-all max-h-16 overflow-y-auto">
                  {fullSosMessage}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
