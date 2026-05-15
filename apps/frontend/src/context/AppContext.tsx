import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Product,
  Category,
  CartState,
  CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
} from '@yogo/shared';
import { audioManager } from '@/audioManager';
import { doc, setDoc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
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
import { auth, db } from '../firebaseClient';

export interface User {
  name: string;
  email: string;
  tier: string;
  points: number;
  photoURL?: string;
}

interface AppContextType {
  products: Product[];
  categories: Category[];
  cart: CartState;
  selectedCategory: string;
  searchQuery: string;
  favorites: number[];
  user: User | null;
  setCart: React.Dispatch<React.SetStateAction<CartState>>;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  toggleFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  addToCart: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: (orderData?: unknown) => Promise<void>;
  login: (
    email: string,
    name?: string,
    password?: string,
    provider?: 'google' | 'line',
    isSignup?: boolean
  ) => Promise<void>;
  logout: () => void;
  updateUserData: (data: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  getTotal: () => number;
  getDiscount: () => number;
  isLoadingProducts: boolean;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  appliedCoupon: string | null;
  setAppliedCoupon: (code: string) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  showToast: (message: string) => void;
  toasts: { id: number; message: string }[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartState>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);

  // 使用相對路徑避免 CORS 問題 (透過 Firebase Hosting Rewrite)
  const API_BASE =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'https://us-central1-yogo-sprouts-app.cloudfunctions.net/api'
      : '/api';

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // 監聽 Firebase Auth 狀態與同步資料庫使用者資訊
  useEffect(() => {
    // 優先從 localStorage 恢復使用者狀態 (避免頁面重新整理時閃爍)
    const cachedUser = localStorage.getItem('yogo-user-profile');
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch {
        console.warn('Failed to parse cached user profile');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          console.log('【Auth】Firebase Auth 狀態變更: 已登入', firebaseUser.uid);

          // 🚀 樂觀更新 (Optimistic Update)：先用 Auth 的基本資料顯示，消除等待延遲
          setUser((prev) => {
            const tempUser: User = {
              name: firebaseUser.displayName || prev?.name || '新芽農',
              email: firebaseUser.email || prev?.email || '',
              tier: prev?.tier || '🌱 讀取中...', // 資料庫還沒回來前顯示讀取中
              points: prev?.points || 0,
            };
            const pUrl = firebaseUser.photoURL || prev?.photoURL;
            if (pUrl) {
              tempUser.photoURL = pUrl;
            }
            return tempUser;
          });

          const userRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userRef);

          let userData: User;
          if (snap.exists()) {
            userData = snap.data() as User;
            // 如果資料庫沒頭貼但 Auth 有，則更新以保持同步
            if (!userData.photoURL && firebaseUser.photoURL) {
              userData.photoURL = firebaseUser.photoURL;
            }
          } else {
            // 初始化新使用者資料 (新註冊)
            userData = {
              name: firebaseUser.displayName || '新芽農',
              email: firebaseUser.email || '',
              tier: '🌱 綠手指新手',
              points: 0,
            };
            if (firebaseUser.photoURL) {
              userData.photoURL = firebaseUser.photoURL;
            }

            await setDoc(userRef, {
              ...userData,
              uid: firebaseUser.uid,
              createdAt: new Date().toISOString(),
            });
          }

          setUser(userData);
          localStorage.setItem('yogo-user-profile', JSON.stringify(userData));
          console.log('【Auth】使用者資料同步完成:', userData.name);
        } catch (err) {
          console.error('【Auth】同步資料庫資料失敗:', err);
          showToast('⚠️ 無法同步會員資料，請檢查網路連線');
        }
      } else {
        // 如果 localStorage 中不是訪客，則清除
        const currentCached = localStorage.getItem('yogo-user-profile');
        if (currentCached && !JSON.parse(currentCached).email.includes('guest')) {
          setUser(null);
          localStorage.removeItem('yogo-user-profile');
        }
        console.log('【Auth】目前為訪客狀態');
      }
    });

    // 處理 LINE Login Callback (如果 URL 有 code)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const returnedState = urlParams.get('state');

    if (code) {
      const handleLineCallback = async () => {
        try {
          // 驗證 OAuth state 防止 CSRF 攻擊
          const savedState = sessionStorage.getItem('line-auth-state');
          if (savedState && returnedState !== savedState) {
            throw new Error('登入驗證碼不符，可能遭受 CSRF 攻擊');
          }
          sessionStorage.removeItem('line-auth-state'); // 驗證後清除

          showToast('🔄 正在驗證 LINE 登入資訊...');
          const response = await fetch(`${API_BASE}/auth/line`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code,
              redirectUri: window.location.origin + '/',
            }),
          });

          if (!response.ok) {
            if (response.status === 403) {
              throw new Error(
                '後端服務權限遭拒 (403)。請確認 Cloud Functions 已設為公開 (allUsers)。'
              );
            }
            const text = await response.text();
            throw new Error(`伺服器回應錯誤 (${response.status}): ${text.substring(0, 50)}`);
          }

          const data = await response.json();
          if (data.customToken) {
            await signInWithCustomToken(auth, data.customToken);
            window.history.replaceState({}, document.title, '/');
            showToast('✅ LINE 登入成功！');
          } else {
            throw new Error('回傳資料遺失授權金鑰');
          }
        } catch (err: unknown) {
          const e = err as Error;
          console.error('LINE Callback Error:', e);
          showToast(`❌ LINE 登入失敗: ${e.message}`);
          window.history.replaceState({}, document.title, '/');
        }
      };
      handleLineCallback();
    }

    return () => unsubscribe();
  }, [showToast]);

  // 載入我的收藏
  useEffect(() => {
    const savedFavs = localStorage.getItem('yogo-favorites');
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch {
        console.error('Failed to parse favorites from localStorage');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('yogo-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const login = async (
    email: string,
    _name?: string,
    password?: string,
    provider?: 'google' | 'line',
    isSignup?: boolean
  ) => {
    console.log('【Login Debug】開始登入流程, provider:', provider, 'isSignup:', isSignup);

    try {
      if (provider === 'google') {
        const googleProvider = new GoogleAuthProvider();
        await signInWithPopup(auth, googleProvider);
        showToast('✅ Google 登入成功！');
      } else if (provider === 'line') {
        const clientId = '2010090812';
        // 確保 redirectUri 與 LINE Developers Console 上的 Callback URL 完全一致 (包含最後的斜線)
        const redirectUri = encodeURIComponent(window.location.origin + '/');

        const state = Math.random().toString(36).substring(2, 15); // 產生較長且穩定的 state
        sessionStorage.setItem('line-auth-state', state); // 儲存 state 供 Callback 驗證

        const lineUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=profile%20openid%20email`;

        console.log('【Login Debug】準備跳轉 LINE, Redirect URI:', window.location.origin + '/');
        window.location.href = lineUrl;
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
        const guestData: User = {
          name: '訪客芽農',
          email: 'guest@yogo.tw',
          tier: '🌱 訪客體驗',
          points: 0,
          photoURL: 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png', // 🌱 預設圖示
        };
        setUser(guestData);
        localStorage.setItem('yogo-user-profile', JSON.stringify(guestData));
        showToast('🌱 訪客體驗模式已開啟');
      }
      audioManager.playSuccess();
    } catch (err: unknown) {
      console.error('【Login Debug】異常:', err);
      let errorMsg = '操作失敗，請稍後再試';
      const error = err as { code?: string };

      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMsg = '❌ 帳號或密碼錯誤';
      } else if (error.code === 'auth/user-not-found') {
        errorMsg = '❌ 找不到此帳號，請先註冊';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMsg = '❌ 此 Email 已被註冊';
      } else if (error.code === 'auth/weak-password') {
        errorMsg = '❌ 密碼強度不足 (需至少 6 位數)';
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = '❌ 無效的 Email 格式';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMsg = '⚠️ 登入已取消';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMsg = '❌ 此 Email 已被其他方式註冊 (例如：之前用信箱註冊，現在用 Google 登入)';
      }

      showToast(errorMsg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('yogo-user-profile');
      showToast('👋 已安全登出');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const updateUserData = async (data: Partial<User>) => {
    if (!auth.currentUser) return;
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, data);

      const updatedUser = { ...user!, ...data };
      setUser(updatedUser);
      localStorage.setItem('yogo-user-profile', JSON.stringify(updatedUser));
      showToast('✅ 會員資料已更新');
    } catch (err) {
      console.error('Update user error:', err);
      showToast('❌ 更新失敗，請稍後再試');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      showToast('📧 密碼重設信件已寄出，請檢查信箱');
    } catch (err: unknown) {
      const e = err as { code?: string };
      console.error('Reset password error:', e);
      let msg = '發送失敗';
      if (e.code === 'auth/user-not-found') msg = '找不到此帳號';
      if (e.code === 'auth/invalid-email') msg = 'Email 格式錯誤';
      showToast(`❌ ${msg}`);
      throw err;
    }
  };

  const { data: products = [], isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const productsCol = collection(db, 'products');
        const snap = await getDocs(productsCol);
        if (!snap.empty) {
          const firestoreProducts: Product[] = [];
          snap.forEach((docSnap) => {
            firestoreProducts.push(docSnap.data() as Product);
          });
          return firestoreProducts.sort((a, b) => a.id - b.id);
        } else {
          for (const p of INITIAL_PRODUCTS) {
            await setDoc(doc(db, 'products', String(p.id)), p);
          }
          return INITIAL_PRODUCTS;
        }
      } catch (err) {
        console.error('Firestore products fetch error:', err);
        return INITIAL_PRODUCTS;
      }
    },
    initialData: JSON.parse(JSON.stringify(INITIAL_PRODUCTS)),
    staleTime: 1000 * 30,
  });

  const addToCart = async (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const currentQty = cart[productId] || 0;
    const targetQty = currentQty + 1;
    let stockLimit = product.stock;
    try {
      const pRef = doc(db, 'products', String(productId));
      const pSnap = await getDoc(pRef);
      if (pSnap.exists()) stockLimit = pSnap.data().stock ?? product.stock;
    } catch {
      // Use initial stock if Firestore fails
    }
    if (targetQty > stockLimit) {
      alert(
        `【存貨驗證提示】很抱歉，「${product.name}」目前雲端存貨僅剩 ${stockLimit} 份，無法再加入更多！`
      );
      return;
    }
    audioManager.playCartAdd();
    setCart((prev) => ({ ...prev, [productId]: targetQty }));
    showToast(`✅ 已將「${product.name}」加入購物籃`);
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      const newQty = (prev[productId] || 0) - 1;
      if (newQty <= 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: newQty };
    });
  };

  const clearCart = async (orderData?: unknown) => {
    const currentCart = { ...cart };
    const data = orderData as Record<string, unknown>;

    showToast('🔄 訂單處理中，請稍候...');

    try {
      const response = await fetch(`${API_BASE}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: data?.name || user?.name || '訪客',
            phone: data?.phone || '',
            email: data?.email || user?.email || '',
            address: data?.address || '',
          },
          cart: currentCart,
          couponCode: appliedCoupon || undefined,
          preferred_delivery_date: data?.deliveryDate || undefined,
          user_uid: auth.currentUser?.uid || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || '結帳失敗，請稍後再試');
      }

      setCart({});
      setAppliedCoupon(null);
      showToast('✅ 結帳成功！訂單已送出。');
    } catch (err: unknown) {
      const e = err as Error;
      console.error('Checkout error:', e);
      alert(`【結帳失敗】${e.message}`);
      throw err; // Re-throw so CheckoutModal can handle if needed
    }
  };

  const getTotal = () => products.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);

  const getDiscount = () => {
    if (!appliedCoupon) return 0;
    const total = getTotal();
    const coupon = INITIAL_COUPONS.find((c) => c.code === appliedCoupon);
    if (!coupon || !coupon.active || total < coupon.minOrderAmount) return 0;
    return coupon.type === 'fixed' ? coupon.value : Math.floor(total * (coupon.value / 100));
  };

  const handleCoupon = (code: string) => {
    const coupon = INITIAL_COUPONS.find((c) => c.code === code.toUpperCase());
    if (coupon) {
      setAppliedCoupon(coupon.code);
      showToast('🎫 優惠碼已套用！');
    } else {
      showToast('❌ 無效的優惠碼');
    }
  };

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isFavorite = (productId: number) => favorites.includes(productId);

  return (
    <AppContext.Provider
      value={{
        products,
        categories: CATEGORIES,
        cart,
        selectedCategory,
        searchQuery,
        favorites,
        user,
        setCart,
        setSelectedCategory,
        setSearchQuery,
        toggleFavorite,
        isFavorite,
        addToCart,
        removeFromCart,
        clearCart,
        login,
        logout,
        updateUserData,
        resetPassword,
        getTotal,
        getDiscount,
        isLoadingProducts,
        selectedProduct,
        setSelectedProduct,
        appliedCoupon,
        setAppliedCoupon: handleCoupon,
        isCheckoutOpen,
        setIsCheckoutOpen,
        showToast,
        toasts,
      }}
    >
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            {t.message}
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
