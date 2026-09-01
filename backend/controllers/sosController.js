import { db } from '../db.js';
import { SmsService } from '../services/smsService.js';

export const sosController = {
  // Dispatch emergency SOS distress alert
  dispatchSOS: async (req, res) => {
    try {
      const {
        userId,
        userName,
        phone,
        lat,
        lng,
        accuracy,
        situation,
        peopleCount,
        bloodGroup,
        specialNeeds,
        batteryLevel,
        emergencyContacts
      } = req.body;

      if (!lat || !lng) {
        return res.status(400).json({ error: 'GPS coordinates (lat, lng) are required for SOS dispatch' });
      }

      const alertRecord = {
        id: `sos-${Date.now()}`,
        userId: userId || 'anon',
        userName: userName || 'Distressed Citizen',
        phone: phone || 'Unprovided',
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        accuracy: parseFloat(accuracy) || 15,
        situation: situation || 'Severe Flood Emergency',
        peopleCount: parseInt(peopleCount) || 1,
        bloodGroup: bloodGroup || 'O+',
        specialNeeds: specialNeeds || 'None',
        batteryLevel: batteryLevel !== undefined ? parseInt(batteryLevel) : null,
        status: 'Dispatched', // 'Dispatched' | 'Rescue Boat Assigned' | 'Rescued' | 'Resolved'
        smsSent: true,
        timestamp: new Date().toISOString()
      };

      db.insert('sosAlerts', alertRecord);

      // Trigger automatic SMS dispatch to emergency contacts and authorities
      const contacts = Array.isArray(emergencyContacts) 
        ? emergencyContacts 
        : [req.body.emergencyContact1, req.body.emergencyContact2].filter(Boolean);

      const smsDispatchResults = await SmsService.broadcastDistressToContacts({
        sosAlert: alertRecord,
        contacts
      });

      console.log(`[SOS-ALERT] 🚨 NEW DISTRESS DISPATCH: ${alertRecord.id} at [${alertRecord.lat}, ${alertRecord.lng}] - ${alertRecord.peopleCount} victims`);

      return res.status(201).json({
        success: true,
        message: 'SOS distress signal registered and emergency SMS dispatch triggered!',
        alert: alertRecord,
        smsDispatchResults
      });
    } catch (err) {
      console.error('SOS dispatch error:', err);
      return res.status(500).json({ error: 'Failed to process SOS distress dispatch' });
    }
  },

  // Get active rescue distress list
  getActiveAlerts: async (req, res) => {
    try {
      const alerts = db.get('sosAlerts');
      return res.json({
        success: true,
        count: alerts.length,
        alerts
      });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch active alerts' });
    }
  },

  // Update rescue status
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, operatorNotes } = req.body;

      const updated = db.update('sosAlerts', id, {
        status,
        operatorNotes,
        updatedAt: new Date().toISOString()
      });

      if (!updated) {
        return res.status(404).json({ error: 'SOS record not found' });
      }

      return res.json({
        success: true,
        message: `Status updated to ${status}`,
        alert: updated
      });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update alert status' });
    }
  }
};
