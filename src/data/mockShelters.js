export const defaultShelters = [
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
    status: "Open & Receiving Citizens",
    contactPerson: "Dr. R.K. Verma (Camp Officer)"
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
    status: "Open & Receiving Citizens",
    contactPerson: "Capt. A. Mishra"
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
    status: "Open & Receiving Citizens",
    contactPerson: "Deben Saikia (ASDMA Volunteer Lead)"
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
    status: "Open & Receiving Citizens",
    contactPerson: "Jacob Varghese"
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
    status: "Open & Receiving Citizens",
    contactPerson: "Subrat Nayak"
  },
  {
    id: "sh-6",
    name: "Mumbai Suburban Flood Refuge - Kurla Hall",
    hindiName: "मुंबई उपनगरीय बाढ़ शरणालय - कुर्ला",
    lat: 19.0728,
    lng: 72.8826,
    address: "Elevated Station Complex Hall, Mumbai",
    state: "Maharashtra",
    capacity: 700,
    occupancy: 590,
    elevation: "High Tier Structure",
    phone: "022-26501122",
    supplies: {
      food: true,
      water: true,
      medical: false,
      boats: false,
      generator: true
    },
    status: "Filling Fast (Near Capacity)",
    contactPerson: "Santosh Kadam"
  }
];

export const mockWaterStations = [
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
  },
  {
    id: "ws-4",
    river: "Mahanadi River (Naraj)",
    hindiRiver: "महानदी (नराज कटक)",
    lat: 20.4625,
    lng: 85.7682,
    currentLevel: 26.10,
    dangerLevel: 26.41,
    warningLevel: 25.40,
    status: "Warning Level",
    trend: "Falling -0.05m/hr"
  }
];

// Distance calculation using Haversine formula
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // Round to 1 decimal
}
