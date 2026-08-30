import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Navigation, 
  Phone, 
  Users, 
  Check, 
  X, 
  Layers, 
  Info, 
  ShieldCheck, 
  AlertTriangle,
  Waves
} from 'lucide-react';
import { defaultShelters, mockWaterStations, calculateDistance } from '../data/mockShelters';

// Custom SVG map icons for Leaflet
const userIcon = L.divIcon({
  className: 'custom-user-pin',
  html: `<div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-red-600 border-2 border-white shadow-xl flex items-center justify-center text-white animate-bounce">
            📍
          </div>
          <div class="absolute w-12 h-12 rounded-full bg-red-500/40 animate-ping pointer-events-none"></div>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

const shelterIcon = L.divIcon({
  className: 'custom-shelter-pin',
  html: `<div class="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold">
          ⛺
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const gaugeIcon = L.divIcon({
  className: 'custom-gauge-pin',
  html: `<div class="w-8 h-8 rounded-full bg-sky-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold">
          🌊
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13, { duration: 1.2 });
    }
  }, [center, map]);
  return null;
}

export function FloodMap({ location, lang, t, onSelectShelter }) {
  const [showShelters, setShowShelters] = useState(true);
  const [showFloodZones, setShowFloodZones] = useState(true);
  const [showRiverGauges, setShowRiverGauges] = useState(true);

  // Default coordinate if GPS is loading (e.g. Patna, Bihar flood center)
  const defaultCenter = location ? [location.lat, location.lng] : [25.5941, 85.1376];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-4">
      {/* Map Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Waves className="w-5 h-5 text-sky-400" />
            <span>{t.floodMapTab}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {lang === 'hi'
              ? 'सटीक उपग्रह मानचित्र पर सुरक्षित आश्रय स्थल, जल स्तर व बाढ़ जोखिम क्षेत्र देखें।'
              : 'Interactive flood map with live GPS tracking, relief camp locator & flood hazard zones.'}
          </p>
        </div>

        {/* Map Layer Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setShowShelters(!showShelters)}
            className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 transition-colors ${
              showShelters 
                ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300' 
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <span>⛺ Shelters</span>
            {showShelters ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3" />}
          </button>

          <button
            onClick={() => setShowFloodZones(!showFloodZones)}
            className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 transition-colors ${
              showFloodZones 
                ? 'bg-red-950/80 border-red-600 text-red-300' 
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <span>⚠️ Inundation Zones</span>
            {showFloodZones ? <Check className="w-3 h-3 text-red-400" /> : <X className="w-3 h-3" />}
          </button>

          <button
            onClick={() => setShowRiverGauges(!showRiverGauges)}
            className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 transition-colors ${
              showRiverGauges 
                ? 'bg-sky-950/80 border-sky-600 text-sky-300' 
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <span>🌊 River Gauges</span>
            {showRiverGauges ? <Check className="w-3 h-3 text-sky-400" /> : <X className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="w-full h-[420px] sm:h-[480px] rounded-xl overflow-hidden border border-slate-700/80 relative shadow-inner">
        <MapContainer
          center={defaultCenter}
          zoom={12}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <RecenterMap center={location ? [location.lat, location.lng] : null} />

          {/* User Location Marker */}
          {location && (
            <Marker position={[location.lat, location.lng]} icon={userIcon}>
              <Popup className="custom-popup">
                <div className="p-1 text-slate-900 text-xs">
                  <strong className="text-red-600 text-sm block">📍 You Are Here</strong>
                  <div>Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</div>
                  <div className="text-slate-600 mt-1">Accuracy: ±{Math.round(location.accuracy)} meters</div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* High Flood Inundation Zones (Red Rings) */}
          {showFloodZones && (
            <>
              <Circle
                center={[25.625, 85.155]}
                radius={2200}
                pathOptions={{ color: '#ef4444', fillColor: '#dc2626', fillOpacity: 0.25 }}
              />
              <Circle
                center={[26.175, 91.76]}
                radius={3000}
                pathOptions={{ color: '#ef4444', fillColor: '#dc2626', fillOpacity: 0.25 }}
              />
            </>
          )}

          {/* Safe Relief Shelters */}
          {showShelters &&
            defaultShelters.map((shelter) => {
              const dist = location ? calculateDistance(location.lat, location.lng, shelter.lat, shelter.lng) : null;
              return (
                <Marker key={shelter.id} position={[shelter.lat, shelter.lng]} icon={shelterIcon}>
                  <Popup>
                    <div className="p-1 text-slate-900 text-xs max-w-xs">
                      <div className="flex items-center gap-1 text-emerald-700 font-bold text-sm">
                        <ShieldCheck className="w-4 h-4" />
                        <span>{lang === 'hi' ? shelter.hindiName : shelter.name}</span>
                      </div>
                      <div className="text-slate-600 text-[11px] mt-0.5">{shelter.address}</div>
                      
                      {dist !== null && (
                        <div className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded my-1.5 inline-block">
                          Distance: {dist} km away
                        </div>
                      )}

                      <div className="mt-1.5 space-y-1 text-[11px]">
                        <div><strong>Capacity:</strong> {shelter.occupancy} / {shelter.capacity} people</div>
                        <div><strong>Elevation:</strong> {shelter.elevation}</div>
                        <div className="flex items-center gap-1.5 text-slate-700 pt-1">
                          {shelter.supplies.food && <span>🍞 Food</span>}
                          {shelter.supplies.water && <span>💧 Clean Water</span>}
                          {shelter.supplies.medical && <span>🩺 Medical</span>}
                          {shelter.supplies.boats && <span>🚤 Boats</span>}
                        </div>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <a
                          href={`https://maps.google.com/?q=${shelter.lat},${shelter.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 bg-emerald-600 text-white font-bold py-1 px-2 rounded text-[11px]"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>Navigate</span>
                        </a>
                        <a
                          href={`tel:${shelter.phone}`}
                          className="flex items-center justify-center gap-1 bg-slate-800 text-white font-bold py-1 px-2.5 rounded text-[11px]"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {/* River Water Level Gauges */}
          {showRiverGauges &&
            mockWaterStations.map((station) => (
              <Marker key={station.id} position={[station.lat, station.lng]} icon={gaugeIcon}>
                <Popup>
                  <div className="p-1 text-slate-900 text-xs">
                    <strong className="text-sky-700 text-sm block">🌊 {lang === 'hi' ? station.hindiRiver : station.river}</strong>
                    <div className="mt-1">
                      <strong>Current Level:</strong> <span className="font-bold text-red-600">{station.currentLevel} m</span>
                    </div>
                    <div><strong>Danger Mark:</strong> {station.dangerLevel} m</div>
                    <div><strong>Status:</strong> {station.status}</div>
                    <div className="text-slate-600 text-[10px] mt-1">Trend: {station.trend}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>

        {/* Floating Quick Legend */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur border border-slate-700 text-white text-[11px] p-2 rounded-lg shadow-lg flex flex-col gap-1 pointer-events-auto">
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <Info className="w-3 h-3 text-sky-400" />
            <span>Map Legend</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span>Your GPS Pin / Red Zone (Hazard)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Safe Relief Shelter / High Ground</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            <span>River Water Level Station</span>
          </div>
        </div>
      </div>
    </div>
  );
}
