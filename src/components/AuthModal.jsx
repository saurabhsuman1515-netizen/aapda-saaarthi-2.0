import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  ShieldCheck, 
  HeartHandshake, 
  Users, 
  CheckCircle2, 
  User, 
  Save, 
  LogOut,
  AlertCircle
} from 'lucide-react';

export function AuthModal({ 
  isOpen, 
  onClose, 
  userProfile, 
  onUpdateProfile, 
  lang, 
  t 
}) {
  const [authMethod, setAuthMethod] = useState('google'); // 'google' | 'phone'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loginStep, setLoginStep] = useState(userProfile.isLoggedIn ? 'profile' : 'auth'); // 'auth' | 'profile'
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: userProfile.name || '',
    email: userProfile.email || '',
    phone: userProfile.phone || '',
    bloodGroup: userProfile.bloodGroup || 'O+',
    medicalNeeds: userProfile.medicalNeeds || 'None',
    familyCount: userProfile.familyCount || 1,
    emergencyContact1: userProfile.emergencyContact1 || '',
    emergencyContact2: userProfile.emergencyContact2 || ''
  });

  if (!isOpen) return null;

  // Google Login Simulation
  const handleGoogleLogin = () => {
    const mockEmail = formData.email || "user.rescue@gmail.com";
    const mockName = formData.name || "Saurabh Suman";
    const updated = {
      ...formData,
      name: mockName,
      email: mockEmail,
      isLoggedIn: true,
      authProvider: 'google'
    };
    setFormData(updated);
    onUpdateProfile(updated);
    setLoginStep('profile');
  };

  // Phone OTP Flow
  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otpValue === generatedOtp || otpValue === "1234") {
      const updated = {
        ...formData,
        phone: phoneNumber,
        isLoggedIn: true,
        authProvider: 'phone'
      };
      setFormData(updated);
      onUpdateProfile(updated);
      setLoginStep('profile');
    } else {
      alert("Invalid OTP code. Please use the simulated code displayed above or 1234.");
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    onUpdateProfile({
      ...formData,
      isLoggedIn: true
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1500);
  };

  const handleLogout = () => {
    const reset = {
      name: '',
      email: '',
      phone: '',
      bloodGroup: 'O+',
      medicalNeeds: 'None',
      familyCount: 1,
      emergencyContact1: '',
      emergencyContact2: '',
      isLoggedIn: false,
      authProvider: null
    };
    setFormData(reset);
    onUpdateProfile(reset);
    setLoginStep('auth');
    setOtpSent(false);
    setOtpValue('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-800/90 px-5 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {loginStep === 'auth' ? t.loginRegister : t.emergencyProfile}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'hi'
                  ? 'आपदा के समय तुरंत सहायता हेतु अपना विवरण दर्ज करें।'
                  : 'Critical profile information stored offline for SMS rescue beacons.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {loginStep === 'auth' ? (
            <div className="space-y-4">
              {/* Method Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setAuthMethod('google')}
                  className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                    authMethod === 'google'
                      ? 'bg-slate-800 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Mail className="w-4 h-4 text-rose-400" />
                  <span>Google (Gmail)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('phone')}
                  className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                    authMethod === 'phone'
                      ? 'bg-slate-800 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Phone Number</span>
                </button>
              </div>

              {/* Google Auth Block */}
              {authMethod === 'google' && (
                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-white flex items-center justify-center shadow-md">
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Sign in with Google</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Link your Gmail account to sync your emergency contacts & rescue alerts.
                      </p>
                    </div>

                    <div className="text-left space-y-2 pt-2">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300">Your Full Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Saurabh Suman"
                          className="w-full mt-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300">Gmail Address</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="yourname@gmail.com"
                          className="w-full mt-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
                    >
                      <Mail className="w-4 h-4 text-red-500" />
                      <span>{t.signInGoogle}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Phone Number Auth Block */}
              {authMethod === 'phone' && (
                <div className="space-y-4 pt-2">
                  {!otpSent ? (
                    <form onSubmit={handleSendOTP} className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-300">
                          {t.enterPhone}
                        </label>
                        <div className="flex gap-2 mt-1">
                          <span className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-slate-300">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                            placeholder="9876543210"
                            className="flex-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-mono text-sm"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors"
                      >
                        {t.sendOTP}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOTP} className="space-y-3">
                      <div className="p-3 bg-emerald-950/60 border border-emerald-700/60 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
                        <div>
                          <span>OTP sent to <strong>+91 {phoneNumber}</strong></span>
                          <div className="text-[11px] text-emerald-400 mt-0.5">
                            Simulated OTP Code: <span className="font-mono font-black text-white bg-emerald-900 px-1.5 py-0.5 rounded">{generatedOtp}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="text-[11px] underline text-emerald-400"
                        >
                          Change
                        </button>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300">
                          {t.enterOTP}
                        </label>
                        <input
                          type="text"
                          maxLength={4}
                          value={otpValue}
                          onChange={(e) => setOtpValue(e.target.value)}
                          placeholder="Enter 4-digit code"
                          className="w-full mt-1 p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-center font-mono text-lg font-bold text-white tracking-widest focus:outline-none focus:border-emerald-500"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors"
                      >
                        {t.verifyOTP}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Emergency Profile Step */
            <form onSubmit={handleSaveProfile} className="space-y-3">
              {userProfile.isLoggedIn && (
                <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl border border-slate-700 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="font-bold text-white">{formData.name || 'Citizen'}</div>
                      <div className="text-slate-400 text-[10px]">{formData.email || formData.phone}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300">{t.name}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                    placeholder="Your Full Name"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300">{t.phone}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300">{t.bloodGroup}</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300">Family Members Trapped</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={formData.familyCount}
                    onChange={(e) => setFormData({ ...formData, familyCount: parseInt(e.target.value) || 1 })}
                    className="w-full mt-1 p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300">{t.specialNeeds}</label>
                <select
                  value={formData.medicalNeeds}
                  onChange={(e) => setFormData({ ...formData, medicalNeeds: e.target.value })}
                  className="w-full mt-1 p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                >
                  <option value="None">None (General Rescue)</option>
                  <option value="Diabetic / Insulin Dependent">Diabetic / Insulin Dependent</option>
                  <option value="Oxygen / Asthmatic Support">Oxygen / Asthmatic Support</option>
                  <option value="Pregnant Woman">Pregnant Woman</option>
                  <option value="Elderly / Wheelchair / Mobility Disabled">Elderly / Wheelchair / Mobility Disabled</option>
                  <option value="Dialysis / Kidney Patient">Dialysis / Kidney Patient</option>
                  <option value="Infant / Baby on Board">Infant / Baby on Board</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="text-[11px] font-bold text-amber-400">
                  Emergency Contacts (Auto-Targeted for SMS Fallback):
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">{t.emergencyContact1}</label>
                  <input
                    type="tel"
                    value={formData.emergencyContact1}
                    onChange={(e) => setFormData({ ...formData, emergencyContact1: e.target.value })}
                    placeholder="e.g. 9876543210 (Father/Spouse)"
                    className="w-full mt-0.5 p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">{t.emergencyContact2}</label>
                  <input
                    type="tel"
                    value={formData.emergencyContact2}
                    onChange={(e) => setFormData({ ...formData, emergencyContact2: e.target.value })}
                    placeholder="e.g. 9123456780 (Sibling/Relative)"
                    className="w-full mt-0.5 p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{savedSuccess ? t.profileSaved : t.saveProfile}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
