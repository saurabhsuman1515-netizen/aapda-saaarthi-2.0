import React, { useState } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Camera, 
  Waves, 
  Radio,
  Clock
} from 'lucide-react';
import { createSmsUri } from '../utils/smsHelper';

export function HazardReporter({ location, userProfile, lang, t }) {
  const [hazardType, setHazardType] = useState('Embankment / Dam Breach');
  const [waterDepth, setWaterDepth] = useState('Waist-Deep (3 to 4 feet)');
  const [description, setDescription] = useState('');
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('aapda_hazard_reports');
    return saved ? JSON.parse(saved) : [
      {
        id: 'rep-1',
        type: 'Bridge Submerged & Road Cut Off',
        waterDepth: 'Chest-Deep (> 5 feet)',
        description: 'Vehicular movement completely halted near Bailey Road underpass.',
        location: 'Patna Sector 4',
        time: '15 mins ago',
        status: 'Dispatched to NDRF'
      },
      {
        id: 'rep-2',
        type: 'Stranded Cattle & Livestock',
        waterDepth: 'Knee-Deep (1 to 2 feet)',
        description: 'Over 20 cattle trapped on elevated mound requiring fodder and dry shelter.',
        location: 'Riverbank Village Belt',
        time: '1 hour ago',
        status: 'Community Volunteer Alerted'
      }
    ];
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReport = {
      id: `rep-${Date.now()}`,
      type: hazardType,
      waterDepth: waterDepth,
      description: description || 'Severe flood hazard reported by citizen.',
      location: location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Current Area',
      time: 'Just now',
      status: 'Logged & Broadcasted'
    };

    const updated = [newReport, ...reports];
    setReports(updated);
    localStorage.setItem('aapda_hazard_reports', JSON.stringify(updated));
    setDescription('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const smsText = `🚨 [FLOOD HAZARD REPORT] Type: ${hazardType} | Water Depth: ${waterDepth} | Location: ${location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Area'} | Note: ${description || 'Hazard reported'}`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <span>{t.reportHazardTab}</span>
        </h2>
        <p className="text-xs text-slate-400">
          {lang === 'hi'
            ? 'टूटे हुए तटबंध, डूबे रास्ते या फंसे लोगों की सूचना तुरंत NDRF और स्थानीय राहत दलों को दें।'
            : 'Crowdsource flood damage, rising water levels, washed-away bridges, and trapped citizens.'}
        </p>
      </div>

      {/* Report Form */}
      <form onSubmit={handleSubmit} className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-300">Hazard Category</label>
            <select
              value={hazardType}
              onChange={(e) => setHazardType(e.target.value)}
              className="w-full mt-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
            >
              <option value="Embankment / Dam Breach">Embankment / Dam Breach</option>
              <option value="Bridge Submerged / Road Blocked">Bridge Submerged / Road Blocked</option>
              <option value="Electric Pole / Wire Fallen in Water">Electric Pole / Wire Fallen in Water</option>
              <option value="Trapped Group on Weak Structure">Trapped Group on Weak Structure</option>
              <option value="Contaminated Drinking Water Source">Contaminated Drinking Water Source</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Estimated Water Depth</label>
            <select
              value={waterDepth}
              onChange={(e) => setWaterDepth(e.target.value)}
              className="w-full mt-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
            >
              <option value="Ankle-Deep (< 1 foot)">Ankle-Deep (&lt; 1 foot)</option>
              <option value="Knee-Deep (1 to 2 feet)">Knee-Deep (1 to 2 feet)</option>
              <option value="Waist-Deep (3 to 4 feet)">Waist-Deep (3 to 4 feet)</option>
              <option value="Chest-Deep / Submerging 1st Floor (> 5 feet)">Chest-Deep / Submerging 1st Floor (&gt; 5 feet)</option>
              <option value="Roof-Level Inundation">Roof-Level Inundation</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300">Hazard Details / Landmark</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe specific landmarks, number of trapped people or urgent requirements..."
            className="w-full mt-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-red-400" />
            <span>
              GPS: {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Acquiring GPS...'}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={createSmsUri("1078", smsText)}
              className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold flex items-center justify-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>SMS to NDRF</span>
            </a>
            <button
              type="submit"
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-amber-950"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Broadcast Hazard</span>
            </button>
          </div>
        </div>

        {submitted && (
          <div className="p-2.5 bg-emerald-950/60 border border-emerald-700 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Hazard logged successfully and tagged with your GPS location!</span>
          </div>
        )}
      </form>

      {/* Community Hazard Feed */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Radio className="w-4 h-4 text-red-400 animate-pulse" />
          <span>Live Citizen Reports & Hazards</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5 text-xs flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-amber-300">{rep.type}</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {rep.time}
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">{rep.description}</p>
                <div className="text-[11px] text-sky-400 mt-1">Water Depth: {rep.waterDepth}</div>
              </div>

              <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-400" />
                  {rep.location}
                </span>
                <span className="bg-slate-900 border border-slate-700 text-emerald-400 px-2 py-0.5 rounded font-medium">
                  {rep.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
