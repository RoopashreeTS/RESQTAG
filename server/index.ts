import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data', 'store.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initial fictional demo profile
const INITIAL_DEMO_PROFILE = {
  id: 'usr_rahul_kumar_demo',
  tagId: 'RQT-8829A4',
  shortCode: 'RQ7K29',
  phone: '+91 98450 11223',
  fullName: 'Rahul Kumar',
  photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  age: 24,
  bloodGroup: 'O+',
  address: '#402, Sunshine Residency, Indiranagar 100ft Road, Bengaluru, Karnataka - 560038',
  vehicleNumber: 'KA-01-AB-1234',
  allergies: 'Penicillin, Peanuts (Severe anaphylaxis risk)',
  medicalInfo: 'Asthmatic (Carries blue Salbutamol inhaler in backpack pocket). No cardiac history. Diabetic Type 2 (Diet controlled).',
  emergencyContacts: [
    {
      id: 'c1',
      name: 'Ramesh Kumar',
      relationship: 'Father',
      phone: '+91 98765 43210',
      isPrimary: true,
    },
    {
      id: 'c2',
      name: 'Priya Sharma',
      relationship: 'Spouse',
      phone: '+91 98765 12345',
      isPrimary: false,
    },
    {
      id: 'c3',
      name: 'Dr. Arvind Swamy',
      relationship: 'Family Physician',
      phone: '+91 98765 67890',
      isPrimary: false,
    },
  ],
  createdAt: '2026-09-01T10:00:00.000Z',
  updatedAt: '2026-09-24T14:30:00.000Z',
};

const INITIAL_SCAN_EVENTS = [
  {
    id: 'scan_1',
    tagId: 'RQT-8829A4',
    shortCode: 'RQ7K29',
    timestamp: '2026-09-24T18:42:00.000Z',
    vehicleNumber: 'KA-01-AB-1234',
    scannerDevice: 'Mobile Browser (Safari / iOS)',
    locationStatus: 'Location shared',
    latitude: 12.9716,
    longitude: 77.5946,
    approxLocation: 'MG Road Junction, Bengaluru, Karnataka',
    notifiedContacts: true,
  },
  {
    id: 'scan_2',
    tagId: 'RQT-8829A4',
    shortCode: 'RQ7K29',
    timestamp: '2026-09-20T09:15:00.000Z',
    vehicleNumber: 'KA-01-AB-1234',
    scannerDevice: 'Mobile Browser (Chrome / Android)',
    locationStatus: 'Location not shared',
    latitude: null,
    longitude: null,
    approxLocation: 'Location not shared',
    notifiedContacts: true,
  }
];

// Initial SafeJourneys Demo History
const INITIAL_SAFE_JOURNEYS = [
  {
    id: 'journey_demo_prev1',
    userId: 'usr_rahul_kumar_demo',
    userName: 'Rahul Kumar',
    userPhone: '+91 98450 11223',
    tagId: 'RQT-8829A4',
    destinationType: 'Forest / Trekking Area',
    customDestination: 'Savandurga Trek, Karnataka',
    isSolo: true,
    startTime: '2026-09-21T06:00:00.000Z',
    expectedEndTime: '2026-09-21T12:00:00.000Z',
    intervalMinutes: 60,
    isDemoMode: false,
    status: 'completed',
    lastCheckinTime: '2026-09-21T11:00:00.000Z',
    nextCheckinTime: '2026-09-21T12:00:00.000Z',
    lastLocation: {
      status: 'Location shared',
      lat: 12.9186,
      lng: 77.2929,
      text: 'Savandurga Base Camp (Coordinates shared)'
    },
    emergencyContacts: [
      { id: 'c1', name: 'Ramesh Kumar', relationship: 'Father', phone: '+91 98765 43210', isPrimary: true },
      { id: 'c2', name: 'Priya Sharma', relationship: 'Spouse', phone: '+91 98765 12345', isPrimary: false }
    ],
    createdAt: '2026-09-21T06:00:00.000Z',
    endedAt: '2026-09-21T11:45:00.000Z',
    totalCheckins: 5,
    missedCheckins: 0,
    alertsCount: 0,
  }
];

const INITIAL_JOURNEY_CHECKINS = [
  {
    id: 'chk_1',
    journeyId: 'journey_demo_prev1',
    timestamp: '2026-09-21T07:00:00.000Z',
    status: 'safe',
    location: { status: 'Location shared', lat: 12.9186, lng: 77.2929, text: 'Savandurga Foothills' }
  },
  {
    id: 'chk_2',
    journeyId: 'journey_demo_prev1',
    timestamp: '2026-09-21T08:00:00.000Z',
    status: 'safe',
    location: { status: 'Location shared', lat: 12.9195, lng: 77.2940, text: 'Mid-point Fort Ruins' }
  },
  {
    id: 'chk_3',
    journeyId: 'journey_demo_prev1',
    timestamp: '2026-09-21T09:00:00.000Z',
    status: 'safe',
    location: { status: 'Location shared', lat: 12.9210, lng: 77.2965, text: 'Summit Point' }
  },
  {
    id: 'chk_4',
    journeyId: 'journey_demo_prev1',
    timestamp: '2026-09-21T10:00:00.000Z',
    status: 'safe',
    location: { status: 'Location shared', lat: 12.9205, lng: 77.2950, text: 'Descent Trail' }
  },
  {
    id: 'chk_5',
    journeyId: 'journey_demo_prev1',
    timestamp: '2026-09-21T11:00:00.000Z',
    status: 'safe',
    location: { status: 'Location shared', lat: 12.9186, lng: 77.2929, text: 'Returned safely to base' }
  }
];

const INITIAL_JOURNEY_ALERTS: any[] = [];

interface DataStore {
  profiles: typeof INITIAL_DEMO_PROFILE[];
  scanEvents: typeof INITIAL_SCAN_EVENTS;
  safeJourneys: any[];
  journeyCheckins: any[];
  journeyAlerts: any[];
  otpStore: Record<string, { otp: string; expiresAt: number; verified: boolean }>;
  sessions: Record<string, { userId: string; expiresAt: number }>;
}

let store: DataStore = {
  profiles: [INITIAL_DEMO_PROFILE],
  scanEvents: [...INITIAL_SCAN_EVENTS],
  safeJourneys: [...INITIAL_SAFE_JOURNEYS],
  journeyCheckins: [...INITIAL_JOURNEY_CHECKINS],
  journeyAlerts: [...INITIAL_JOURNEY_ALERTS],
  otpStore: {},
  sessions: {},
};

// Load or initialize store from disk
function loadStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      store = {
        profiles: parsed.profiles || [INITIAL_DEMO_PROFILE],
        scanEvents: parsed.scanEvents || [...INITIAL_SCAN_EVENTS],
        safeJourneys: parsed.safeJourneys || [...INITIAL_SAFE_JOURNEYS],
        journeyCheckins: parsed.journeyCheckins || [...INITIAL_JOURNEY_CHECKINS],
        journeyAlerts: parsed.journeyAlerts || [...INITIAL_JOURNEY_ALERTS],
        otpStore: parsed.otpStore || {},
        sessions: parsed.sessions || {},
      };
      if (!store.profiles.find(p => p.shortCode === 'RQ7K29')) {
        store.profiles.unshift(INITIAL_DEMO_PROFILE);
      }
    } else {
      saveStore();
    }
  } catch (err) {
    console.error('Error loading store file, using in-memory defaults:', err);
  }
}

function saveStore() {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store to disk:', err);
  }
}

loadStore();

// Helper to generate short code (e.g., "RQ7K29")
function generateShortCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = 'RQ';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  if (store.profiles.some(p => p.shortCode === result)) {
    return generateShortCode();
  }
  return result;
}

// Helper to generate unique Tag ID (e.g., "RQT-98A4C2")
function generateTagId(): string {
  const hex = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `RQT-${hex}`;
}

// Auth Middleware
function authMiddleware(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const fallbackUserId = req.headers['x-user-id'] as string;
    if (fallbackUserId) {
      const profile = store.profiles.find(p => p.id === fallbackUserId);
      if (profile) {
        (req as any).user = profile;
        return next();
      }
    }
    return res.status(401).json({ error: 'Unauthorized. Please provide a valid Bearer token.' });
  }

  const token = authHeader.split(' ')[1];
  const session = store.sessions[token];

  if (session && session.expiresAt > Date.now()) {
    const profile = store.profiles.find(p => p.id === session.userId);
    if (profile) {
      (req as any).user = profile;
      return next();
    }
  }

  // Demo token check
  if (token === 'demo-token-rahul' || token === 'demo_token_active') {
    const profile = store.profiles.find(p => p.shortCode === 'RQ7K29') || store.profiles[0];
    (req as any).user = profile;
    return next();
  }

  return res.status(401).json({ error: 'Session expired or invalid.' });
}

// Optional Auth (passes user if token valid, or allows guest/demo fallback)
function optionalAuth(req: Request, _res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const session = store.sessions[token];
    if (session && session.expiresAt > Date.now()) {
      const profile = store.profiles.find(p => p.id === session.userId);
      if (profile) (req as any).user = profile;
    } else if (token === 'demo-token-rahul' || token === 'demo_token_active') {
      const profile = store.profiles.find(p => p.shortCode === 'RQ7K29') || store.profiles[0];
      (req as any).user = profile;
    }
  }
  next();
}

// =================== EXISTING ROUTES =================== //

// 1. Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'ResQTag Emergency Backend API',
    version: '1.2.0',
    profilesCount: store.profiles.length,
    scansCount: store.scanEvents.length,
    activeJourneysCount: store.safeJourneys.filter(j => j.status === 'active').length,
    timestamp: new Date().toISOString()
  });
});

// 2. Auth: Send OTP
app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }

  const otp = '123456';
  store.otpStore[phone] = {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000,
    verified: false,
  };

  saveStore();

  console.log(`[DEMO OTP] Sent OTP ${otp} to phone ${phone}`);
  return res.json({
    success: true,
    message: 'Demo OTP sent successfully',
    demoOtp: otp,
    phone,
    isDemo: true
  });
});

// 3. Auth: Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP are required.' });
  }

  const record = store.otpStore[phone];
  if (otp === '123456' || (record && record.otp === otp && record.expiresAt > Date.now())) {
    if (record) record.verified = true;
    
    let profile = store.profiles.find(p => p.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''));
    
    const token = `tok_${uuidv4()}`;
    if (profile) {
      store.sessions[token] = {
        userId: profile.id,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      };
      saveStore();
      return res.json({
        success: true,
        token,
        profile,
        isNewUser: false,
        message: 'Authentication successful'
      });
    }

    saveStore();
    return res.json({
      success: true,
      token,
      phone,
      isNewUser: true,
      message: 'OTP verified. Please complete your emergency profile.'
    });
  }

  return res.status(400).json({ error: 'Invalid or expired OTP. Please use demo OTP: 123456' });
});

// 4. Auth: Demo 1-Click Login (For Hackathon judges)
app.post('/api/auth/demo-login', (_req, res) => {
  const profile = store.profiles.find(p => p.shortCode === 'RQ7K29') || store.profiles[0];
  const token = 'demo-token-rahul';
  store.sessions[token] = {
    userId: profile.id,
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };
  saveStore();
  return res.json({
    success: true,
    token,
    profile,
    message: 'Logged in as Demo Profile (Rahul Kumar)'
  });
});

// 5. Create Profile
app.post('/api/profiles', (req, res) => {
  const {
    fullName,
    phone,
    age,
    bloodGroup,
    address,
    vehicleNumber,
    allergies,
    medicalInfo,
    emergencyContacts,
    photoUrl
  } = req.body;

  if (!fullName || !phone || !bloodGroup || !vehicleNumber) {
    return res.status(400).json({
      error: 'Missing required fields: Full Name, Phone, Blood Group, and Vehicle Number are required.'
    });
  }

  const newProfile = {
    id: `usr_${uuidv4().substring(0, 8)}`,
    tagId: generateTagId(),
    shortCode: generateShortCode(),
    phone,
    fullName,
    photoUrl: photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    age: age || 25,
    bloodGroup,
    address: address || '',
    vehicleNumber: vehicleNumber.toUpperCase().trim(),
    allergies: allergies || 'None reported',
    medicalInfo: medicalInfo || 'No major medical conditions reported',
    emergencyContacts: Array.isArray(emergencyContacts) && emergencyContacts.length > 0 
      ? emergencyContacts.map((c: any, index: number) => ({
          id: c.id || `c_${index + 1}`,
          name: c.name || 'Emergency Contact',
          relationship: c.relationship || 'Family',
          phone: c.phone || '',
          isPrimary: index === 0
        }))
      : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.profiles.push(newProfile);
  
  const token = `tok_${uuidv4()}`;
  store.sessions[token] = {
    userId: newProfile.id,
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };

  saveStore();

  return res.status(201).json({
    success: true,
    token,
    profile: newProfile,
    message: 'ResQTag Emergency Profile successfully created!'
  });
});

// 6. Get Current User Profile
app.get('/api/profiles/me', authMiddleware, (req, res) => {
  const user = (req as any).user;
  res.json({
    success: true,
    profile: user
  });
});

// 7. Update Profile - Stable QR Guarantee!
app.put('/api/profiles/me', authMiddleware, (req, res) => {
  const currentUser = (req as any).user;
  const index = store.profiles.findIndex(p => p.id === currentUser.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Profile not found.' });
  }

  const existing = store.profiles[index];
  const {
    fullName,
    photoUrl,
    age,
    bloodGroup,
    address,
    vehicleNumber,
    allergies,
    medicalInfo,
    emergencyContacts,
  } = req.body;

  const updatedProfile = {
    ...existing,
    fullName: fullName !== undefined ? fullName : existing.fullName,
    photoUrl: photoUrl !== undefined ? photoUrl : existing.photoUrl,
    age: age !== undefined ? age : existing.age,
    bloodGroup: bloodGroup !== undefined ? bloodGroup : existing.bloodGroup,
    address: address !== undefined ? address : existing.address,
    vehicleNumber: vehicleNumber !== undefined ? vehicleNumber.toUpperCase().trim() : existing.vehicleNumber,
    allergies: allergies !== undefined ? allergies : existing.allergies,
    medicalInfo: medicalInfo !== undefined ? medicalInfo : existing.medicalInfo,
    emergencyContacts: emergencyContacts !== undefined ? emergencyContacts : existing.emergencyContacts,
    updatedAt: new Date().toISOString(),
  };

  store.profiles[index] = updatedProfile;
  saveStore();

  return res.json({
    success: true,
    profile: updatedProfile,
    message: 'Profile updated successfully! Your existing ResQTag QR and short code remain active.'
  });
});

// 8. Public Emergency Responder Lookup (Zero Auth!)
app.get('/api/public/tag/:identifier', (req, res) => {
  const identifier = req.params.identifier.trim().toUpperCase();

  const profile = store.profiles.find(
    p => p.tagId.toUpperCase() === identifier || 
         p.shortCode.toUpperCase() === identifier ||
         p.id === identifier
  );

  if (!profile) {
    return res.status(404).json({
      error: 'ResQTag not found',
      message: `No active emergency profile found for code: "${identifier}". Please check the short code or re-scan the QR.`
    });
  }

  const publicProfile = {
    tagId: profile.tagId,
    shortCode: profile.shortCode,
    fullName: profile.fullName,
    photoUrl: profile.photoUrl,
    age: profile.age,
    bloodGroup: profile.bloodGroup,
    address: profile.address,
    vehicleNumber: profile.vehicleNumber,
    allergies: profile.allergies,
    medicalInfo: profile.medicalInfo,
    emergencyContacts: profile.emergencyContacts,
    updatedAt: profile.updatedAt,
  };

  return res.json({
    success: true,
    profile: publicProfile
  });
});

// 9. Record Responder Scan Event & Send Notification Alert
app.post('/api/public/scan-event', (req, res) => {
  const {
    identifier,
    locationStatus,
    latitude,
    longitude,
    approxLocation,
    scannerDevice
  } = req.body;

  const code = (identifier || '').trim().toUpperCase();
  const profile = store.profiles.find(
    p => p.tagId.toUpperCase() === code || 
         p.shortCode.toUpperCase() === code ||
         p.id === code
  );

  if (!profile) {
    return res.status(404).json({ error: 'ResQTag not found.' });
  }

  const isLocationShared = locationStatus === 'Location shared' && latitude && longitude;

  const scanEvent = {
    id: `scan_${uuidv4().substring(0, 8)}`,
    tagId: profile.tagId,
    shortCode: profile.shortCode,
    timestamp: new Date().toISOString(),
    vehicleNumber: profile.vehicleNumber,
    scannerDevice: scannerDevice || 'Mobile Responder Device',
    locationStatus: isLocationShared ? ('Location shared' as const) : ('Location not shared' as const),
    latitude: isLocationShared ? Number(latitude) : null,
    longitude: isLocationShared ? Number(longitude) : null,
    approxLocation: isLocationShared 
      ? (approxLocation || 'Bengaluru, Karnataka (Coordinates shared)') 
      : 'Location not shared',
    notifiedContacts: true,
  };

  store.scanEvents.unshift(scanEvent);
  saveStore();

  const primaryContact = profile.emergencyContacts.find(c => c.isPrimary) || profile.emergencyContacts[0];
  const simulatedNotification = {
    id: `notif_${uuidv4().substring(0, 8)}`,
    tagId: profile.tagId,
    title: '🚨 ResQTag Emergency Scan Alert',
    recipientName: primaryContact?.name || 'Emergency Contact',
    recipientPhone: primaryContact?.phone || profile.phone,
    message: `EMERGENCY ALERT: ${profile.fullName}'s ResQTag (Vehicle: ${profile.vehicleNumber}) was scanned at ${new Date().toLocaleTimeString()}. Location: ${scanEvent.approxLocation}.`,
    timestamp: scanEvent.timestamp,
    locationStatus: scanEvent.locationStatus,
    approxLocation: scanEvent.approxLocation,
    coords: isLocationShared ? { lat: Number(latitude), lng: Number(longitude) } : undefined
  };

  console.log('[TRUSTED CONTACT NOTIFICATION SIMULATED]:', simulatedNotification);

  return res.status(201).json({
    success: true,
    scanEvent,
    notification: simulatedNotification,
    message: 'Scan event logged and emergency contacts notified.'
  });
});

// 10. Get Owner Scan History
app.get('/api/scans/my-history', (req, res) => {
  const tagIdQuery = req.query.tagId as string;
  const authHeader = req.headers.authorization;
  
  let targetTagId = tagIdQuery;

  if (!targetTagId && authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const session = store.sessions[token];
    if (session) {
      const profile = store.profiles.find(p => p.id === session.userId);
      if (profile) targetTagId = profile.tagId;
    } else if (token === 'demo-token-rahul') {
      targetTagId = 'RQT-8829A4';
    }
  }

  if (!targetTagId) {
    return res.json({
      success: true,
      scans: store.scanEvents
    });
  }

  const scans = store.scanEvents.filter(s => s.tagId === targetTagId);
  return res.json({
    success: true,
    scans
  });
});

// ============================================================
// 🌲 RESQTAG SAFEJOURNEY ENDPOINTS
// ============================================================

// 1. Start SafeJourney
app.post('/api/safejourney/start', optionalAuth, (req, res) => {
  const user = (req as any).user || store.profiles[0];
  const {
    destinationType,
    customDestination,
    isSolo,
    startTime,
    expectedEndTime,
    intervalMinutes,
    isDemoMode,
    demoIntervalSeconds,
    initialLocation,
    emergencyContacts,
  } = req.body;

  if (!destinationType) {
    return res.status(400).json({ error: 'Destination type is required.' });
  }

  // End any previously active journey for this user
  store.safeJourneys.forEach(j => {
    if (j.userId === user.id && j.status === 'active') {
      j.status = 'completed';
      j.endedAt = new Date().toISOString();
    }
  });

  const now = new Date();
  const effectiveIntervalMs = isDemoMode
    ? (demoIntervalSeconds || 20) * 1000
    : (intervalMinutes || 60) * 60 * 1000;

  const nextCheckinDate = new Date(now.getTime() + effectiveIntervalMs);

  const newJourney = {
    id: `journey_${uuidv4().substring(0, 8)}`,
    userId: user.id,
    userName: user.fullName || 'Registered User',
    userPhone: user.phone || '+91 98450 11223',
    tagId: user.tagId || 'RQT-8829A4',
    destinationType,
    customDestination: customDestination || '',
    isSolo: isSolo !== undefined ? isSolo : true,
    startTime: startTime || now.toISOString(),
    expectedEndTime: expectedEndTime || new Date(now.getTime() + 4 * 3600000).toISOString(),
    intervalMinutes: intervalMinutes || 60,
    isDemoMode: !!isDemoMode,
    demoIntervalSeconds: isDemoMode ? (demoIntervalSeconds || 20) : undefined,
    status: 'active',
    lastCheckinTime: now.toISOString(),
    nextCheckinTime: nextCheckinDate.toISOString(),
    lastLocation: initialLocation || {
      status: 'Location unavailable — permission was not granted',
      lat: null,
      lng: null,
      text: null
    },
    emergencyContacts: emergencyContacts && emergencyContacts.length > 0 
      ? emergencyContacts 
      : user.emergencyContacts || [],
    createdAt: now.toISOString(),
    endedAt: null,
    totalCheckins: 1,
    missedCheckins: 0,
    alertsCount: 0,
  };

  store.safeJourneys.unshift(newJourney);

  // Record initial start checkin
  store.journeyCheckins.unshift({
    id: `chk_${uuidv4().substring(0, 8)}`,
    journeyId: newJourney.id,
    timestamp: now.toISOString(),
    status: 'safe',
    location: newJourney.lastLocation,
    notes: 'Journey initialized safely'
  });

  saveStore();

  console.log(`[SAFEJOURNEY STARTED] User: ${user.fullName}, Type: ${destinationType}, Demo: ${isDemoMode}`);

  return res.status(201).json({
    success: true,
    journey: newJourney,
    message: 'SafeJourney is active.'
  });
});

// 2. Get Active SafeJourney
app.get('/api/safejourney/active', optionalAuth, (req, res) => {
  const user = (req as any).user || store.profiles[0];
  const active = store.safeJourneys.find(j => j.userId === user.id && j.status === 'active');

  const checkins = active
    ? store.journeyCheckins.filter(c => c.journeyId === active.id)
    : [];

  return res.json({
    success: true,
    journey: active || null,
    checkins
  });
});

// 3. Safety Check-in (User selects: I'M SAFE)
app.post('/api/safejourney/checkin', (req, res) => {
  const { journeyId, location, notes } = req.body;

  const journeyIndex = store.safeJourneys.findIndex(j => j.id === journeyId && j.status === 'active');
  if (journeyIndex === -1) {
    return res.status(404).json({ error: 'Active SafeJourney not found.' });
  }

  const journey = store.safeJourneys[journeyIndex];
  const now = new Date();
  const effectiveIntervalMs = journey.isDemoMode
    ? (journey.demoIntervalSeconds || 20) * 1000
    : (journey.intervalMinutes || 60) * 60 * 1000;

  const nextCheckinDate = new Date(now.getTime() + effectiveIntervalMs);

  journey.lastCheckinTime = now.toISOString();
  journey.nextCheckinTime = nextCheckinDate.toISOString();
  journey.totalCheckins += 1;
  if (location) {
    journey.lastLocation = location;
  }

  const checkinRecord = {
    id: `chk_${uuidv4().substring(0, 8)}`,
    journeyId: journey.id,
    timestamp: now.toISOString(),
    status: 'safe',
    location: journey.lastLocation,
    notes: notes || 'Check-in completed: Marked Safe'
  };

  store.journeyCheckins.unshift(checkinRecord);
  saveStore();

  console.log(`[SAFEJOURNEY CHECK-IN] ${journey.userName} marked safe at ${now.toLocaleTimeString()}`);

  return res.json({
    success: true,
    journey,
    checkin: checkinRecord,
    message: "✓ You're marked safe."
  });
});

// 4. Immediate Help Request (User selects: 🆘 I NEED HELP)
app.post('/api/safejourney/sos', (req, res) => {
  const { journeyId, location, reason } = req.body;

  const journey = store.safeJourneys.find(j => j.id === journeyId);
  if (!journey) {
    return res.status(404).json({ error: 'Journey not found.' });
  }

  journey.status = 'alert_triggered';
  journey.alertsCount += 1;
  if (location) {
    journey.lastLocation = location;
  }

  const now = new Date();
  const alertRecord = {
    id: `alert_${uuidv4().substring(0, 8)}`,
    journeyId: journey.id,
    userId: journey.userId,
    userName: journey.userName,
    journeyType: journey.destinationType,
    alertType: 'manual_sos',
    timestamp: now.toISOString(),
    lastCheckinTime: journey.lastCheckinTime,
    location: journey.lastLocation,
    emergencyContacts: journey.emergencyContacts,
    notifiedContacts: true,
    notes: reason || 'User pressed 🆘 I NEED HELP during active SafeJourney'
  };

  store.journeyAlerts.unshift(alertRecord);

  // Log checkin state as help_requested
  store.journeyCheckins.unshift({
    id: `chk_${uuidv4().substring(0, 8)}`,
    journeyId: journey.id,
    timestamp: now.toISOString(),
    status: 'help_requested',
    location: journey.lastLocation,
    notes: 'Emergency assistance requested by traveller'
  });

  saveStore();

  console.log(`[SAFEJOURNEY SOS TRIGGERED] User: ${journey.userName}, Location: ${JSON.stringify(journey.lastLocation)}`);

  return res.status(201).json({
    success: true,
    alert: alertRecord,
    journey,
    message: 'Emergency alert sent. Emergency contacts are being notified.'
  });
});

// 5. Missed Safety Check Timeout (10-minute response window expired)
app.post('/api/safejourney/missed', (req, res) => {
  const { journeyId, location } = req.body;

  const journey = store.safeJourneys.find(j => j.id === journeyId);
  if (!journey) {
    return res.status(404).json({ error: 'Journey not found.' });
  }

  journey.status = 'alert_triggered';
  journey.missedCheckins += 1;
  journey.alertsCount += 1;
  if (location) {
    journey.lastLocation = location;
  }

  const now = new Date();
  const alertRecord = {
    id: `alert_${uuidv4().substring(0, 8)}`,
    journeyId: journey.id,
    userId: journey.userId,
    userName: journey.userName,
    journeyType: journey.destinationType,
    alertType: 'missed_checkin',
    timestamp: now.toISOString(),
    lastCheckinTime: journey.lastCheckinTime,
    location: journey.lastLocation,
    emergencyContacts: journey.emergencyContacts,
    notifiedContacts: true,
    notes: `${journey.userName} has not responded to the scheduled SafeJourney check-in.`
  };

  store.journeyAlerts.unshift(alertRecord);

  store.journeyCheckins.unshift({
    id: `chk_${uuidv4().substring(0, 8)}`,
    journeyId: journey.id,
    timestamp: now.toISOString(),
    status: 'missed',
    location: journey.lastLocation,
    notes: 'Scheduled check-in missed — safety alert generated'
  });

  saveStore();

  console.log(`[SAFEJOURNEY MISSED CHECK-IN ALERT] ${journey.userName} did not respond. Alert generated.`);

  return res.status(201).json({
    success: true,
    alert: alertRecord,
    journey,
    message: 'Missed check-in safety alert generated and trusted contacts notified.'
  });
});

// 6. End SafeJourney (🛑 END JOURNEY)
app.post('/api/safejourney/end', (req, res) => {
  const { journeyId } = req.body;

  const journey = store.safeJourneys.find(j => j.id === journeyId);
  if (!journey) {
    return res.status(404).json({ error: 'Journey not found.' });
  }

  const now = new Date();
  journey.status = 'completed';
  journey.endedAt = now.toISOString();

  store.journeyCheckins.unshift({
    id: `chk_${uuidv4().substring(0, 8)}`,
    journeyId: journey.id,
    timestamp: now.toISOString(),
    status: 'safe',
    location: journey.lastLocation,
    notes: 'SafeJourney ended safely by user'
  });

  saveStore();

  console.log(`[SAFEJOURNEY ENDED] ${journey.userName} ended journey ${journey.id}`);

  return res.json({
    success: true,
    journey,
    message: '✓ Journey completed safely.'
  });
});

// 7. SafeJourney History
app.get('/api/safejourney/history', optionalAuth, (req, res) => {
  const user = (req as any).user || store.profiles[0];
  const history = store.safeJourneys.filter(j => j.userId === user.id);

  return res.json({
    success: true,
    journeys: history
  });
});

// 8. SafeJourney Emergency Alerts Feed
app.get('/api/safejourney/alerts', (_req, res) => {
  return res.json({
    success: true,
    alerts: store.journeyAlerts
  });
});

// ============================================================
// RESET DEMO DATA
// ============================================================
app.post('/api/demo/reset-fictional-data', (_req, res) => {
  store.profiles = [JSON.parse(JSON.stringify(INITIAL_DEMO_PROFILE))];
  store.scanEvents = JSON.parse(JSON.stringify(INITIAL_SCAN_EVENTS));
  store.safeJourneys = JSON.parse(JSON.stringify(INITIAL_SAFE_JOURNEYS));
  store.journeyCheckins = JSON.parse(JSON.stringify(INITIAL_JOURNEY_CHECKINS));
  store.journeyAlerts = [];
  store.otpStore = {
    '+91 98450 11223': {
      otp: '123456',
      expiresAt: Date.now() + 86400000,
      verified: true
    }
  };
  store.sessions = {
    'demo-token-rahul': {
      userId: INITIAL_DEMO_PROFILE.id,
      expiresAt: Date.now() + 86400000
    }
  };
  saveStore();

  return res.json({
    success: true,
    message: 'Fictional demo data successfully reset to pristine state.',
    profile: INITIAL_DEMO_PROFILE
  });
});

app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`🚀 ResQTag API Server running on port ${PORT}`);
  console.log(`📌 Public Demo Tag: http://localhost:${PORT}/api/public/tag/RQ7K29`);
  console.log(`🌲 SafeJourney API: http://localhost:${PORT}/api/safejourney/active`);
  console.log(`=============================================`);
});
