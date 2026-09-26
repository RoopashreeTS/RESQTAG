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

interface DataStore {
  profiles: typeof INITIAL_DEMO_PROFILE[];
  scanEvents: typeof INITIAL_SCAN_EVENTS;
  otpStore: Record<string, { otp: string; expiresAt: number; verified: boolean }>;
  sessions: Record<string, { userId: string; expiresAt: number }>;
}

let store: DataStore = {
  profiles: [INITIAL_DEMO_PROFILE],
  scanEvents: [...INITIAL_SCAN_EVENTS],
  otpStore: {},
  sessions: {},
};

// Load or initialize store from disk
function loadStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      store = JSON.parse(data);
      // Ensure demo profile exists
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
  // Check uniqueness
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
    // Check fallback user id in header or demo query
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

// =================== ROUTES =================== //

// 1. Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'ResQTag Emergency Backend API',
    version: '1.0.0',
    profilesCount: store.profiles.length,
    scansCount: store.scanEvents.length,
    timestamp: new Date().toISOString()
  });
});

// 2. Auth: Send OTP
app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }

  // Safe Demo OTP: Always generate 6 digit code (default '123456' or random for realism)
  const otp = '123456';
  store.otpStore[phone] = {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
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
  // Allow demo OTP 123456 or stored OTP
  if (otp === '123456' || (record && record.otp === otp && record.expiresAt > Date.now())) {
    if (record) record.verified = true;
    
    // Check if user profile already exists for this phone
    let profile = store.profiles.find(p => p.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''));
    
    const token = `tok_${uuidv4()}`;
    if (profile) {
      store.sessions[token] = {
        userId: profile.id,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
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
  
  // Create active session token
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

// 6. Get Current User Profile (Owner Dashboard)
app.get('/api/profiles/me', authMiddleware, (req, res) => {
  const user = (req as any).user;
  res.json({
    success: true,
    profile: user
  });
});

// 7. Update Profile (Owner Dashboard) - Stable QR Guarantee!
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

  // IMPORTANT: Keep tagId, shortCode, id, and createdAt stable so the QR sticker never breaks!
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

// 8. Public Emergency Responder Lookup (Zero Auth Required!)
// Matches either Tag ID (e.g., "RQT-8829A4") or Short Code (e.g., "RQ7K29")
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

  // Return public emergency profile (exclude sensitive credentials)
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

  // Simulated notification payload for trusted contacts
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
    // Return all demo events for demo view
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

// 11. Reset / Seed Fictional Demo Data (1-Click for Hackathon judges)
app.post('/api/demo/reset-fictional-data', (_req, res) => {
  store.profiles = [JSON.parse(JSON.stringify(INITIAL_DEMO_PROFILE))];
  store.scanEvents = JSON.parse(JSON.stringify(INITIAL_SCAN_EVENTS));
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
  console.log(`=============================================`);
});
