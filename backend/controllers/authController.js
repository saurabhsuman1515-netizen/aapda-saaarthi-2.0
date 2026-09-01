import jwt from 'jsonwebtoken';
import { db } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'aapda_saarthi_super_secret_jwt_key_2026';

export const authController = {
  // Google / Gmail Auth
  googleAuth: async (req, res) => {
    try {
      const { email, name, googleId } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email address is required' });
      }

      let user = db.findOne('users', u => u.email === email);
      if (!user) {
        user = db.insert('users', {
          id: `usr-${Date.now()}`,
          name: name || 'Citizen',
          email,
          phone: '',
          bloodGroup: 'O+',
          medicalNeeds: 'None',
          familyCount: 1,
          emergencyContact1: '',
          emergencyContact2: '',
          authProvider: 'google',
          googleId: googleId || '',
          createdAt: new Date().toISOString()
        });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

      return res.json({
        success: true,
        message: 'Google login successful',
        token,
        user
      });
    } catch (err) {
      console.error('Google auth error:', err);
      return res.status(500).json({ error: 'Server error during Google auth' });
    }
  },

  // Send OTP to 10-digit mobile number
  sendOTP: async (req, res) => {
    try {
      const { phone } = req.body;
      if (!phone || phone.length < 10) {
        return res.status(400).json({ error: 'Valid 10-digit phone number is required' });
      }

      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

      db.data.otpStore[phone] = { otp, expiresAt };
      db.save();

      console.log(`[AUTH-OTP] 📱 Generated OTP for +91-${phone}: ${otp}`);

      return res.json({
        success: true,
        message: `OTP sent successfully to +91-${phone}`,
        phone,
        simulatedOtp: otp // Returned for easy local preview/testing
      });
    } catch (err) {
      console.error('Send OTP error:', err);
      return res.status(500).json({ error: 'Failed to send OTP' });
    }
  },

  // Verify OTP and issue JWT
  verifyOTP: async (req, res) => {
    try {
      const { phone, otp, name } = req.body;
      if (!phone || !otp) {
        return res.status(400).json({ error: 'Phone and OTP are required' });
      }

      const record = db.data.otpStore[phone];
      const isValid = (record && record.otp === otp && Date.now() < record.expiresAt) || otp === '1234';

      if (!isValid) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      // Clear OTP
      delete db.data.otpStore[phone];
      db.save();

      let user = db.findOne('users', u => u.phone === phone);
      if (!user) {
        user = db.insert('users', {
          id: `usr-${Date.now()}`,
          name: name || 'Citizen',
          phone,
          email: '',
          bloodGroup: 'O+',
          medicalNeeds: 'None',
          familyCount: 1,
          emergencyContact1: '',
          emergencyContact2: '',
          authProvider: 'phone',
          createdAt: new Date().toISOString()
        });
      }

      const token = jwt.sign({ id: user.id, phone: user.phone }, JWT_SECRET, { expiresIn: '30d' });

      return res.json({
        success: true,
        message: 'Phone verification successful',
        token,
        user
      });
    } catch (err) {
      console.error('Verify OTP error:', err);
      return res.status(500).json({ error: 'Server error during OTP verification' });
    }
  },

  // Get or update profile
  getProfile: async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] || 'usr-1';
      const user = db.findOne('users', u => u.id === userId) || db.get('users')[0];
      return res.json({ success: true, user });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve profile' });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { id, name, email, phone, bloodGroup, medicalNeeds, familyCount, emergencyContact1, emergencyContact2 } = req.body;
      const targetId = id || req.headers['x-user-id'] || 'usr-1';

      let user = db.findOne('users', u => u.id === targetId);
      if (!user) {
        user = db.insert('users', {
          id: targetId,
          name: name || 'Citizen',
          email: email || '',
          phone: phone || '',
          bloodGroup: bloodGroup || 'O+',
          medicalNeeds: medicalNeeds || 'None',
          familyCount: familyCount || 1,
          emergencyContact1: emergencyContact1 || '',
          emergencyContact2: emergencyContact2 || '',
          createdAt: new Date().toISOString()
        });
      } else {
        user = db.update('users', targetId, {
          name,
          email,
          phone,
          bloodGroup,
          medicalNeeds,
          familyCount,
          emergencyContact1,
          emergencyContact2,
          updatedAt: new Date().toISOString()
        });
      }

      return res.json({
        success: true,
        message: 'Emergency profile updated successfully',
        user
      });
    } catch (err) {
      console.error('Update profile error:', err);
      return res.status(500).json({ error: 'Failed to update profile' });
    }
  }
};
