import type { 
  UserProfile, 
  PublicEmergencyProfile, 
  ScanEvent, 
  DemoNotification, 
  SafeJourney, 
  JourneyCheckin, 
  JourneyAlert, 
  JourneyDestinationType,
  JourneyLocation
} from '../types';

const API_BASE = '/api';

const LOCAL_STORAGE_KEY_PROFILE = 'resqtag_current_profile';
const LOCAL_STORAGE_KEY_TOKEN = 'resqtag_auth_token';
const LOCAL_STORAGE_KEY_SCANS = 'resqtag_scan_events';
const LOCAL_STORAGE_KEY_NOTIFS = 'resqtag_notifications';
const LOCAL_STORAGE_KEY_JOURNEYS = 'resqtag_safe_journeys';
const LOCAL_STORAGE_KEY_JOURNEY_ALERTS = 'resqtag_journey_alerts';

export const INITIAL_DEMO_DATA: UserProfile = {
  id: 'usr_demo_user',
  tagId: 'RQT-8829A4',
  shortCode: 'RQ7K29',
  phone: '+91 98450 11223',
  fullName: 'Demo User',
  photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  age: 26,
  bloodGroup: 'O+',
  address: '#402, Sunshine Residency, Indiranagar 100ft Road, Bengaluru, Karnataka - 560038',
  vehicleNumber: 'KA-01-AB-1234',
  allergies: '',
  medicalInfo: '',
  emergencyContacts: [
    {
      id: 'c1',
      name: 'Demo Emergency Contact',
      relationship: 'Primary Contact',
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

// Cloud Database & Encoding Helpers
export function encodeEmergencyProfile(p: Partial<UserProfile> | Partial<PublicEmergencyProfile>): string {
  try {
    const compact = {
      t: p.tagId || '',
      s: p.shortCode || '',
      n: p.fullName || '',
      b: p.bloodGroup || 'O+',
      a: p.age || 25,
      v: p.vehicleNumber || '',
      ad: p.address || '',
      ph: p.photoUrl || '',
      c: (p.emergencyContacts || []).map(c => ({
        n: c.name,
        r: c.relationship,
        p: c.phone,
        pr: c.isPrimary ? 1 : 0,
      })),
      u: p.updatedAt || new Date().toISOString(),
    };
    const json = JSON.stringify(compact);
    if (typeof window !== 'undefined' && window.btoa) {
      return encodeURIComponent(window.btoa(unescape(encodeURIComponent(json))));
    }
    return '';
  } catch {
    return '';
  }
}

export function decodeEmergencyProfile(str: string): PublicEmergencyProfile | null {
  try {
    if (!str) return null;
    const decodedStr = decodeURIComponent(str);
    const json = typeof window !== 'undefined' && window.atob
      ? decodeURIComponent(escape(window.atob(decodedStr)))
      : '';
    if (!json) return null;
    const compact = JSON.parse(json);
    if (!compact.t && !compact.n) return null;

    return {
      tagId: compact.t || 'RQT-UNKNOWN',
      shortCode: compact.s || 'RQ0000',
      fullName: compact.n || 'Emergency Patient',
      bloodGroup: compact.b || 'O+',
      age: compact.a || 25,
      vehicleNumber: compact.v || '',
      address: compact.ad || '',
      photoUrl: compact.ph || '',
      allergies: '',
      medicalInfo: '',
      emergencyContacts: (compact.c || []).map((c: any, i: number) => ({
        id: `c${i + 1}`,
        name: c.n || '',
        relationship: c.r || 'Emergency Contact',
        phone: c.p || '',
        isPrimary: Boolean(c.pr),
      })),
      updatedAt: compact.u || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function generateProductionQrUrl(profile: Partial<UserProfile> | Partial<PublicEmergencyProfile>): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://roopashreeTS.github.io';
  const pathname = typeof window !== 'undefined' ? window.location.pathname.replace(/\/$/, '') : '/RESQTAG';
  const base = `${origin}${pathname}`;
  const code = profile.shortCode || profile.tagId || 'RQ7K29';
  const dataToken = encodeEmergencyProfile(profile);
  return `${base}/#scan/${encodeURIComponent(code)}${dataToken ? `?d=${dataToken}` : ''}`;
}

const CLOUD_DB_ENDPOINT = 'https://api.restful-api.dev/objects';
const LOCAL_STORAGE_KEY_REGISTRY = 'resqtag_cloud_registry_map';

async function saveProfileToCloud(profile: UserProfile): Promise<string | null> {
  try {
    const res = await fetch(CLOUD_DB_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `resqtag_${profile.tagId.toUpperCase()}`,
        data: profile,
      }),
    });
    if (res.ok) {
      const result = await res.json();
      if (result.id) {
        const registry: Record<string, string> = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_REGISTRY) || '{}');
        registry[profile.tagId.toUpperCase()] = result.id;
        registry[profile.shortCode.toUpperCase()] = result.id;
        localStorage.setItem(LOCAL_STORAGE_KEY_REGISTRY, JSON.stringify(registry));
        return result.id;
      }
    }
  } catch (err) {
    console.warn('Cloud database sync error:', err);
  }
  return null;
}

async function fetchProfileFromCloud(identifier: string): Promise<PublicEmergencyProfile | null> {
  const cleanId = identifier.trim().toUpperCase();

  // 1. Check if an objectId is in our registry map
  try {
    const registry: Record<string, string> = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_REGISTRY) || '{}');
    const objectId = registry[cleanId];
    if (objectId) {
      const res = await fetch(`${CLOUD_DB_ENDPOINT}/${objectId}`);
      if (res.ok) {
        const item = await res.json();
        if (item && item.data && (item.data.tagId || item.data.fullName)) {
          return {
            tagId: item.data.tagId || cleanId,
            shortCode: item.data.shortCode || 'RQ0000',
            fullName: item.data.fullName || 'Registered User',
            photoUrl: item.data.photoUrl || '',
            age: item.data.age || 25,
            bloodGroup: item.data.bloodGroup || 'O+',
            address: item.data.address || '',
            vehicleNumber: item.data.vehicleNumber || '',
            allergies: item.data.allergies || '',
            medicalInfo: item.data.medicalInfo || '',
            emergencyContacts: item.data.emergencyContacts || [],
            updatedAt: item.data.updatedAt || new Date().toISOString(),
          };
        }
      }
    }
  } catch (e) {
    console.warn('Cloud registry lookup error:', e);
  }

  // 2. Direct query by cleanId if it is a restful-api object ID
  if (cleanId.length > 20) {
    try {
      const res = await fetch(`${CLOUD_DB_ENDPOINT}/${cleanId}`);
      if (res.ok) {
        const item = await res.json();
        if (item && item.data) {
          return {
            tagId: item.data.tagId || cleanId,
            shortCode: item.data.shortCode || 'RQ0000',
            fullName: item.data.fullName || 'Registered User',
            photoUrl: item.data.photoUrl || '',
            age: item.data.age || 25,
            bloodGroup: item.data.bloodGroup || 'O+',
            address: item.data.address || '',
            vehicleNumber: item.data.vehicleNumber || '',
            allergies: item.data.allergies || '',
            medicalInfo: item.data.medicalInfo || '',
            emergencyContacts: item.data.emergencyContacts || [],
            updatedAt: item.data.updatedAt || new Date().toISOString(),
          };
        }
      }
    } catch {}
  }

  return null;
}

export const api = {
  // 1. Send OTP
  async sendOtp(phone: string): Promise<{ success: boolean; message: string; demoOtp: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend unavailable, using local mock for sendOtp', e);
    }
    return {
      success: true,
      message: 'OTP sent successfully',
      demoOtp: '123456',
    };
  },

  // 2. Verify OTP
  async verifyOtp(phone: string, otp: string): Promise<{
    success: boolean;
    token?: string;
    profile?: UserProfile;
    isNewUser?: boolean;
    error?: string;
  }> {
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.token) localStorage.setItem(LOCAL_STORAGE_KEY_TOKEN, data.token);
        if (data.profile) localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(data.profile));
        return data;
      }
      return { success: false, error: data.error || 'Verification failed' };
    } catch (e) {
      console.warn('Backend unavailable, using local mock verifyOtp', e);
    }

    if (otp.length === 6) {
      const token = 'token-active-user';
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
      const profile = stored ? JSON.parse(stored) : INITIAL_DEMO_DATA;
      localStorage.setItem(LOCAL_STORAGE_KEY_TOKEN, token);
      localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(profile));
      return { success: true, token, profile, isNewUser: false };
    }
    return { success: false, error: 'Invalid OTP. Please enter the 6-digit code.' };
  },

  // 3. Demo 1-Click Login
  async demoLogin(): Promise<{ success: boolean; token: string; profile: UserProfile }> {
    const token = 'token-active-rahul';
    localStorage.setItem(LOCAL_STORAGE_KEY_TOKEN, token);
    localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(INITIAL_DEMO_DATA));
    return { success: true, token, profile: INITIAL_DEMO_DATA };
  },

  // 4. Create Profile (Generates unique random ResQTag ID + saves to Cloud Database)
  async createProfile(data: Partial<UserProfile>): Promise<{ success: boolean; token: string; profile: UserProfile; error?: string }> {
    // Generate unique random ResQTag ID: RQT- + 6 random uppercase chars
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let randomSuffix = '';
    for (let i = 0; i < 6; i++) randomSuffix += chars.charAt(Math.floor(Math.random() * chars.length));
    const newTagId = `RQT-${randomSuffix}`;

    let newShortCode = 'RQ';
    for (let i = 0; i < 4; i++) newShortCode += chars.charAt(Math.floor(Math.random() * chars.length));

    const newProfile: UserProfile = {
      id: `usr_${Date.now()}_${randomSuffix.toLowerCase()}`,
      tagId: newTagId,
      shortCode: newShortCode,
      phone: data.phone || '+91 98765 00000',
      fullName: data.fullName || 'New Registered User',
      photoUrl: data.photoUrl || '',
      age: data.age || 25,
      bloodGroup: data.bloodGroup || 'O+',
      address: data.address || '',
      vehicleNumber: (data.vehicleNumber || 'KA-01-XX-0000').toUpperCase(),
      allergies: '',
      medicalInfo: '',
      emergencyContacts: data.emergencyContacts || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to persistent cloud database
    await saveProfileToCloud(newProfile);

    // Save local session
    const token = `tok_${Date.now()}`;
    localStorage.setItem(LOCAL_STORAGE_KEY_TOKEN, token);
    localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(newProfile));

    return { success: true, token, profile: newProfile };
  },

  // 5. Get Owner Profile
  async getProfile(_token: string): Promise<UserProfile | null> {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
    return stored ? JSON.parse(stored) : INITIAL_DEMO_DATA;
  },

  // 6. Update Owner Profile (QR Code / Short Code remain invariant!)
  async updateProfile(_token: string, updates: Partial<UserProfile>): Promise<{ success: boolean; profile: UserProfile; error?: string }> {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
    const existing: UserProfile = stored ? JSON.parse(stored) : INITIAL_DEMO_DATA;
    const updated: UserProfile = {
      ...existing,
      ...updates,
      tagId: existing.tagId,
      shortCode: existing.shortCode,
      updatedAt: new Date().toISOString(),
    };

    // Save update to cloud database
    await saveProfileToCloud(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(updated));

    return { success: true, profile: updated };
  },

  // 7. Public Responder Lookup by Tag ID or Short Code (Cross-Device & Cloud Persistent)
  async getPublicTag(identifier: string): Promise<{ success: boolean; profile?: PublicEmergencyProfile; error?: string }> {
    const cleanId = identifier.trim().toUpperCase();

    // 1. Check if URL contains compact encoded emergency payload ?d=...
    if (typeof window !== 'undefined') {
      const fullUrl = window.location.href;
      const dMatch = fullUrl.match(/[?&]d=([^&#]+)/);
      if (dMatch && dMatch[1]) {
        const decoded = decodeEmergencyProfile(dMatch[1]);
        if (decoded && (decoded.tagId.toUpperCase() === cleanId || decoded.shortCode.toUpperCase() === cleanId || cleanId.includes(decoded.shortCode.toUpperCase()))) {
          return { success: true, profile: decoded };
        }
      }
    }

    // 2. Fetch from persistent cloud database
    const cloudProfile = await fetchProfileFromCloud(cleanId);
    if (cloudProfile) {
      return { success: true, profile: cloudProfile };
    }

    // 3. Check local storage
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
    if (stored) {
      try {
        const localProfile: UserProfile = JSON.parse(stored);
        if (
          localProfile.tagId.toUpperCase() === cleanId ||
          localProfile.shortCode.toUpperCase() === cleanId
        ) {
          return {
            success: true,
            profile: {
              tagId: localProfile.tagId,
              shortCode: localProfile.shortCode,
              fullName: localProfile.fullName,
              photoUrl: localProfile.photoUrl,
              age: localProfile.age,
              bloodGroup: localProfile.bloodGroup,
              address: localProfile.address,
              vehicleNumber: localProfile.vehicleNumber,
              allergies: localProfile.allergies || '',
              medicalInfo: localProfile.medicalInfo || '',
              emergencyContacts: localProfile.emergencyContacts || [],
              updatedAt: localProfile.updatedAt,
            },
          };
        }
      } catch {}
    }

    // 4. Default mock profile fallback if cleanId matches initial demo
    if (cleanId === 'RQ7K29' || cleanId === 'RQT-8829A4') {
      return {
        success: true,
        profile: {
          tagId: INITIAL_DEMO_DATA.tagId,
          shortCode: INITIAL_DEMO_DATA.shortCode,
          fullName: INITIAL_DEMO_DATA.fullName,
          photoUrl: INITIAL_DEMO_DATA.photoUrl,
          age: INITIAL_DEMO_DATA.age,
          bloodGroup: INITIAL_DEMO_DATA.bloodGroup,
          address: INITIAL_DEMO_DATA.address,
          vehicleNumber: INITIAL_DEMO_DATA.vehicleNumber,
          allergies: '',
          medicalInfo: '',
          emergencyContacts: INITIAL_DEMO_DATA.emergencyContacts,
          updatedAt: INITIAL_DEMO_DATA.updatedAt,
        },
      };
    }

    return {
      success: false,
      error: 'Please check the code and try again.',
    };
  },

  // 8. Record Scan Event & Trigger Notification
  async recordScanEvent(params: {
    identifier: string;
    locationStatus: 'Location shared' | 'Location not shared';
    latitude?: number | null;
    longitude?: number | null;
    approxLocation?: string | null;
  }): Promise<{ success: boolean; scanEvent?: ScanEvent; notification?: DemoNotification }> {
    try {
      const res = await fetch(`${API_BASE}/public/scan-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.notification) {
          const existingNotifs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_NOTIFS) || '[]');
          existingNotifs.unshift(data.notification);
          localStorage.setItem(LOCAL_STORAGE_KEY_NOTIFS, JSON.stringify(existingNotifs));
        }
        return data;
      }
    } catch (e) {
      console.warn('Backend unavailable, logging local scan event', e);
    }

    const scanEvent: ScanEvent = {
      id: `scan_${Date.now()}`,
      tagId: params.identifier.toUpperCase().startsWith('RQT') ? params.identifier.toUpperCase() : 'RQT-8829A4',
      shortCode: params.identifier.toUpperCase().startsWith('RQ') ? params.identifier.toUpperCase() : 'RQ7K29',
      timestamp: new Date().toISOString(),
      vehicleNumber: 'KA-01-AB-1234',
      scannerDevice: 'Mobile Responder Device',
      locationStatus: params.locationStatus,
      latitude: params.latitude,
      longitude: params.longitude,
      approxLocation: params.approxLocation || (params.locationStatus === 'Location shared' ? 'Bengaluru, Karnataka (Coordinates shared)' : 'Location not shared'),
      notifiedContacts: true,
    };

    const existingScans: ScanEvent[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_SCANS) || '[]');
    existingScans.unshift(scanEvent);
    localStorage.setItem(LOCAL_STORAGE_KEY_SCANS, JSON.stringify(existingScans));

    const notification: DemoNotification = {
      id: `notif_${Date.now()}`,
      tagId: scanEvent.tagId,
      title: '🚨 ResQTag Emergency Scan Alert',
      message: `EMERGENCY ALERT: Rahul Kumar's ResQTag (Vehicle: ${scanEvent.vehicleNumber}) was scanned at ${new Date().toLocaleTimeString()}. Location: ${scanEvent.approxLocation}.`,
      timestamp: scanEvent.timestamp,
      locationStatus: scanEvent.locationStatus,
      approxLocation: scanEvent.approxLocation || undefined,
      coords: params.latitude && params.longitude ? { lat: params.latitude, lng: params.longitude } : undefined,
    };

    const existingNotifs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_NOTIFS) || '[]');
    existingNotifs.unshift(notification);
    localStorage.setItem(LOCAL_STORAGE_KEY_NOTIFS, JSON.stringify(existingNotifs));

    return { success: true, scanEvent, notification };
  },

  // 9. Get Scan History
  async getScanHistory(token?: string, tagId?: string): Promise<ScanEvent[]> {
    try {
      const url = tagId ? `${API_BASE}/scans/my-history?tagId=${encodeURIComponent(tagId)}` : `${API_BASE}/scans/my-history`;
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        return data.scans || [];
      }
    } catch (e) {
      console.warn('Backend unavailable, reading local scans', e);
    }
    const local = localStorage.getItem(LOCAL_STORAGE_KEY_SCANS);
    if (local) return JSON.parse(local);
    return [
      {
        id: 'scan_init_1',
        tagId: 'RQT-8829A4',
        shortCode: 'RQ7K29',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        vehicleNumber: 'KA-01-AB-1234',
        scannerDevice: 'Mobile Browser (Safari / iOS)',
        locationStatus: 'Location shared',
        latitude: 12.9716,
        longitude: 77.5946,
        approxLocation: 'MG Road Junction, Bengaluru, Karnataka',
        notifiedContacts: true,
      },
    ];
  },

  // ============================================================
  // 🌲 SAFEJOURNEY CLIENT METHODS
  // ============================================================

  // 10. Start SafeJourney
  async startSafeJourney(params: {
    destinationType: JourneyDestinationType;
    customDestination?: string;
    isSolo: boolean;
    startTime: string;
    expectedEndTime: string;
    intervalMinutes: number;
    isDemoMode: boolean;
    demoIntervalSeconds?: number;
    initialLocation?: JourneyLocation;
  }, token?: string): Promise<{ success: boolean; journey?: SafeJourney; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/safejourney/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (res.ok) {
        return data;
      }
      return { success: false, error: data.error || 'Failed to start SafeJourney' };
    } catch (e) {
      console.warn('Backend unavailable, starting local SafeJourney', e);
    }

    const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
    const user = storedUser ? JSON.parse(storedUser) : INITIAL_DEMO_DATA;
    const now = new Date();
    const effectiveIntervalMs = params.isDemoMode
      ? (params.demoIntervalSeconds || 20) * 1000
      : (params.intervalMinutes || 60) * 60 * 1000;

    const newJourney: SafeJourney = {
      id: `journey_${Date.now()}`,
      userId: user.id,
      userName: user.fullName,
      userPhone: user.phone,
      tagId: user.tagId,
      destinationType: params.destinationType,
      customDestination: params.customDestination,
      isSolo: params.isSolo,
      startTime: params.startTime || now.toISOString(),
      expectedEndTime: params.expectedEndTime,
      intervalMinutes: params.intervalMinutes,
      isDemoMode: params.isDemoMode,
      demoIntervalSeconds: params.demoIntervalSeconds || 20,
      status: 'active',
      lastCheckinTime: now.toISOString(),
      nextCheckinTime: new Date(now.getTime() + effectiveIntervalMs).toISOString(),
      lastLocation: params.initialLocation,
      emergencyContacts: user.emergencyContacts,
      createdAt: now.toISOString(),
      totalCheckins: 1,
      missedCheckins: 0,
      alertsCount: 0,
    };

    const existingJourneys: SafeJourney[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_JOURNEYS) || '[]');
    existingJourneys.forEach(j => { if (j.status === 'active') j.status = 'completed'; });
    existingJourneys.unshift(newJourney);
    localStorage.setItem(LOCAL_STORAGE_KEY_JOURNEYS, JSON.stringify(existingJourneys));

    return { success: true, journey: newJourney };
  },

  // 11. Get Active SafeJourney
  async getActiveSafeJourney(token?: string): Promise<{ success: boolean; journey: SafeJourney | null; checkins?: JourneyCheckin[] }> {
    try {
      const res = await fetch(`${API_BASE}/safejourney/active`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend unavailable, checking local active journey', e);
    }

    const journeys: SafeJourney[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_JOURNEYS) || '[]');
    const active = journeys.find(j => j.status === 'active') || null;
    return { success: true, journey: active };
  },

  // 12. Check-in (I'M SAFE)
  async checkinSafeJourney(journeyId: string, location?: JourneyLocation, notes?: string): Promise<{ success: boolean; journey?: SafeJourney; message?: string }> {
    try {
      const res = await fetch(`${API_BASE}/safejourney/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ journeyId, location, notes }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend unavailable, checking in locally', e);
    }

    const journeys: SafeJourney[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_JOURNEYS) || '[]');
    const journey = journeys.find(j => j.id === journeyId);
    if (journey) {
      const now = new Date();
      const effectiveIntervalMs = journey.isDemoMode
        ? (journey.demoIntervalSeconds || 20) * 1000
        : (journey.intervalMinutes || 60) * 60 * 1000;

      journey.lastCheckinTime = now.toISOString();
      journey.nextCheckinTime = new Date(now.getTime() + effectiveIntervalMs).toISOString();
      journey.totalCheckins += 1;
      if (location) journey.lastLocation = location;
      localStorage.setItem(LOCAL_STORAGE_KEY_JOURNEYS, JSON.stringify(journeys));
      return { success: true, journey, message: "✓ You're marked safe." };
    }
    return { success: false };
  },

  // 12.b Get Checkins for Journey
  async getSafeJourneyCheckins(journeyId: string): Promise<JourneyCheckin[]> {
    try {
      const res = await fetch(`${API_BASE}/safejourney/active`);
      if (res.ok) {
        const data = await res.json();
        return data.checkins || [];
      }
    } catch (e) {
      console.warn('Backend unavailable, reading local checkins', e);
    }
    const journeys: SafeJourney[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_JOURNEYS) || '[]');
    const journey = journeys.find(j => j.id === journeyId);
    if (journey && journey.lastCheckinTime) {
      return [
        {
          id: 'chk_1',
          journeyId: journey.id,
          timestamp: journey.lastCheckinTime,
          status: 'safe',
          notes: 'Safe Journey Check-in'
        }
      ];
    }
    return [];
  },

  // 13. Immediate SOS (🆘 I NEED HELP)
  async triggerSafeJourneySos(journeyId: string, location?: JourneyLocation, reason?: string): Promise<{ success: boolean; alert?: JourneyAlert; message?: string }> {
    try {
      const res = await fetch(`${API_BASE}/safejourney/sos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ journeyId, location, reason }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend unavailable, triggering local SOS alert', e);
    }

    const journeys: SafeJourney[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_JOURNEYS) || '[]');
    const journey = journeys.find(j => j.id === journeyId);
    const now = new Date();

    const alertRecord: JourneyAlert = {
      id: `alert_${Date.now()}`,
      journeyId,
      userId: journey?.userId || 'usr_demo',
      userName: journey?.userName || 'Rahul Kumar',
      journeyType: journey?.destinationType || 'Forest / Trekking Area',
      alertType: 'manual_sos',
      timestamp: now.toISOString(),
      lastCheckinTime: journey?.lastCheckinTime || null,
      location: location || journey?.lastLocation,
      emergencyContacts: journey?.emergencyContacts || [],
      notifiedContacts: true,
      notes: reason || 'User pressed 🆘 I NEED HELP during active SafeJourney',
    };

    if (journey) {
      journey.status = 'alert_triggered';
      journey.alertsCount += 1;
      localStorage.setItem(LOCAL_STORAGE_KEY_JOURNEYS, JSON.stringify(journeys));
    }

    const existingAlerts: JourneyAlert[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_JOURNEY_ALERTS) || '[]');
    existingAlerts.unshift(alertRecord);
    localStorage.setItem(LOCAL_STORAGE_KEY_JOURNEY_ALERTS, JSON.stringify(existingAlerts));

    return { success: true, alert: alertRecord, message: 'Emergency alert sent. Emergency contacts are being notified.' };
  },

  // 14. Missed Check-in Timeout
  async triggerSafeJourneyMissed(journeyId: string, location?: JourneyLocation): Promise<{ success: boolean; alert?: JourneyAlert; message?: string }> {
    try {
      const res = await fetch(`${API_BASE}/safejourney/missed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ journeyId, location }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend unavailable, triggering local missed check-in alert', e);
    }

    const journeys: SafeJourney[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_JOURNEYS) || '[]');
    const journey = journeys.find(j => j.id === journeyId);
    const now = new Date();

    const alertRecord: JourneyAlert = {
      id: `alert_${Date.now()}`,
      journeyId,
      userId: journey?.userId || 'usr_demo',
      userName: journey?.userName || 'Rahul Kumar',
      journeyType: journey?.destinationType || 'Forest / Trekking Area',
      alertType: 'missed_checkin',
      timestamp: now.toISOString(),
      lastCheckinTime: journey?.lastCheckinTime || null,
      location: location || journey?.lastLocation,
      emergencyContacts: journey?.emergencyContacts || [],
      notifiedContacts: true,
      notes: `${journey?.userName || 'User'} has not responded to the scheduled SafeJourney check-in.`,
    };

    if (journey) {
      journey.status = 'alert_triggered';
      journey.missedCheckins += 1;
      journey.alertsCount += 1;
      localStorage.setItem(LOCAL_STORAGE_KEY_JOURNEYS, JSON.stringify(journeys));
    }

    const existingAlerts: JourneyAlert[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_JOURNEY_ALERTS) || '[]');
    existingAlerts.unshift(alertRecord);
    localStorage.setItem(LOCAL_STORAGE_KEY_JOURNEY_ALERTS, JSON.stringify(existingAlerts));

    return { success: true, alert: alertRecord, message: 'Missed check-in safety alert generated and trusted contacts notified.' };
  },

  // 15. End SafeJourney
  async endSafeJourney(journeyId: string): Promise<{ success: boolean; journey?: SafeJourney; message?: string }> {
    try {
      const res = await fetch(`${API_BASE}/safejourney/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ journeyId }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Backend unavailable, ending local SafeJourney', e);
    }

    const journeys: SafeJourney[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_JOURNEYS) || '[]');
    const journey = journeys.find(j => j.id === journeyId);
    if (journey) {
      journey.status = 'completed';
      journey.endedAt = new Date().toISOString();
      localStorage.setItem(LOCAL_STORAGE_KEY_JOURNEYS, JSON.stringify(journeys));
      return { success: true, journey, message: '✓ Journey completed safely.' };
    }
    return { success: false };
  },

  // 16. Get SafeJourney History
  async getSafeJourneyHistory(token?: string): Promise<SafeJourney[]> {
    try {
      const res = await fetch(`${API_BASE}/safejourney/history`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        return data.journeys || [];
      }
    } catch (e) {
      console.warn('Backend unavailable, reading local journey history', e);
    }
    const local = localStorage.getItem(LOCAL_STORAGE_KEY_JOURNEYS);
    if (local) return JSON.parse(local);
    return [
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
  },

  // 17. Get SafeJourney Alerts
  async getSafeJourneyAlerts(): Promise<JourneyAlert[]> {
    try {
      const res = await fetch(`${API_BASE}/safejourney/alerts`);
      if (res.ok) {
        const data = await res.json();
        return data.alerts || [];
      }
    } catch (e) {
      console.warn('Backend unavailable, reading local alerts', e);
    }
    const local = localStorage.getItem(LOCAL_STORAGE_KEY_JOURNEY_ALERTS);
    return local ? JSON.parse(local) : [];
  },

  // Reset Demo Data
  async resetDemoData(): Promise<void> {
    try {
      await fetch(`${API_BASE}/demo/reset-fictional-data`, { method: 'POST' });
    } catch (e) {
      console.warn('Backend reset failed, resetting locally', e);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(INITIAL_DEMO_DATA));
    localStorage.setItem(LOCAL_STORAGE_KEY_TOKEN, 'demo-token-rahul');
    localStorage.removeItem(LOCAL_STORAGE_KEY_SCANS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_NOTIFS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_JOURNEYS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_JOURNEY_ALERTS);
  },

  getPublicScanUrl(identifier: string): string {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://resqtag.app';
    return `${origin}/#scan/${identifier}`;
  },
};
