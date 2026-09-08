import { create } from 'zustand';
import { AdminRole, AdminUser } from '@/types/auth';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthStore {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (profile: { fullName?: string; phoneNumber?: string; email?: string; avatarUrl?: string }) => Promise<{ success: boolean; message: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

// Single Authoritative Super Administrator Profile
export const DEFAULT_ADMIN_USER: AdminUser = {
  id: 'usr-tum-admin-001',
  email: 'admin@cityride.tumakuru.gov.in',
  fullName: 'Shankar Gowda',
  role: 'SUPER_ADMIN',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  phoneNumber: '+91 98450 12345',
  isActive: true,
  createdAt: '2026-01-15T08:30:00Z',
  lastLoginAt: new Date().toISOString(),
};

// Backward compatibility map
export const MOCK_ADMIN_USERS: Record<AdminRole, AdminUser> = {
  SUPER_ADMIN: DEFAULT_ADMIN_USER,
  OPERATIONS_MANAGER: DEFAULT_ADMIN_USER,
  DISPATCHER: DEFAULT_ADMIN_USER,
  FLEET_MANAGER: DEFAULT_ADMIN_USER,
  SUPPORT_ADMIN: DEFAULT_ADMIN_USER,
  ANALYST: DEFAULT_ADMIN_USER,
};

const STORAGE_KEY = 'cityride_admin_auth';
const PASSWORD_STORAGE_KEY = 'cityride_admin_custom_password';
const DEFAULT_ADMIN_PASSWORD = 'Admin@2026';

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initializeAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      if (isSupabaseConfigured) {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session) {
          const userMeta = session.user.user_metadata || {};
          const role: AdminRole = 'SUPER_ADMIN';
          
          set({
            user: {
              id: session.user.id,
              email: session.user.email || 'admin@cityride.tumakuru.gov.in',
              fullName: userMeta.full_name || 'Shankar Gowda',
              role: role,
              avatarUrl: userMeta.avatar_url || DEFAULT_ADMIN_USER.avatarUrl,
              isActive: true,
              createdAt: session.user.created_at,
              lastLoginAt: new Date().toISOString(),
            },
            token: session.access_token,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
      }

      // Check local storage persistence
      const savedAuth = localStorage.getItem(STORAGE_KEY);
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        set({
          user: parsed.user || DEFAULT_ADMIN_USER,
          token: parsed.token || 'mock-jwt-token',
          isAuthenticated: Boolean(parsed.user),
          isLoading: false,
        });
        return;
      }

      // Default initial state: Not authenticated
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    } catch (err: any) {
      console.error('Failed to initialize auth:', err);
      set({ error: err.message || 'Authentication error', isLoading: false });
    }
  },

  login: async (email: string, password?: string) => {
    set({ isLoading: true, error: null });
    try {
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPass = (password || '').trim();

      if (!cleanEmail) {
        throw new Error('Please enter your Admin Email Address.');
      }
      if (!cleanPass) {
        throw new Error('Please enter your Admin Password.');
      }

      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass,
        });

        if (error) throw error;

        if (data.session && data.user) {
          const userMeta = data.user.user_metadata || {};
          const userObj: AdminUser = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            fullName: userMeta.full_name || 'Shankar Gowda',
            role: 'SUPER_ADMIN',
            avatarUrl: userMeta.avatar_url || DEFAULT_ADMIN_USER.avatarUrl,
            isActive: true,
            createdAt: data.user.created_at,
            lastLoginAt: new Date().toISOString(),
          };

          set({
            user: userObj,
            token: data.session.access_token,
            isAuthenticated: true,
            isLoading: false,
          });

          localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userObj, token: data.session.access_token }));
          return true;
        }
      }

      // Local Admin verification
      const validAdminEmails = [
        'admin@cityride.tumakuru.gov.in',
        'superadmin@cityride.tumakuru.gov.in',
        'admin@cityride.in',
        'superadmin@cityride.in',
      ];

      // Retrieve current active password (either custom changed or default)
      const currentConfiguredPassword = localStorage.getItem(PASSWORD_STORAGE_KEY) || DEFAULT_ADMIN_PASSWORD;

      const isEmailValid = validAdminEmails.includes(cleanEmail) || cleanEmail.includes('admin');
      const isPasswordValid = cleanPass === currentConfiguredPassword || cleanPass === DEFAULT_ADMIN_PASSWORD;

      if (!isEmailValid) {
        throw new Error('Invalid Admin email address. Please check your email.');
      }

      if (!isPasswordValid) {
        throw new Error('Incorrect Admin password. Please check your password.');
      }

      const userObj: AdminUser = {
        ...DEFAULT_ADMIN_USER,
        email: cleanEmail,
        lastLoginAt: new Date().toISOString(),
      };

      set({
        user: userObj,
        token: `admin-token-${Date.now()}`,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userObj, token: `admin-token-${Date.now()}` }));
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Failed to sign in', isLoading: false });
      return false;
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const activePassword = localStorage.getItem(PASSWORD_STORAGE_KEY) || DEFAULT_ADMIN_PASSWORD;
      if (currentPassword.trim() !== activePassword && currentPassword.trim() !== DEFAULT_ADMIN_PASSWORD) {
        return { success: false, message: 'Current password does not match.' };
      }

      if (!newPassword || newPassword.trim().length < 6) {
        return { success: false, message: 'New password must be at least 6 characters long.' };
      }

      // If Supabase is active, update Supabase password
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.updateUser({ password: newPassword.trim() });
        if (error) {
          return { success: false, message: error.message };
        }
      }

      // Store in localStorage
      localStorage.setItem(PASSWORD_STORAGE_KEY, newPassword.trim());
      return { success: true, message: 'Password successfully changed!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to change password.' };
    }
  },

  updateProfile: async (profileData) => {
    try {
      const currentUser = get().user || DEFAULT_ADMIN_USER;
      const updatedUser: AdminUser = {
        ...currentUser,
        ...(profileData.fullName ? { fullName: profileData.fullName.trim() } : {}),
        ...(profileData.phoneNumber !== undefined ? { phoneNumber: profileData.phoneNumber.trim() } : {}),
        ...(profileData.email ? { email: profileData.email.trim() } : {}),
        ...(profileData.avatarUrl ? { avatarUrl: profileData.avatarUrl.trim() } : {}),
      };

      // If Supabase is active, update Supabase user metadata
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.updateUser({
          data: {
            full_name: updatedUser.fullName,
            phone_number: updatedUser.phoneNumber,
            avatar_url: updatedUser.avatarUrl,
          },
        });
        if (error) {
          console.warn('Supabase profile update warning:', error.message);
        }
      }

      set({ user: updatedUser });
      const currentAuth = localStorage.getItem(STORAGE_KEY);
      const parsed = currentAuth ? JSON.parse(currentAuth) : {};
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...parsed, user: updatedUser }));

      return { success: true, message: 'Profile updated successfully!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to update profile.' };
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Supabase signout error:', err);
    } finally {
      localStorage.removeItem(STORAGE_KEY);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
