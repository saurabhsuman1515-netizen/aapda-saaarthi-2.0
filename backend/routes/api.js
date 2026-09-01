import express from 'express';
import { authController } from '../controllers/authController.js';
import { sosController } from '../controllers/sosController.js';
import { shelterController } from '../controllers/shelterController.js';
import { hazardController, helplineController } from '../controllers/hazardController.js';

const router = express.Router();

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'AAPDA SAARTHI Backend API',
    time: new Date().toISOString(),
    smsGateway: 'ACTIVE'
  });
});

// Auth & User Profile Routes
router.post('/auth/google', authController.googleAuth);
router.post('/auth/phone/send-otp', authController.sendOTP);
router.post('/auth/phone/verify-otp', authController.verifyOTP);
router.get('/user/profile', authController.getProfile);
router.put('/user/profile', authController.updateProfile);

// SOS Distress Routes
router.post('/sos/distress', sosController.dispatchSOS);
router.get('/sos/active', sosController.getActiveAlerts);
router.put('/sos/:id/status', sosController.updateStatus);

// Shelters Routes
router.get('/shelters', shelterController.getAllShelters);
router.get('/shelters/nearest', shelterController.getNearestShelters);
router.put('/shelters/:id/occupancy', shelterController.updateOccupancy);

// Citizen Hazard Reports
router.get('/hazards', hazardController.getAllHazards);
router.post('/hazards/report', hazardController.reportHazard);

// River Gauges / Water Levels
router.get('/water-levels', helplineController.getWaterLevels);

export default router;
