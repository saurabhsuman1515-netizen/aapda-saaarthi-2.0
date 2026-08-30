import React, { useState } from 'react';
import { 
  PhoneCall, 
  Search, 
  Copy, 
  CheckCircle2, 
  ShieldAlert, 
  MapPin, 
  Filter, 
  Phone,
  Flame,
  Radio
} from 'lucide-react';
import { helplineData, helplineCategories, indianStates } from '../data/helplines';

export function HelplineDirectory({ lang, t }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id, number) => {
    navigator.clipboard.writeText(number);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredHelplines = helplineData.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hindiName.includes(searchTerm) ||
      item.number.includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === 'All' || item.state === selectedState || item.state === 'National';
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesState && matchesCategory;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-red-500" />
            <span>{t.helplinesTab}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {lang === 'hi'
              ? 'अखिल भारतीय एवं राज्यवार 24x7 आपदा बचाव हेल्पलाइन नंबर (1-टैप फास्ट डायल)।'
              : '24x7 National & State flood control, NDRF rescue, SDRF, and emergency ambulance hotlines.'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchHelpline}
            className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* State Filter */}
        <div className="relative">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full py-2 px-3 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
          >
            <option value="All">{t.allStates}</option>
            {indianStates.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-2 px-3 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
          >
            {helplineCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Priority Fast-Dial Bar */}
      <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/80 border border-red-800/60 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-red-500 animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Critical Hotlines:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <a
            href="tel:112"
            className="bg-red-600 hover:bg-red-500 text-white font-black px-3 py-1 rounded-lg flex items-center gap-1 shadow-md shadow-red-950"
          >
            <Phone className="w-3 h-3" />
            <span>112 (Emergency)</span>
          </a>
          <a
            href="tel:1078"
            className="bg-orange-600 hover:bg-orange-500 text-white font-black px-3 py-1 rounded-lg flex items-center gap-1 shadow-md shadow-orange-950"
          >
            <Phone className="w-3 h-3" />
            <span>1078 (NDRF)</span>
          </a>
          <a
            href="tel:1070"
            className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-black px-3 py-1 rounded-lg flex items-center gap-1 shadow-md shadow-amber-950"
          >
            <Phone className="w-3 h-3" />
            <span>1070 (Disaster Control)</span>
          </a>
          <a
            href="tel:108"
            className="bg-rose-600 hover:bg-rose-500 text-white font-black px-3 py-1 rounded-lg flex items-center gap-1 shadow-md shadow-rose-950"
          >
            <Phone className="w-3 h-3" />
            <span>108 (Ambulance)</span>
          </a>
        </div>
      </div>

      {/* Helplines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredHelplines.map((item) => (
          <div
            key={item.id}
            className={`rounded-xl p-4 flex flex-col justify-between border transition-all ${
              item.priority === 'high'
                ? 'bg-slate-800/80 border-red-900/60 hover:border-red-600/80'
                : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                  {item.category}
                </span>
                <span className="text-[10px] text-sky-400 font-semibold flex items-center gap-0.5">
                  <MapPin className="w-3 h-3" />
                  {item.state}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mt-1">
                {lang === 'hi' ? item.hindiName : item.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between gap-2">
              <div className="font-mono text-base font-black text-amber-300">
                {item.number}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopy(item.id, item.number)}
                  className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                  title="Copy Number"
                >
                  {copiedId === item.id ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <a
                  href={`tel:${item.number}`}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-red-950 transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>{t.callNow}</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
