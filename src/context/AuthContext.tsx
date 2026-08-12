import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, UserRole } from '../types';
import { DataService } from '../services/dataService';
import { DEMO_USERS } from '../services/mockData';

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  register: (data: Parameters<typeof DataService.registerOfficerRequest>[0]) => Promise<UserProfile>;
  switchDemoUser: (uid: string) => Promise<UserProfile>;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedUid = localStorage.getItem('govdoc_current_user_uid');
        if (savedUid) {
          const profile = await DataService.getUserProfile(savedUid);
          if (profile && profile.accountStatus === 'approved') {
            setCurrentUser(profile);
          } else {
            setCurrentUser(DEMO_USERS[0]);
            localStorage.setItem('govdoc_current_user_uid', DEMO_USERS[0].uid);
          }
        } else {
          setCurrentUser(DEMO_USERS[0]);
          localStorage.setItem('govdoc_current_user_uid', DEMO_USERS[0].uid);
        }
      } catch (err) {
        console.error("Auth init error", err);
        setCurrentUser(DEMO_USERS[0]);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, _pass: string): Promise<UserProfile> => {
    setLoading(true);
    try {
      const allUsers = await DataService.getAllUsers();
      const matched = allUsers.find(u => u.officialEmail.toLowerCase() === email.toLowerCase());

      if (!matched) {
        throw new Error("Invalid official credentials or email domain unregistered.");
      }

      if (matched.accountStatus === 'pending') {
        throw new Error("Your officer registration is currently PENDING administrative approval.");
      }

      if (matched.accountStatus === 'suspended' || matched.accountStatus === 'rejected') {
        throw new Error("This officer account has been suspended or rejected by Chief Secretariat.");
      }

      matched.lastLoginAt = new Date().toISOString();
      setCurrentUser(matched);
      localStorage.setItem('govdoc_current_user_uid', matched.uid);

      await DataService.logAuditEvent({
        actorId: matched.uid,
        actorName: matched.fullName,
        actorEmail: matched.officialEmail,
        actorRole: matched.role,
        action: 'OFFICER_LOGIN',
        resourceType: 'auth',
        resourceId: matched.uid,
        details: `Official login via HTTPS (Port 443) protocol. Designation: ${matched.designation}`,
        result: 'success'
      });

      return matched;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    if (currentUser) {
      await DataService.logAuditEvent({
        actorId: currentUser.uid,
        actorName: currentUser.fullName,
        actorEmail: currentUser.officialEmail,
        actorRole: currentUser.role,
        action: 'OFFICER_LOGOUT',
        resourceType: 'auth',
        resourceId: currentUser.uid,
        details: 'Officer signed out of GovDoc session.',
        result: 'success'
      });
    }
    setCurrentUser(null);
    localStorage.removeItem('govdoc_current_user_uid');
  };

  const register = async (data: Parameters<typeof DataService.registerOfficerRequest>[0]): Promise<UserProfile> => {
    return await DataService.registerOfficerRequest(data);
  };

  const switchDemoUser = async (uid: string): Promise<UserProfile> => {
    const profile = await DataService.getUserProfile(uid);
    if (!profile) throw new Error("Demo user not found");
    setCurrentUser(profile);
    localStorage.setItem('govdoc_current_user_uid', profile.uid);
    return profile;
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!currentUser) return false;
    const allowed = Array.isArray(roles) ? roles : [roles];
    return allowed.includes(currentUser.role);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      login,
      logout,
      register,
      switchDemoUser,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
