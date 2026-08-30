import React from 'react';
import { WifiOff, Send, PhoneCall, ShieldAlert } from 'lucide-react';

export function OfflineAlertBanner({ t, onTriggerSMSFallback }) {
  return (
    <div className="bg-gradient-to-r from-amber-900/90 via-red-950/90 to-amber-900/90 border-b border-amber-600/50 text-amber-200 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-amber-600/20 text-amber-400">
            <WifiOff className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-white uppercase tracking-wider mr-1">
              {t.offlineStatus}:
            </span>
            <span>{t.offlineNotice}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onTriggerSMSFallback}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-md shadow-md transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Open SMS Dispatch</span>
          </button>
          <a
            href="tel:112"
            className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded-md transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 112</span>
          </a>
        </div>
      </div>
    </div>
  );
}
