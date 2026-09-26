import type { UserProfile, PublicEmergencyProfile, ScanEvent, DemoNotification } from '../types';

const API_BASE = '/api';

// Fallback in-memory/localStorage store for bulletproof demo resilience
const LOCAL_STORAGE_KEY_PROFILE = 'resqtag_current_profile';
const LOCAL_STORAGE_KEY_TOKEN = 'resqtag_auth_token';
const LOCAL_STORAGE_KEY_SCANS = 'resqtag_scan_events';
const LOCAL_STORAGE_KEY_NOTIFS = 'resqtag_notifications';

export const INITIAL_DEMO_DATA: UserProfile = {
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
  medicalInfo: 'Asthmatic (Carries blue Salbutamol inhaler in backpack). No cardiac history. Diabetic Type 2 (Diet controlled).',
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
      message: 'Demo OTP sent successfully',
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

    if (otp === '123456') {
      const token = 'demo-token-active';
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
      const profile = stored ? JSON.parse(stored) : INITIAL_DEMO_DATA;
      localStorage.setItem(LOCAL_STORAGE_KEY_TOKEN, token);
      localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(profile));
      return { success: true, token, profile, isNewUser: false };
    }
    return { success: false, error: 'Invalid OTP. Please use demo OTP: 123456' };
  },

  // 3. Demo 1-Click Login (For Judges)
  async demoLogin(): Promise<{ success: boolean; token: string; profile: UserProfile }> {
    try {
      const res = await fetch(`${API_BASE}/auth/demo-login`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(LOCAL_STORAGE_KEY_TOKEN, data.token);
        localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(data.profile));
        return data;
      }
    } catch (e) {
      console.warn('Backend unavailable, using local demoLogin', e);
    }

    const token = 'demo-token-rahul';
    localStorage.setItem(LOCAL_STORAGE_KEY_TOKEN, token);
    localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(INITIAL_DEMO_DATA));
    return { success: true, token, profile: INITIAL_DEMO_DATA };
  },

  // 4. Create Profile
  async createProfile(data: Partial<UserProfile>): Promise<{ success: boolean; token: string; profile: UserProfile; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (res.ok) {
        localStorage.setItem(LOCAL_STORAGE_KEY_TOKEN, resData.token);
        localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(resData.profile));
        return resData;
      }
      return { success: false, token: '', profile: null as any, error: resData.error || 'Failed to create profile' };
    } catch (e) {
      console.warn('Backend unavailable, creating local profile', e);
    }

    const newTagId = `RQT-${Math.random().toString(16).substring(2, 8).toUpperCase()}`;
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let newShortCode = 'RQ';
    for (let i = 0; i < 4; i++) newShortCode += chars.charAt(Math.floor(Math.random() * chars.length));

    const newProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      tagId: newTagId,
      shortCode: newShortCode,
      phone: data.phone || '+91 98765 00000',
      fullName: data.fullName || 'New Registered User',
      photoUrl: data.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      age: data.age || 25,
      bloodGroup: data.bloodGroup || 'O+',
      address: data.address || '',
      vehicleNumber: (data.vehicleNumber || 'KA-01-XX-0000').toUpperCase(),
      allergies: data.allergies || 'None reported',
      medicalInfo: data.medicalInfo || 'No major medical conditions',
      emergencyContacts: data.emergencyContacts || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const token = `tok_${Date.now()}`;
    localStorage.setItem(LOCAL_STORAGE_KEY_TOKEN, token);
    localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(newProfile));
    return { success: true, token, profile: newProfile };
  },

  // 5. Get Owner Profile
  async getProfile(token: string): Promise<UserProfile | null> {
    try {
      const res = await fetch(`${API_BASE}/profiles/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(data.profile));
          return data.profile;
        }
      }
    } catch (e) {
      console.warn('Backend unavailable, reading local profile', e);
    }
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
    return stored ? JSON.parse(stored) : INITIAL_DEMO_DATA;
  },

  // 6. Update Owner Profile (QR Code / Short Code remain invariant!)
  async updateProfile(token: string, updates: Partial<UserProfile>): Promise<{ success: boolean; profile: UserProfile; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/profiles/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(data.profile));
        return data;
      }
      return { success: false, profile: null as any, error: data.error || 'Failed to update profile' };
    } catch (e) {
      console.warn('Backend unavailable, updating local profile', e);
    }

    const stored = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
    const existing: UserProfile = stored ? JSON.parse(stored) : INITIAL_DEMO_DATA;
    const updated: UserProfile = {
      ...existing,
      ...updates,
      tagId: existing.tagId,
      shortCode: existing.shortCode,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(updated));
    return { success: true, profile: updated };
  },

  // 7. Public Responder Lookup by Tag ID or Short Code (Zero Auth!)
  async getPublicTag(identifier: string): Promise<{ success: boolean; profile?: PublicEmergencyProfile; error?: string }> {
    const cleanId = identifier.trim().toUpperCase();
    try {
      const res = await fetch(`${API_BASE}/public/tag/${encodeURIComponent(cleanId)}`);
      const data = await res.json();
      if (res.ok) {
        return data;
      }
      return { success: false, error: data.error || data.message || 'ResQTag not found' };
    } catch (e) {
      console.warn('Backend unavailable, checking local store for public tag', e);
    }

    const stored = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
    const localProfile: UserProfile = stored ? JSON.parse(stored) : INITIAL_DEMO_DATA;

    if (
      localProfile.tagId.toUpperCase() === cleanId ||
      localProfile.shortCode.toUpperCase() === cleanId ||
      cleanId === 'RQ7K29' ||
      cleanId === 'RQT-8829A4' ||
      cleanId.includes('RQ')
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
          allergies: localProfile.allergies,
          medicalInfo: localProfile.medicalInfo,
          emergencyContacts: localProfile.emergencyContacts,
          updatedAt: localProfile.updatedAt,
        },
      };
    }

    return {
      success: false,
      error: `No active emergency profile found for code: "${cleanId}". Please verify the short code or scan the QR code.`,
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
      {
        id: 'scan_init_2',
        tagId: 'RQT-8829A4',
        shortCode: 'RQ7K29',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        vehicleNumber: 'KA-01-AB-1234',
        scannerDevice: 'Mobile Browser (Chrome / Android)',
        locationStatus: 'Location not shared',
        latitude: null,
        longitude: null,
        approxLocation: 'Location not shared',
        notifiedContacts: true,
      },
    ];
  },

  // 10. Reset Demo Data
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
  },

  getPublicScanUrl(identifier: string): string {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://resqtag.app';
    return `${origin}/#scan/${identifier}`;
  },
};
