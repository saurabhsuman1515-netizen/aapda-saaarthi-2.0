import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data
const initialData = {
  users: [
    {
      id: "usr-1",
      name: "Saurabh Suman",
      email: "saurabh.suman@gmail.com",
      phone: "9876543210",
      bloodGroup: "O+",
      medicalNeeds: "None",
      familyCount: 2,
      emergencyContact1: "9123456780",
      emergencyContact2: "9988776655",
      createdAt: new Date().toISOString()
    }
  ],
  sosAlerts: [
    {
      id: "sos-init-1",
      userId: "usr-1",
      userName: "Saurabh Suman",
      phone: "9876543210",
      lat: 25.5941,
      lng: 85.1376,
      accuracy: 12,
      situation: "Trapped on Rooftop / Upper Floor",
      peopleCount: 3,
      bloodGroup: "O+",
      specialNeeds: "Diabetic / Insulin Dependent",
      batteryLevel: 68,
      status: "Dispatched",
      smsSent: true,
      timestamp: new Date().toISOString()
    }
  ],
  shelters: [
    {
      id: "sh-1",
      name: "Central High School Relief Camp & Safe Shelter",
      hindiName: "केंद्रीय उच्च विद्यालय राहत शिविर",
      lat: 25.5941,
      lng: 85.1376,
      address: "Bailey Road, Higher Elevation Zone, Patna",
      state: "Bihar",
      capacity: 650,
      occupancy: 280,
      elevation: "High Ground (Safe from Inundation)",
      phone: "0612-2233441",
      supplies: {
        food: true,
        water: true,
        medical: true,
        boats: true,
        generator: true
      },
      status: "Open & Receiving Citizens"
    },
    {
      id: "sh-2",
      name: "Community Flood Shelter - Gandhi Maidan Complex",
      hindiName: "गांधी मैदान सामुदायिक बाढ़ आश्रय",
      lat: 25.6174,
      lng: 85.1432,
      address: "Near North Gate, Elevated Pavilion, Patna",
      state: "Bihar",
      capacity: 1200,
      occupancy: 540,
      elevation: "Elevated Concrete Platform",
      phone: "0612-2255678",
      supplies: {
        food: true,
        water: true,
        medical: true,
        boats: false,
        generator: true
      },
      status: "Open & Receiving Citizens"
    },
    {
      id: "sh-3",
      name: "Guwahati College Relief & Medical Camp",
      hindiName: "गुवाहाटी कॉलेज राहत एवं चिकित्सा शिविर",
      lat: 26.1445,
      lng: 91.7362,
      address: "Bamunimaidam, Hillock Safe Zone, Guwahati",
      state: "Assam",
      capacity: 800,
      occupancy: 410,
      elevation: "High Hill Base (Zero Inundation Risk)",
      phone: "0361-2661245",
      supplies: {
        food: true,
        water: true,
        medical: true,
        boats: true,
        generator: true
      },
      status: "Open & Receiving Citizens"
    },
    {
      id: "sh-4",
      name: "Kochi Municipal Indoor Stadium Safe Shelter",
      hindiName: "कोच्चि म्युनिसिपल इनडोर स्टेडियम आश्रय",
      lat: 9.9816,
      lng: 76.2999,
      address: "Kadavanthra Elevated Zone, Kochi",
      state: "Kerala",
      capacity: 1500,
      occupancy: 620,
      elevation: "2nd Floor Flood Proof Structure",
      phone: "0484-2321456",
      supplies: {
        food: true,
        water: true,
        medical: true,
        boats: true,
        generator: true
      },
      status: "Open & Receiving Citizens"
    },
    {
      id: "sh-5",
      name: "Bhubaneswar High School Cyclone & Flood Center",
      hindiName: "भुवनेश्वर हाई स्कूल बाढ़ राहत केंद्र",
      lat: 20.2961,
      lng: 85.8245,
      address: "Unit 4, Capital Safe Belt, Bhubaneswar",
      state: "Odisha",
      capacity: 950,
      occupancy: 310,
      elevation: "Engineered Storm Shelter",
      phone: "0674-2391880",
      supplies: {
        food: true,
        water: true,
        medical: true,
        boats: true,
        generator: true
      },
      status: "Open & Receiving Citizens"
    }
  ],
  waterStations: [
    {
      id: "ws-1",
      river: "Ganga River (Patna)",
      hindiRiver: "गंगा नदी (पटना)",
      lat: 25.6200,
      lng: 85.1600,
      currentLevel: 49.85,
      dangerLevel: 48.60,
      warningLevel: 47.60,
      status: "Severe (Above Danger Mark)",
      trend: "Rising +0.12m/hr"
    },
    {
      id: "ws-2",
      river: "Brahmaputra River (Guwahati)",
      hindiRiver: "ब्रह्मपुत्र नदी (गुवाहाटी)",
      lat: 26.1800,
      lng: 91.7500,
      currentLevel: 50.15,
      dangerLevel: 49.68,
      warningLevel: 48.50,
      status: "Severe (Above Danger Mark)",
      trend: "Rising +0.08m/hr"
    },
    {
      id: "ws-3",
      river: "Periyar River (Aluva)",
      hindiRiver: "पेरियार नदी (अलुवा)",
      lat: 10.1076,
      lng: 76.3516,
      currentLevel: 6.20,
      dangerLevel: 7.50,
      warningLevel: 5.80,
      status: "Alert Level (Monitoring)",
      trend: "Stable"
    }
  ],
  hazards: [
    {
      id: "haz-1",
      type: "Bridge Submerged & Road Cut Off",
      waterDepth: "Chest-Deep (> 5 feet)",
      description: "Vehicular movement completely halted near Bailey Road underpass.",
      location: "Patna Sector 4",
      lat: 25.602,
      lng: 85.128,
      time: "15 mins ago",
      status: "Dispatched to NDRF"
    },
    {
      id: "haz-2",
      type: "Stranded Cattle & Livestock",
      waterDepth: "Knee-Deep (1 to 2 feet)",
      description: "Over 20 cattle trapped on elevated mound requiring fodder and dry shelter.",
      location: "Riverbank Village Belt",
      lat: 25.615,
      lng: 85.155,
      time: "1 hour ago",
      status: "Community Volunteer Alerted"
    }
  ],
  otpStore: {}
};

class Database {
  constructor() {
    this.data = this.load();
  }

  load() {
    if (!fs.existsSync(DB_FILE)) {
      this.save(initialData);
      return JSON.parse(JSON.stringify(initialData));
    }
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      console.error("DB read error, using defaults:", e);
      return JSON.parse(JSON.stringify(initialData));
    }
  }

  save(data = this.data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error("DB write error:", e);
    }
  }

  get(collection) {
    return this.data[collection] || [];
  }

  set(collection, items) {
    this.data[collection] = items;
    this.save();
  }

  insert(collection, item) {
    if (!this.data[collection]) this.data[collection] = [];
    this.data[collection].unshift(item);
    this.save();
    return item;
  }

  update(collection, id, updates) {
    if (!this.data[collection]) return null;
    const index = this.data[collection].findIndex(i => i.id === id);
    if (index === -1) return null;
    this.data[collection][index] = { ...this.data[collection][index], ...updates };
    this.save();
    return this.data[collection][index];
  }

  findOne(collection, predicate) {
    return (this.data[collection] || []).find(predicate);
  }
}

export const db = new Database();
