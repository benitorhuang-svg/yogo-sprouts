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
import { doc, setDoc, getDoc, increment, collection, getDocs } from 'firebase/firestore';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCustomToken,
} from 'firebase/auth';
import { auth, db } from '../firebaseClient';

export interface User {
  name: string;
  email: string;
  tier: string;
  points: number;
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
    provider?: 'google' | 'line'
  ) => Promise<void>;
  logout: () => void;
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
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('yogo-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);

  const API_BASE = 'https://us-central1-yogo-sprouts-app.cloudfunctions.net/api';

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // 載入我的收藏
  useEffect(() => {
    const savedFavs = localStorage.getItem('yogo-favorites');
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.error('Failed to parse favorites from localStorage', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('yogo-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('yogo-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('yogo-user');
    }
  }, [user]);

  // 【Firestore 會員驗證】初次掛載自動驗證雲端 session 狀態
  useEffect(() => {
    const verifySession = async () => {
      const savedUser = localStorage.getItem('yogo-user');
      if (savedUser) {
        try {
          const parsed: User = JSON.parse(savedUser);
          const uid = parsed.email.replace(/[^a-zA-Z0-9]/g, '_');
          const userRef = doc(db, 'users', uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data();
            const verifiedUser: User = {
              name: data.displayName || parsed.name,
              email: data.email || parsed.email,
              tier: data.tier || parsed.tier,
              points: data.points !== undefined ? data.points : parsed.points,
            };
            setUser(verifiedUser);
            console.log('【Firestore 會員驗證】自動登入狀態雲端驗證成功！');
          }
        } catch (e) {
          console.warn('【Firestore 會員驗證】自動驗證降級使用本機紀錄', e);
        }
      }
    };
    verifySession();

    // 處理 LINE Login Callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      const handleLineCallback = async () => {
        try {
          const response = await fetch(`${API_BASE}/auth/line`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code,
              redirectUri: window.location.origin + '/',
            }),
          });
          const data = await response.json();
          if (data.customToken) {
            await signInWithCustomToken(auth, data.customToken);
            window.history.replaceState({}, document.title, '/');
            showToast('✅ LINE 登入成功！');
          }
        } catch (err) {
          console.error('LINE Callback Error:', err);
          showToast('❌ LINE 登入失敗');
        }
      };
      handleLineCallback();
    }
  }, [showToast]);

  const login = async (
    email: string,
    name?: string,
    password?: string,
    provider?: 'google' | 'line'
  ) => {
    audioManager.playSuccess();
    let verifiedEmail = email;
    let verifiedName = name || email.split('@')[0] || '綠手指芽農';

    try {
      if (provider === 'google') {
        const googleProvider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, googleProvider);
        verifiedEmail = result.user.email || email;
        verifiedName = result.user.displayName || verifiedName;
      } else if (provider === 'line') {
        const clientId = '2010090768';
        const redirectUri = encodeURIComponent(window.location.origin + '/');
        const state = Math.random().toString(36).substring(7);
        const lineUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=profile%20openid%20email`;
        window.location.href = lineUrl;
        return;
      } else if (password) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          verifiedEmail = userCredential.user.email || email;
        } catch (authErr: unknown) {
          const error = authErr as { code: string };
          if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            await createUserWithEmailAndPassword(auth, email, password);
          } else {
            throw authErr;
          }
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login error';
      console.warn('Firebase Auth 驗證降級：', message);
    }

    const uid = verifiedEmail.replace(/[^a-zA-Z0-9]/g, '_');
    const defaultUser: User = {
      name: verifiedName,
      email: verifiedEmail,
      tier: '👑 VIP 芽苗大師',
      points: 168,
    };

    try {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        const verifiedUser: User = {
          name: verifiedName || data.displayName || defaultUser.name,
          email: data.email || defaultUser.email,
          tier: data.tier || defaultUser.tier,
          points: data.points !== undefined ? data.points : defaultUser.points,
        };
        setUser(verifiedUser);
        if (verifiedName) {
          await setDoc(
            userRef,
            { displayName: verifiedName, updatedAt: new Date().toISOString() },
            { merge: true }
          );
        }
      } else {
        await setDoc(userRef, {
          uid,
          displayName: defaultUser.name,
          email: defaultUser.email,
          tier: defaultUser.tier,
          points: defaultUser.points,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setUser(defaultUser);
      }
    } catch (e) {
      console.error('Firestore user record error:', e);
      setUser(defaultUser);
    }
  };

  const logout = () => {
    setUser(null);
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
    try {
      for (const [id, qty] of Object.entries(currentCart)) {
        const pRef = doc(db, 'products', String(id));
        const pSnap = await getDoc(pRef);
        if (pSnap.exists()) {
          const currentStock = pSnap.data().stock ?? 0;
          if (currentStock < qty) {
            alert(
              `【結帳存貨驗證失敗】商品「${pSnap.data().name}」庫存不足（僅剩 ${currentStock} 份），請調整購買數量！`
            );
            return;
          }
        }
      }
    } catch {
      // Proceed even if check fails, Firestore will enforce rules
    }
    setCart({});
    try {
      const orderId =
        'ORD-' +
        new Date().toISOString().split('T')[0].replace(/-/g, '') +
        '-' +
        Math.floor(Math.random() * 1000);
      const orderRef = doc(db, 'orders', orderId);
      await setDoc(orderRef, {
        orderId,
        items: currentCart,
        subtotal: getTotal(),
        discount: getDiscount(),
        total: getTotal() - getDiscount(),
        user: user?.name || data?.name || '訪客芽農',
        cust_name: data?.name || '',
        cust_phone: data?.phone || '',
        cust_address: data?.address || '',
        cust_email: data?.email || '',
        preferred_delivery_date: data?.deliveryDate || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      for (const [id, qty] of Object.entries(currentCart)) {
        await setDoc(doc(db, 'products', id), { stock: increment(-qty) }, { merge: true });
      }
    } catch (e) {
      console.error('Order creation error:', e);
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
