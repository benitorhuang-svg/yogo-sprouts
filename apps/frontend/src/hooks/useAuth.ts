import { useState, useEffect } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCustomToken,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseClient';

export interface User {
  name: string;
  email: string;
  tier: string;
  points: number;
  photoURL?: string;
  phone?: string;
  address?: string;
  coupons?: string[];
}

/**
 * 👤 useAuth Hook
 * 專職管理身分驗證、會員資料與持久化快取
 */
export const useAuth = (showToast: (msg: string) => void) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 1. 優先從 localStorage 恢復 (Optimistic UI)
    const cachedUser = localStorage.getItem('yogo-user-profile');
    if (cachedUser) {
      try {
        const parsedUser = JSON.parse(cachedUser) as User;
        // 補齊可能缺少的舊版欄位
        if (!parsedUser.coupons) parsedUser.coupons = ['YOGO2026', 'SPROUT80', 'FREESHIP'];
        if (!parsedUser.phone) parsedUser.phone = '';
        if (!parsedUser.address) parsedUser.address = '';
        setUser(parsedUser);
      } catch {
        console.warn('Failed to parse cached user profile');
      }
    }

    // 2. 監聽 Firebase Auth 狀態
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔍 Auth State Changed:', firebaseUser?.uid);
      if (firebaseUser) {
        try {
          // 🚀 樂觀更新：先用 Auth 資料顯示，消除延遲
          setUser((prev) => {
            const temp: User = {
              name: firebaseUser.displayName || prev?.name || '新芽農',
              email: firebaseUser.email || prev?.email || '',
              tier: prev?.tier || '🌱 讀取中...',
              points: prev?.points || 0,
              phone: prev?.phone || '',
              address: prev?.address || '',
              coupons: prev?.coupons || ['YOGO2026', 'SPROUT80', 'FREESHIP'],
            };
            if (firebaseUser.photoURL) temp.photoURL = firebaseUser.photoURL;
            return temp;
          });

          const userRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userRef);

          let userData: User;
          if (snap.exists()) {
            userData = snap.data() as User;
            console.log('✅ Found Firestore User Data:', userData.name);
            if (!userData.photoURL && firebaseUser.photoURL)
              userData.photoURL = firebaseUser.photoURL;
            if (!userData.coupons) userData.coupons = ['YOGO2026', 'SPROUT80', 'FREESHIP'];
          } else {
            console.log('🆕 Creating New Firestore User for:', firebaseUser.uid);
            userData = {
              name: firebaseUser.displayName || '新芽農',
              email: firebaseUser.email || '',
              tier: '🌱 綠手指新手',
              points: 0,
              phone: '',
              address: '',
              coupons: ['YOGO2026', 'SPROUT80', 'FREESHIP'],
            };
            if (firebaseUser.photoURL) userData.photoURL = firebaseUser.photoURL;
            await setDoc(userRef, {
              ...userData,
              uid: firebaseUser.uid,
              createdAt: new Date().toISOString(),
            });
          }

          setUser(userData);
          localStorage.setItem('yogo-user-profile', JSON.stringify(userData));
        } catch (err) {
          console.error('❌ Auth Sync Error:', err);
          showToast('⚠️ 無法同步會員資料');
        }
      } else {
        console.log('👋 User is logged out');
        // 清除快取 (排除訪客模式)
        const currentCached = localStorage.getItem('yogo-user-profile');
        if (currentCached) {
          try {
            const parsed = JSON.parse(currentCached);
            if (!parsed.email || !parsed.email.includes('guest')) {
              setUser(null);
              localStorage.removeItem('yogo-user-profile');
            }
          } catch {
            setUser(null);
            localStorage.removeItem('yogo-user-profile');
          }
        }
      }
    });

    return () => unsubscribe();
  }, [showToast]);

  useEffect(() => {
    // 處理 LINE Login Callback (如果 URL 有 code)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const returnedState = urlParams.get('state');

    if (code) {
      const handleLineCallback = async () => {
        try {
          console.log('🚀 Handling LINE Callback with code:', code.substring(0, 5) + '...');
          const savedState = sessionStorage.getItem('line-auth-state');
          if (savedState && returnedState !== savedState) {
            throw new Error('狀態碼不符，可能存在 CSRF 攻擊');
          }
          sessionStorage.removeItem('line-auth-state');

          showToast('🔄 正在驗證 LINE 登入資訊...');

          // 自動偵測 API 基礎路徑
          const isLocal =
            window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
          const API_BASE = isLocal
            ? 'http://localhost:5001/yogo-sprouts-app/us-central1/api' // 指向本地 Emulator 或本地 Server
            : '/api';

          console.log('📡 Fetching LINE custom token from:', API_BASE);

          const response = await fetch(`${API_BASE}/auth/line`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code,
              redirectUri: window.location.origin + '/',
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP ${response.status} 錯誤`);
          }

          const data = await response.json();
          if (data.customToken) {
            console.log('🔑 Received Custom Token, signing in...');
            await signInWithCustomToken(auth, data.customToken);
            window.history.replaceState({}, document.title, '/');
            showToast('✅ LINE 登入成功！');
          } else {
            throw new Error('伺服器回傳資料格式不正確');
          }
        } catch (err: any) {
          console.error('❌ LINE Callback Error:', err);
          showToast(`❌ LINE 登入失敗: ${err.message}`);
          window.history.replaceState({}, document.title, '/');
        }
      };
      handleLineCallback();
    }
  }, [showToast]);

  const login = async (
    email: string,
    _name?: string,
    password?: string,
    provider?: 'google' | 'line',
    isSignup?: boolean
  ) => {
    try {
      if (provider === 'google') {
        await signInWithPopup(auth, new GoogleAuthProvider());
        showToast('✅ Google 登入成功！');
      } else if (provider === 'line') {
        const clientId = '2010090812';
        const redirectUri = encodeURIComponent(window.location.origin + '/');
        const state = Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('line-auth-state', state);
        window.location.href = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=profile%20openid%20email`;
        return;
      } else if (password) {
        if (isSignup) {
          await createUserWithEmailAndPassword(auth, email, password);
          showToast('🎉 註冊成功，歡迎加入 YoGo！');
        } else {
          await signInWithEmailAndPassword(auth, email, password);
          showToast('✅ 登入成功！');
        }
      } else if (email === 'guest@yogo.tw') {
        const guest: User = {
          name: '訪客芽農',
          email: 'guest@yogo.tw',
          tier: '🌱 訪客體驗',
          points: 0,
          photoURL: 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png',
          coupons: ['YOGO2026', 'SPROUT80', 'FREESHIP'],
        };
        setUser(guest);
        localStorage.setItem('yogo-user-profile', JSON.stringify(guest));
        showToast('🌱 訪客體驗模式已開啟');
      }
    } catch (err: any) {
      console.error('Login Error:', err);
      let msg = '操作失敗';
      if (err.code === 'auth/wrong-password') msg = '❌ 帳號或密碼錯誤';
      if (err.code === 'auth/user-not-found') msg = '❌ 找不到帳號，請先註冊';
      if (err.code === 'auth/popup-closed-by-user') msg = '⚠️ 登入已取消';
      showToast(msg);
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem('yogo-user-profile');
    showToast('👋 已安全登出');
  };

  const updateUserData = async (data: Partial<User>) => {
    if (!auth.currentUser) return;
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userRef, data);
    const updated = { ...user!, ...data };
    setUser(updated);
    localStorage.setItem('yogo-user-profile', JSON.stringify(updated));
    showToast('✅ 會員資料已更新');
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
    showToast('📧 密碼重設信件已寄出');
  };

  return { user, login, logout, updateUserData, resetPassword };
};
