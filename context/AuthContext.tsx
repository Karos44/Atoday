import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '../types';
import { supabase } from '../services/supabase';

// 你的 GitHub 用户名：唯一管理员判定
const ADMIN_GITHUB_USERNAME = 'Karos44';

interface AuthContextType {
  user: User | null;
  isLoggingIn: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function mapSupabaseUserToInternal(sbUser: any): User {
  const meta = sbUser?.user_metadata ?? {};

  // Supabase(GitHub) 常见字段：user_name / preferred_username / name / avatar_url
  const login: string | null =
    meta.user_name ??
    meta.preferred_username ??
    meta.login ??
    null;

  const name: string =
    meta.name ??
    login ??
    'Unknown';

  const avatar: string =
    meta.avatar_url ??
    'https://picsum.photos/seed/user/200';

  const role: User['role'] =
    (login === ADMIN_GITHUB_USERNAME || name === ADMIN_GITHUB_USERNAME)
      ? 'ADMIN'
      : 'USER';

  return {
    id: sbUser.id,
    name,
    avatar,
    githubUrl: login ? `https://github.com/${login}` : undefined,
    role,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // 你现在的 supabase.ts 是“硬编码创建 client”，所以这里永远 false
  const isDemoMode = false;

  useEffect(() => {
    let mounted = true;

    // 1) 首次加载：恢复 session（刷新后也能保持登录）
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        const session = data?.session;
        if (session?.user) {
          setUser(mapSupabaseUserToInternal(session.user));
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        if (!mounted) return;
        setUser(null);
      });

    // 2) 监听登录/登出/token刷新
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        setUser(mapSupabaseUserToInternal(session.user));
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const login = async () => {
    try {
      setIsLoggingIn(true);

      // ✅ 关键：明确 redirectTo（本地 & Cloudflare Pages 都可用）
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin,
        },
      });

      // 注意：这句调用会触发整页跳转到 GitHub，所以后面不需要 setIsLoggingIn(false)
    } catch (e) {
      // 如果被浏览器拦截/或 provider 配置有误，这里能恢复按钮状态
      setIsLoggingIn(false);
      console.error('[Auth] login failed:', e);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = useMemo(
    () => ({
      user,
      isLoggingIn,
      login,
      logout,
      isDemoMode,
    }),
    [user, isLoggingIn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);

  // ✅ 不 throw，避免 HMR/首帧黑屏
  if (!ctx) {
    return {
      user: null,
      isLoggingIn: false,
      login: async () => {},
      logout: async () => {},
      isDemoMode: true,
    };
  }

  return ctx;
}
