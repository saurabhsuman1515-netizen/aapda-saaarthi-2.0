import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  MapPin, 
  Phone, 
  Navigation, 
  Users, 
  ShieldCheck, 
  Check, 
  Droplet, 
  Utensils, 
  Stethoscope, 
  Anchor, 
  Zap 
} from 'lucide-react';
import { defaultShelters, calculateDistance } from '../data/mockShelters';

export function ShelterFinder({ location, lang, t }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All');

  // Compute distances and sort by closest
  const sheltersWithDistance = defaultShelters.map((sh) => {
    const dist = location ? calculateDistance(location.lat, location.lng, sh.lat, sh.lng) : null;
    return { ...sh, distance: dist };
  }).sort((a, b) => {
    if (a.distance !== null && b.distance !== null) return a.distance - b.distance;
    return 0;
  });

  const filteredShelters = sheltersWithDistance.filter((sh) => {
    const matchesSearch = 
      sh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sh.hindiName.includes(searchTerm) ||
      sh.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === 'All' || sh.state === selectedState;
    return matchesSearch && matchesState;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span>{t.nearestShelters}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {lang === 'hi' 
              ? 'बाढ़ सुरक्षित उच्च स्थानों, राहत शिविरों की दूरी, भोजन व चिकित्सा आपूर्ति देखें।' 
              : 'Verified high-ground relief centers, live occupancy rates, and navigation routes.'}
          </p>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.filterShelters}
            className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full py-2 px-3 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All States / Regions</option>
            <option value="Bihar">Bihar</option>
            <option value="Assam">Assam</option>
            <option value="Kerala">Kerala</option>
            <option value="Odisha">Odisha</option>
            <option value="Maharashtra">Maharashtra</option>
          </select>
        </div>
      </div>

      {/* Shelter Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredShelters.map((shelter) => {
          const occupancyPercent = Math.min(100, Math.round((shelter.occupancy / shelter.capacity) * 100));
          const isCrowded = occupancyPercent > 80;

          return (
            <div
              key={shelter.id}
              className="bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 rounded-xl p-4 flex flex-col justify-between gap-3 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {lang === 'hi' ? shelter.hindiName : shelter.name}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                      <span>{shelter.address}</span>
                    </p>
                  </div>
                  {shelter.distance !== null && (
                    <span className="shrink-0 bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-bold px-2 py-0.5 rounded-full">
                      {shelter.distance} km
                    </span>
                  )}
                </div>

                {/* Capacity Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-sky-400" />
                      {t.occupancy}: {shelter.occupancy} / {shelter.capacity}
                    </span>
                    <span className={isCrowded ? "text-amber-400 font-bold" : "text-emerald-400"}>
                      {occupancyPercent}% Full
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isCrowded ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occupancyPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Supplies badges */}
                <div className="mt-3 pt-2 border-t border-slate-700/60 flex flex-wrap gap-1.5 text-[11px]">
                  {shelter.supplies.food && (
                    <span className="bg-slate-900 text-slate-300 border border-slate-700 px-2 py-0.5 rounded flex items-center gap-1">
                      <Utensils className="w-3 h-3 text-amber-400" />
                      Food
                    </span>
                  )}
                  {shelter.supplies.water && (
                    <span className="bg-slate-900 text-slate-300 border border-slate-700 px-2 py-0.5 rounded flex items-center gap-1">
                      <Droplet className="w-3 h-3 text-sky-400" />
                      Clean Water
                    </span>
                  )}
                  {shelter.supplies.medical && (
                    <span className="bg-slate-900 text-slate-300 border border-slate-700 px-2 py-0.5 rounded flex items-center gap-1">
                      <Stethoscope className="w-3 h-3 text-rose-400" />
                      Doctors
                    </span>
                  )}
                  {shelter.supplies.boats && (
                    <span className="bg-slate-900 text-slate-300 border border-slate-700 px-2 py-0.5 rounded flex items-center gap-1">
                      <Anchor className="w-3 h-3 text-blue-400" />
                      Rescue Boats
                    </span>
                  )}
                  {shelter.supplies.generator && (
                    <span className="bg-slate-900 text-slate-300 border border-slate-700 px-2 py-0.5 rounded flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      Power
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`https://maps.google.com/?q=${shelter.lat},${shelter.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-950 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{t.navigate}</span>
                </a>
                <a
                  href={`tel:${shelter.phone}`}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 rounded-lg text-xs font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-sky-400" />
                  <span>{t.callShelter}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
