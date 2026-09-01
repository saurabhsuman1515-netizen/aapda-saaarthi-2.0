import { db } from '../db.js';

// Haversine distance calculator
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const shelterController = {
  // Get all shelters
  getAllShelters: async (req, res) => {
    try {
      const shelters = db.get('shelters');
      const { state } = req.query;
      const filtered = state && state !== 'All' 
        ? shelters.filter(s => s.state.toLowerCase() === state.toLowerCase())
        : shelters;
      return res.json({ success: true, count: filtered.length, shelters: filtered });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve shelters' });
    }
  },

  // Get nearest shelters from user coordinates
  getNearestShelters: async (req, res) => {
    try {
      const { lat, lng, limit = 10 } = req.query;
      if (!lat || !lng) {
        return res.status(400).json({ error: 'User coordinates lat and lng are required' });
      }

      const uLat = parseFloat(lat);
      const uLng = parseFloat(lng);
      const shelters = db.get('shelters');

      const sheltersWithDistance = shelters.map(s => ({
        ...s,
        distanceKm: calculateDistance(uLat, uLng, s.lat, s.lng)
      })).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0)).slice(0, parseInt(limit));

      return res.json({
        success: true,
        userLocation: { lat: uLat, lng: uLng },
        count: sheltersWithDistance.length,
        shelters: sheltersWithDistance
      });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to calculate nearest shelters' });
    }
  },

  // Update shelter occupancy & supplies
  updateOccupancy: async (req, res) => {
    try {
      const { id } = req.params;
      const { occupancy, supplies, status } = req.body;

      const updated = db.update('shelters', id, {
        occupancy: parseInt(occupancy),
        supplies,
        status,
        updatedAt: new Date().toISOString()
      });

      if (!updated) {
        return res.status(404).json({ error: 'Shelter not found' });
      }

      return res.json({ success: true, shelter: updated });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update shelter' });
    }
  }
};
