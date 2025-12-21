import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../services/supabase';

interface AuthContextType {
  user: User | null;
  isLoggingIn: boolean;
  login: () => Promise<void>;
  logout: () => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ⭐ 你的 GitHub 用户名，作为唯一管理员判定
const ADMIN_GITHUB_USERNAME = 'Karos44';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const isDemoMode = !supabase;

  useEffect(() => {
    if (isDemoMode) return;

    // 1. 检查当前会话
    supabase!.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        mapSupabaseUserToInternal(session.user);
      }
    });

    // 2. 监听登录状态变化
    const { data: { subscription } } = supabase!.auth.onAuthStateChange((_event, session) => {
      if (session) {
        mapSupabaseUserToInternal(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [isDemoMode]);

  const mapSupabaseUserToInternal = (supabaseUser: any) => {
    const meta = supabaseUser.user_metadata || {};

    // ⭐ 核心：admin 判定只在这里做
    const isAdmin = meta.user_name === ADMIN_GITHUB_USERNAME;

    const internalUser: User = {
      id: supabaseUser.id,
      name: meta.full_name || meta.user_name || meta.preferred_username || '未知访客',
      avatar:
        meta.avatar_url ||
        `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 1000)}?v=4`,
      githubUrl: meta.user_name
        ? `https://github.com/${meta.user_name}`
        : undefined,
      role: isAdmin ? 'ADMIN' : 'USER'
    };

    setUser(internalUser);
  };

  const login = async () => {
    setIsLoggingIn(true);

    if (isDemoMode) {
      // 演示模式：直接给 ADMIN
      console.log('执行演示模式登录...');
      setTimeout(() => {
        setUser({
          id: 'demo-id',
          name: '演示管理员',
          avatar: 'https://picsum.photos/seed/cyber/200',
          role: 'ADMIN'
        });
        setIsLoggingIn(false);
      }, 2000);
      return;
    }

    try {
      const { error } = await supabase!.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('认证失败:', error);
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    if (!isDemoMode) {
      await supabase!.auth.signOut();
    }
    setUser(null);
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, isLoggingIn, login, logout, isDemoMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context ?? {
    user: null,
    isLoggingIn: false,
    login: async () => {},
    logout: () => {},
    isDemoMode: true,
  };
};

