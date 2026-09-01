import { db } from '../db.js';

export const hazardController = {
  // Get all hazards
  getAllHazards: async (req, res) => {
    try {
      const hazards = db.get('hazards');
      return res.json({ success: true, count: hazards.length, hazards });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve hazards' });
    }
  },

  // Citizen report new hazard
  reportHazard: async (req, res) => {
    try {
      const { type, waterDepth, description, location, lat, lng, reporterName } = req.body;
      
      const newHazard = {
        id: `haz-${Date.now()}`,
        type: type || 'Embankment / Dam Breach',
        waterDepth: waterDepth || 'Waist-Deep (3 to 4 feet)',
        description: description || 'Hazard reported by citizen',
        location: location || (lat && lng ? `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}` : 'Active Area'),
        lat: lat ? parseFloat(lat) : 25.5941,
        lng: lng ? parseFloat(lng) : 85.1376,
        reporterName: reporterName || 'Anonymous Citizen',
        time: 'Just now',
        status: 'Dispatched to NDRF / SDRF',
        createdAt: new Date().toISOString()
      };

      db.insert('hazards', newHazard);
      console.log(`[HAZARD-REPORT] ⚠️ New Hazard reported: ${newHazard.type} at ${newHazard.location}`);

      return res.status(201).json({
        success: true,
        message: 'Hazard report received and broadcasted to relief teams',
        hazard: newHazard
      });
    } catch (err) {
      console.error('Hazard report error:', err);
      return res.status(500).json({ error: 'Failed to submit hazard report' });
    }
  }
};

export const helplineController = {
  // Get river water levels
  getWaterLevels: async (req, res) => {
    try {
      const stations = db.get('waterStations');
      return res.json({ success: true, stations });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve water levels' });
    }
  }
};
