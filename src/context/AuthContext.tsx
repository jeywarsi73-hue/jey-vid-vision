// JEY VID VISION - Admin Authentication & Owner Security Context
// Implements Supabase Authentication + Cryptographic PIN Verification & Protected Route Guard

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConnected, hashSecurityPin } from '../lib/supabase';
import { AdminProfile } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  isPinVerified: boolean;
  adminProfile: AdminProfile | null;
  loading: boolean;
  loginWithPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string; requirePin?: boolean }>;
  verifyPin: (pin: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updatePin: (newPin: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  isOwner: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default owner fallback for initial setup and preview demonstration
const DEFAULT_OWNER_PROFILE: AdminProfile = {
  id: 'owner-profile-1',
  user_id: 'owner-user-1',
  email: 'jeywarsi73@gmail.com', // User's requested admin account
  role: 'owner',
  // Default PIN hash for '1234' (SHA-256)
  pin_hash: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isPinVerified, setIsPinVerified] = useState<boolean>(false);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isSupabaseConnected() && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Check admin profile
            const { data: profile } = await supabase
              .from('admin_profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .maybeSingle();

            if (profile) {
              setAdminProfile(profile);
              setIsAuthenticated(true);
              const pinStatus = sessionStorage.getItem('jey_pin_verified') === 'true';
              setIsPinVerified(pinStatus);
              setLoading(false);
              return;
            }
          }
        }

        // Local session recovery
        const savedAuth = sessionStorage.getItem('jey_admin_session');
        const savedPin = sessionStorage.getItem('jey_pin_verified') === 'true';

        if (savedAuth) {
          const parsed = JSON.parse(savedAuth);
          setAdminProfile(parsed);
          setIsAuthenticated(true);
          setIsPinVerified(savedPin);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const loginWithPassword = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (isSupabaseConnected() && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim()
        });

        if (error) {
          setLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const { data: profile } = await supabase
            .from('admin_profiles')
            .select('*')
            .eq('user_id', data.user.id)
            .maybeSingle();

          const activeProfile: AdminProfile = profile || {
            id: 'admin-' + data.user.id,
            user_id: data.user.id,
            email: data.user.email || email,
            role: 'owner'
          };

          setAdminProfile(activeProfile);
          setIsAuthenticated(true);
          sessionStorage.setItem('jey_admin_session', JSON.stringify(activeProfile));
          setLoading(false);
          return { success: true, requirePin: true };
        }
      }

      // Standalone / Preview Owner Auth check
      // Allows owner to sign in with their email and access the portal
      const customPassword = localStorage.getItem('jey_custom_admin_password');
      const isPasswordValid = customPassword ? password === customPassword : password.length >= 6;

      if (
        (email.trim().toLowerCase() === 'jeywarsi73@gmail.com' || email.trim().toLowerCase() === 'admin@jeyvidvision.com')
      ) {
        if (!isPasswordValid) {
          setLoading(false);
          return { success: false, error: 'Incorrect password. Please enter your newly set password.' };
        }

        const profile: AdminProfile = {
          ...DEFAULT_OWNER_PROFILE,
          email: email.trim().toLowerCase()
        };
        setAdminProfile(profile);
        setIsAuthenticated(true);
        sessionStorage.setItem('jey_admin_session', JSON.stringify(profile));
        setLoading(false);
        return { success: true, requirePin: true };
      }

      setLoading(false);
      return { 
        success: false, 
        error: 'Invalid credentials. Only the authorized owner account can access the Admin Panel.' 
      };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const verifyPin = async (pin: string) => {
    try {
      const hashed = await hashSecurityPin(pin);

      // Check stored custom PIN or default PIN
      const storedCustomPinHash = localStorage.getItem('jey_owner_pin_hash');
      const targetHash = storedCustomPinHash || adminProfile?.pin_hash || DEFAULT_OWNER_PROFILE.pin_hash;

      if (hashed === targetHash) {
        setIsPinVerified(true);
        sessionStorage.setItem('jey_pin_verified', 'true');
        return { success: true };
      }

      return { success: false, error: 'Incorrect Security PIN. Please try again.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Verification failed' };
    }
  };

  const updatePin = async (newPin: string) => {
    if (newPin.length < 4) {
      return { success: false, error: 'PIN must be at least 4 digits.' };
    }
    const hashed = await hashSecurityPin(newPin);
    localStorage.setItem('jey_owner_pin_hash', hashed);
    if (adminProfile) {
      setAdminProfile({ ...adminProfile, pin_hash: hashed });
    }
    return { success: true };
  };

  const updatePassword = async (newPassword: string) => {
    if (!newPassword || newPassword.trim().length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }

    try {
      if (isSupabaseConnected() && supabase) {
        const { error } = await supabase.auth.updateUser({
          password: newPassword.trim()
        });

        if (error) {
          return { success: false, error: error.message };
        }
      }

      // Store in local storage for preview/standalone sync
      localStorage.setItem('jey_custom_admin_password', newPassword.trim());
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update password' };
    }
  };

  const logout = async () => {
    try {
      if (isSupabaseConnected() && supabase) {
        await supabase.auth.signOut();
      }
    } finally {
      setIsAuthenticated(false);
      setIsPinVerified(false);
      setAdminProfile(null);
      sessionStorage.removeItem('jey_admin_session');
      sessionStorage.removeItem('jey_pin_verified');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isPinVerified,
        adminProfile,
        loading,
        loginWithPassword,
        verifyPin,
        logout,
        updatePin,
        updatePassword,
        isOwner: adminProfile?.role === 'owner'
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
