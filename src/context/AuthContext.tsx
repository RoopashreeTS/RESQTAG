import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, DemoNotification } from '../types';
import { api, INITIAL_DEMO_DATA } from '../services/api';

interface AuthContextType {
  profile: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  notifications: DemoNotification[];
  activeNotification: DemoNotification | null;
  loginWithOtp: (phone: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  quickDemoLogin: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  logout: () => void;
  resetDemo: () => Promise<void>;
  dismissNotification: () => void;
  triggerSimulatedScanAlert: (notification: DemoNotification) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<DemoNotification[]>([]);
  const [activeNotification, setActiveNotification] = useState<DemoNotification | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('resqtag_auth_token');
        if (storedToken) {
          setToken(storedToken);
          const userProfile = await api.getProfile(storedToken);
          setProfile(userProfile || INITIAL_DEMO_DATA);
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const loginWithOtp = async (phone: string, otp: string) => {
    setIsLoading(true);
    try {
      const res = await api.verifyOtp(phone, otp);
      if (res.success && res.token) {
        setToken(res.token);
        if (res.profile) setProfile(res.profile);
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
  };

  const resetDemo = async () => {
    setIsLoading(true);
    try {
      await api.resetDemoData();
      setToken('demo-token-rahul');
      setProfile(INITIAL_DEMO_DATA);
      setNotifications([]);
      setActiveNotification(null);
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

  return (
    <AuthContext.Provider
      value={{
        profile,
        token,
        isAuthenticated: !!token && !!profile,
        isLoading,
        notifications,
        activeNotification,
        loginWithOtp,
        quickDemoLogin,
        updateProfile,
        logout,
        resetDemo,
        dismissNotification,
        triggerSimulatedScanAlert,
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
