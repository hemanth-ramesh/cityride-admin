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
  demoLogin: (role: AdminRole) => void;
  logout: () => Promise<void>;
  switchRole: (newRole: AdminRole) => void;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

// Sample mock profiles for each role
export const MOCK_ADMIN_USERS: Record<AdminRole, AdminUser> = {
  SUPER_ADMIN: {
    id: 'usr-tum-001',
    email: 'superadmin@cityride.tumakuru.gov.in',
    fullName: 'Shankar Gowda',
    role: 'SUPER_ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phoneNumber: '+91 98450 12345',
    isActive: true,
    createdAt: '2026-01-15T08:30:00Z',
    lastLoginAt: new Date().toISOString(),
  },
  OPERATIONS_MANAGER: {
    id: 'usr-tum-002',
    email: 'operations@cityride.tumakuru.gov.in',
    fullName: 'Rajesh Nanjundappa',
    role: 'OPERATIONS_MANAGER',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    depotId: 'DEPOT_01_CENTRAL',
    phoneNumber: '+91 94480 54321',
    isActive: true,
    createdAt: '2026-01-18T09:15:00Z',
    lastLoginAt: new Date().toISOString(),
  },
  DISPATCHER: {
    id: 'usr-tum-003',
    email: 'dispatch@cityride.tumakuru.gov.in',
    fullName: 'Priya Venkatesh',
    role: 'DISPATCHER',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    depotId: 'DEPOT_01_CENTRAL',
    phoneNumber: '+91 98800 67890',
    isActive: true,
    createdAt: '2026-02-01T10:00:00Z',
    lastLoginAt: new Date().toISOString(),
  },
  FLEET_MANAGER: {
    id: 'usr-tum-004',
    email: 'fleet@cityride.tumakuru.gov.in',
    fullName: 'Suresh Babu',
    role: 'FLEET_MANAGER',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    depotId: 'DEPOT_01_CENTRAL',
    phoneNumber: '+91 97410 98765',
    isActive: true,
    createdAt: '2026-02-10T11:20:00Z',
    lastLoginAt: new Date().toISOString(),
  },
  SUPPORT_ADMIN: {
    id: 'usr-tum-005',
    email: 'support@cityride.tumakuru.gov.in',
    fullName: 'Meera Kulkarni',
    role: 'SUPPORT_ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phoneNumber: '+91 96320 11223',
    isActive: true,
    createdAt: '2026-02-15T14:45:00Z',
    lastLoginAt: new Date().toISOString(),
  },
  ANALYST: {
    id: 'usr-tum-006',
    email: 'analyst@cityride.tumakuru.gov.in',
    fullName: 'Anil Kumar Hegde',
    role: 'ANALYST',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    phoneNumber: '+91 91480 99887',
    isActive: true,
    createdAt: '2026-03-01T16:00:00Z',
    lastLoginAt: new Date().toISOString(),
  },
};

const STORAGE_KEY = 'cityride_admin_auth';

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
          const role: AdminRole = (userMeta.role as AdminRole) || 'OPERATIONS_MANAGER';
          
          set({
            user: {
              id: session.user.id,
              email: session.user.email || '',
              fullName: userMeta.full_name || session.user.email?.split('@')[0] || 'Admin User',
              role: role,
              avatarUrl: userMeta.avatar_url,
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

      // Check local storage persistence for mock session
      const savedAuth = localStorage.getItem(STORAGE_KEY);
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        set({
          user: parsed.user,
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
      if (isSupabaseConfigured && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.session && data.user) {
          const role: AdminRole = (data.user.user_metadata?.role as AdminRole) || 'OPERATIONS_MANAGER';
          const userObj: AdminUser = {
            id: data.user.id,
            email: data.user.email || email,
            fullName: data.user.user_metadata?.full_name || email.split('@')[0],
            role,
            avatarUrl: data.user.user_metadata?.avatar_url,
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

      // Fallback matching by email domain / mock credentials
      let matchedRole: AdminRole = 'OPERATIONS_MANAGER';
      if (email.includes('super')) matchedRole = 'SUPER_ADMIN';
      else if (email.includes('dispatch')) matchedRole = 'DISPATCHER';
      else if (email.includes('fleet')) matchedRole = 'FLEET_MANAGER';
      else if (email.includes('support')) matchedRole = 'SUPPORT_ADMIN';
      else if (email.includes('analyst')) matchedRole = 'ANALYST';

      const userObj: AdminUser = {
        ...MOCK_ADMIN_USERS[matchedRole],
        email,
      };

      set({
        user: userObj,
        token: `mock-token-${Date.now()}`,
        isAuthenticated: true,
        isLoading: false,
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userObj, token: 'mock-token' }));
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Failed to sign in', isLoading: false });
      return false;
    }
  },

  demoLogin: (role: AdminRole) => {
    const userObj = MOCK_ADMIN_USERS[role];
    set({
      user: userObj,
      token: `demo-token-${role}`,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userObj, token: `demo-token-${role}` }));
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

  switchRole: (newRole: AdminRole) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const updatedUser: AdminUser = {
      ...currentUser,
      role: newRole,
      fullName: MOCK_ADMIN_USERS[newRole].fullName,
      email: MOCK_ADMIN_USERS[newRole].email,
    };
    set({ user: updatedUser });
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: updatedUser, token: get().token }));
  },

  clearError: () => set({ error: null }),
}));
