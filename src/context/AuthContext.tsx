import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { 
  UserProfile, 
  DemoNotification, 
  SafeJourney, 
  JourneyAlert, 
  JourneyDestinationType,
  JourneyLocation
} from '../types';
import { api, INITIAL_DEMO_DATA } from '../services/api';

interface AuthContextType {
  profile: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  notifications: DemoNotification[];
  activeNotification: DemoNotification | null;
  activeJourney: SafeJourney | null;
  activeJourneyAlert: JourneyAlert | null;
  isCheckinPromptOpen: boolean;
  loginWithOtp: (phone: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  quickDemoLogin: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  logout: () => void;
  resetDemo: () => Promise<void>;
  dismissNotification: () => void;
  triggerSimulatedScanAlert: (notification: DemoNotification) => void;
  // SafeJourney actions
  startJourney: (params: {
    destinationType: JourneyDestinationType;
    customDestination?: string;
    isSolo: boolean;
    startTime: string;
    expectedEndTime: string;
    intervalMinutes: number;
    isDemoMode: boolean;
    demoIntervalSeconds?: number;
    initialLocation?: JourneyLocation;
  }) => Promise<{ success: boolean; journey?: SafeJourney; error?: string }>;
  checkinJourney: (location?: JourneyLocation, notes?: string) => Promise<boolean>;
  triggerJourneySos: (location?: JourneyLocation, reason?: string) => Promise<boolean>;
  triggerJourneyMissed: (location?: JourneyLocation) => Promise<boolean>;
  endJourney: () => Promise<boolean>;
  dismissJourneyAlert: () => void;
  setCheckinPromptOpen: (open: boolean) => void;
  refreshActiveJourney: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<DemoNotification[]>([]);
  const [activeNotification, setActiveNotification] = useState<DemoNotification | null>(null);
  
  // SafeJourney state
  const [activeJourney, setActiveJourney] = useState<SafeJourney | null>(null);
  const [activeJourneyAlert, setActiveJourneyAlert] = useState<JourneyAlert | null>(null);
  const [isCheckinPromptOpen, setIsCheckinPromptOpen] = useState(false);

  const refreshActiveJourney = useCallback(async () => {
    try {
      const res = await api.getActiveSafeJourney(token || undefined);
      if (res.success) {
        setActiveJourney(res.journey);
      }
    } catch (e) {
      console.error('Error refreshing active journey:', e);
    }
  }, [token]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('resqtag_auth_token');
        if (storedToken) {
          setToken(storedToken);
          const userProfile = await api.getProfile(storedToken);
          setProfile(userProfile || INITIAL_DEMO_DATA);
        }
        // Check active journey
        await refreshActiveJourney();
      } catch (err) {
        console.error('Failed to restore session:', err);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, [refreshActiveJourney]);

  const loginWithOtp = async (phone: string, otp: string) => {
    setIsLoading(true);
    try {
      const res = await api.verifyOtp(phone, otp);
      if (res.success && res.token) {
        setToken(res.token);
        if (res.profile) setProfile(res.profile);
        await refreshActiveJourney();
        return { success: true };
      }
      return { success: false, error: res.error || 'Verification failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const quickDemoLogin = async () => {
    setIsLoading(true);
    try {
      const res = await api.demoLogin();
      if (res.success) {
        setToken(res.token);
        setProfile(res.profile);
        await refreshActiveJourney();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!token) return false;
    setIsLoading(true);
    try {
      const res = await api.updateProfile(token, updates);
      if (res.success && res.profile) {
        setProfile(res.profile);
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('resqtag_auth_token');
    localStorage.removeItem('resqtag_current_profile');
    setToken(null);
    setProfile(null);
    setActiveJourney(null);
    setActiveJourneyAlert(null);
  };

  const resetDemo = async () => {
    setIsLoading(true);
    try {
      await api.resetDemoData();
      setToken('demo-token-rahul');
      setProfile(INITIAL_DEMO_DATA);
      setNotifications([]);
      setActiveNotification(null);
      setActiveJourney(null);
      setActiveJourneyAlert(null);
      setIsCheckinPromptOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const dismissNotification = () => {
    setActiveNotification(null);
  };

  const triggerSimulatedScanAlert = (notif: DemoNotification) => {
    setNotifications(prev => [notif, ...prev]);
    setActiveNotification(notif);
  };

  // SafeJourney actions
  const startJourney = async (params: {
    destinationType: JourneyDestinationType;
    customDestination?: string;
    isSolo: boolean;
    startTime: string;
    expectedEndTime: string;
    intervalMinutes: number;
    isDemoMode: boolean;
    demoIntervalSeconds?: number;
    initialLocation?: JourneyLocation;
  }) => {
    const res = await api.startSafeJourney(params, token || undefined);
    if (res.success && res.journey) {
      setActiveJourney(res.journey);
      setActiveJourneyAlert(null);
      return { success: true, journey: res.journey };
    }
    return { success: false, error: res.error || 'Failed to start journey' };
  };

  const checkinJourney = async (location?: JourneyLocation, notes?: string) => {
    if (!activeJourney) return false;
    const res = await api.checkinSafeJourney(activeJourney.id, location, notes);
    if (res.success && res.journey) {
      setActiveJourney(res.journey);
      setIsCheckinPromptOpen(false);
      return true;
    }
    return false;
  };

  const triggerJourneySos = async (location?: JourneyLocation, reason?: string) => {
    if (!activeJourney) return false;
    const res = await api.triggerSafeJourneySos(activeJourney.id, location, reason);
    if (res.success && res.alert) {
      setActiveJourneyAlert(res.alert);
      setIsCheckinPromptOpen(false);
      if (activeJourney) {
        setActiveJourney({ ...activeJourney, status: 'alert_triggered' });
      }
      return true;
    }
    return false;
  };

  const triggerJourneyMissed = async (location?: JourneyLocation) => {
    if (!activeJourney) return false;
    const res = await api.triggerSafeJourneyMissed(activeJourney.id, location);
    if (res.success && res.alert) {
      setActiveJourneyAlert(res.alert);
      setIsCheckinPromptOpen(false);
      if (activeJourney) {
        setActiveJourney({ ...activeJourney, status: 'alert_triggered' });
      }
      return true;
    }
    return false;
  };

  const endJourney = async () => {
    if (!activeJourney) return false;
    const res = await api.endSafeJourney(activeJourney.id);
    if (res.success) {
      setActiveJourney(null);
      setIsCheckinPromptOpen(false);
      return true;
    }
    return false;
  };

  const dismissJourneyAlert = () => {
    setActiveJourneyAlert(null);
  };

  return (
    <AuthContext.Provider
      value={{
        profile,
        token,
        isAuthenticated: !!token && !!profile,
        isLoading,
        notifications,
        activeNotification,
        activeJourney,
        activeJourneyAlert,
        isCheckinPromptOpen,
        loginWithOtp,
        quickDemoLogin,
        updateProfile,
        logout,
        resetDemo,
        dismissNotification,
        triggerSimulatedScanAlert,
        startJourney,
        checkinJourney,
        triggerJourneySos,
        triggerJourneyMissed,
        endJourney,
        dismissJourneyAlert,
        setCheckinPromptOpen: setIsCheckinPromptOpen,
        refreshActiveJourney,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
