import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Share2, 
  MessageSquare, 
  MapPin, 
  Copy,
  Sparkles
} from 'lucide-react';
import { generateIAmSafeMessage, createSmsUri, createWhatsAppUri } from '../utils/smsHelper';

export function IAmSafeBroadcast({ location, userProfile, lang, t }) {
  const [customNote, setCustomNote] = useState('I am safe and have reached a secure elevated flood shelter.');
  const [copied, setCopied] = useState(false);
  const [broadcasted, setBroadcasted] = useState(false);

  const safeMessage = generateIAmSafeMessage({
    userName: userProfile.name || 'Citizen',
    location: location,
    customNote: customNote
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(safeMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '✅ I Am Safe - Aapda Saarthi Flood Status',
          text: safeMessage
        });
        setBroadcasted(true);
      } catch (e) {}
    } else {
      handleCopy();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {t.iAmSafe}
            </h3>
            <p className="text-xs text-slate-400">
              {t.iAmSafeDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Message Preview and Quick Status Buttons */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            'Reached elevated relief camp safely.',
            'Water receding in our area, family is fine.',
            'Evacuated with NDRF boat team.',
            'At neighbor\'s 2nd floor, have food & water.'
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setCustomNote(preset)}
              className={`px-3 py-1.5 rounded-lg border text-left transition-all ${
                customNote === preset
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ✓ {preset}
            </button>
          ))}
        </div>

        {/* Formatted Message Box */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300/90 whitespace-pre-line leading-relaxed">
          {safeMessage}
        </div>

        {/* Broadcast Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* SMS to family contacts */}
          <a
            href={createSmsUri(userProfile.emergencyContact1 || '', safeMessage)}
            onClick={() => setBroadcasted(true)}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-950 transition-colors text-center"
          >
            <Send className="w-4 h-4" />
            <span>Send SMS to Family</span>
          </a>

          {/* WhatsApp Direct */}
          <a
            href={createWhatsAppUri(safeMessage)}
            target="_blank"
            rel="noreferrer"
            onClick={() => setBroadcasted(true)}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-950 transition-colors text-center"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Status</span>
          </a>

          {/* Native Share & Copy */}
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={handleCopy}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl"
              title="Copy Message"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {broadcasted && (
          <div className="p-2.5 bg-emerald-950/60 border border-emerald-700/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Safety status broadcast initiated! Your contacts have received your coordinates.</span>
          </div>
        )}
      </div>
    </div>
  );
}
