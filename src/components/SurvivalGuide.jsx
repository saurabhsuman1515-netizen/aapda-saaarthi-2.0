import React, { useState } from 'react';
import { 
  BookOpen, 
  Volume2, 
  VolumeX, 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  Droplet, 
  Zap, 
  Home, 
  ShieldAlert, 
  Activity,
  CheckCircle2
} from 'lucide-react';
import { survivalGuides, evacuationKitChecklist } from '../data/survivalGuides';
import { speakText } from '../utils/soundHelper';

export function SurvivalGuide({ lang, t }) {
  const [activeGuide, setActiveGuide] = useState(survivalGuides[0].id);
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem('aapda_checklist');
    return saved ? JSON.parse(saved) : {};
  });

  const toggleCheck = (id) => {
    const updated = { ...checklist, [id]: !checklist[id] };
    setChecklist(updated);
    localStorage.setItem('aapda_checklist', JSON.stringify(updated));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / evacuationKitChecklist.length) * 100);

  const getGuideIcon = (name) => {
    switch (name) {
      case 'Home': return <Home className="w-4 h-4 text-amber-400" />;
      case 'Droplets': return <Droplet className="w-4 h-4 text-sky-400" />;
      case 'Zap': return <Zap className="w-4 h-4 text-yellow-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-rose-400" />;
    }
  };

  const handleReadAloud = (guide) => {
    const title = lang === 'hi' ? guide.hindiTitle : guide.title;
    const content = guide.steps.map((s, idx) => `Step ${idx + 1}: ${lang === 'hi' ? s.hi : s.en}`).join('. ');
    speakText(`${title}. ${content}`, lang);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-400" />
            <span>{t.survivalGuideTab}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {lang === 'hi'
              ? 'बिना इंटरनेट के 100% उपलब्ध: जल शोधन, बिजली सुरक्षा व प्राथमिक उपचार नियम।'
              : '100% Offline-accessible survival protocols, water purification instructions, and first-aid.'}
          </p>
        </div>
      </div>

      {/* Guide Tabs and Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Guide Selection List */}
        <div className="lg:col-span-4 space-y-2">
          {survivalGuides.map((guide) => (
            <button
              key={guide.id}
              onClick={() => setActiveGuide(guide.id)}
              className={`w-full text-left p-3 rounded-xl border text-xs font-semibold flex items-start gap-3 transition-all ${
                activeGuide === guide.id
                  ? 'bg-slate-800 border-sky-500 text-white shadow-md'
                  : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800/80'
              }`}
            >
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 shrink-0">
                {getGuideIcon(guide.icon)}
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-sky-400 uppercase tracking-wider font-bold">
                  {guide.category}
                </div>
                <div className="mt-0.5 font-bold line-clamp-2">
                  {lang === 'hi' ? guide.hindiTitle : guide.title}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Right Side: Selected Guide Content */}
        <div className="lg:col-span-8 bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          {(() => {
            const current = survivalGuides.find((g) => g.id === activeGuide) || survivalGuides[0];
            return (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2 border-b border-slate-700 pb-3">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                      {current.urgency} PROTOCOL
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white mt-1">
                      {lang === 'hi' ? current.hindiTitle : current.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleReadAloud(current)}
                    className="p-2 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/30 flex items-center gap-1.5 text-xs font-semibold shrink-0 transition-colors"
                    title="Read Aloud with Voice Assistant"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Audio Guide</span>
                  </button>
                </div>

                {/* Steps */}
                <div className="space-y-3">
                  {current.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-700/60 text-xs"
                    >
                      <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0 text-[11px] border border-sky-500/40">
                        {idx + 1}
                      </div>
                      <p className="text-slate-200 leading-relaxed font-medium">
                        {lang === 'hi' ? step.hi : step.en}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Interactive Emergency Evacuation Kit Checklist */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'hi' ? 'आपातकालीन निकासी किट चेकलिस्ट' : 'Emergency Flood Evacuation Kit Checklist'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'hi'
                ? 'बाढ़ के समय घर छोड़ने से पहले यह आवश्यक सामग्री वाटरप्रूफ बैग में जरूर रखें।'
                : 'Prepare these crucial items in a waterproof pouch before evacuating.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">
              {completedCount} / {evacuationKitChecklist.length} Ready
            </span>
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {evacuationKitChecklist.map((item) => {
            const isChecked = !!checklist[item.id];
            return (
              <button
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-2.5 rounded-lg border text-left flex items-start gap-2.5 text-xs transition-all ${
                  isChecked
                    ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                )}
                <span className={isChecked ? 'line-through text-slate-400 font-medium' : 'font-medium'}>
                  {lang === 'hi' ? item.hi : item.en}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
