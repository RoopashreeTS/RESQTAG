export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary?: boolean;
}

export interface UserProfile {
  id: string;
  tagId: string;           // E.g., "RQT-9842A1"
  shortCode: string;       // E.g., "RQ7K29" (6-character backup code)
  phone: string;
  fullName: string;
  photoUrl?: string;
  age: number | string;
  bloodGroup: BloodGroup | string;
  address: string;
  vehicleNumber: string;   // E.g., "KA-01-AB-1234"
  allergies: string;
  medicalInfo: string;
  emergencyContacts: EmergencyContact[];
  createdAt: string;
  updatedAt: string;
}

export interface PublicEmergencyProfile {
  tagId: string;
  shortCode: string;
  fullName: string;
  photoUrl?: string;
  age: number | string;
  bloodGroup: BloodGroup | string;
  address: string;
  vehicleNumber: string;
  allergies: string;
  medicalInfo: string;
  emergencyContacts: EmergencyContact[];
  updatedAt: string;
}

export interface ScanEvent {
  id: string;
  tagId: string;
  shortCode: string;
  timestamp: string;
  vehicleNumber: string;
  scannerDevice: string;
  locationStatus: 'Location shared' | 'Location not shared';
  latitude?: number | null;
  longitude?: number | null;
  approxLocation?: string | null;
  notifiedContacts: boolean;
}

export interface AuthState {
  token: string | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
}

export interface DemoNotification {
  id: string;
  tagId: string;
  title: string;
  message: string;
  timestamp: string;
  locationStatus: string;
  approxLocation?: string;
  coords?: { lat: number; lng: number };
}

// ==========================================
// 🌲 RESQTAG SAFEJOURNEY TYPES
// ==========================================

export type JourneyDestinationType =
  | 'Forest / Trekking Area'
  | 'Hill / Mountain Area'
  | 'Camping Area'
  | 'Remote / Isolated Area'
  | 'Long-Distance Travel'
  | 'Other';

export interface JourneyLocation {
  status: 'Location shared' | 'Location not shared' | 'Location unavailable — permission was not granted';
  lat?: number | null;
  lng?: number | null;
  text?: string | null;
}

export interface SafeJourney {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  tagId: string;
  destinationType: JourneyDestinationType;
  customDestination?: string;
  isSolo: boolean;
  startTime: string;
  expectedEndTime: string;
  intervalMinutes: number;
  isDemoMode: boolean;
  demoIntervalSeconds?: number;
  status: 'active' | 'completed' | 'alert_triggered';
  lastCheckinTime: string | null;
  nextCheckinTime: string;
  lastLocation?: JourneyLocation;
  emergencyContacts: EmergencyContact[];
  createdAt: string;
  endedAt?: string | null;
  totalCheckins: number;
  missedCheckins: number;
  alertsCount: number;
}

export interface JourneyCheckin {
  id: string;
  journeyId: string;
  timestamp: string;
  status: 'safe' | 'missed' | 'help_requested';
  location?: JourneyLocation;
  notes?: string;
}

export interface JourneyAlert {
  id: string;
  journeyId: string;
  userId: string;
  userName: string;
  journeyType: string;
  alertType: 'missed_checkin' | 'manual_sos';
  timestamp: string;
  lastCheckinTime: string | null;
  location?: JourneyLocation;
  emergencyContacts: EmergencyContact[];
  notifiedContacts: boolean;
  notes?: string;
}
