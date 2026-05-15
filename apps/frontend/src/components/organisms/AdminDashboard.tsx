import React, { FC, useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { auth } from '@/firebaseClient';

/**
 * 👑 AdminDashboard Organism
 * 後台管理主系統：包含會員管理與商品管理
 */
const AdminDashboard: FC = () => {
  const { isAdminDashboardOpen, setIsAdminDashboardOpen, showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<'members' | 'products'>('members');
  const [members, setMembers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:5001/yogo-sprouts-app/us-central1/api'
      : '/api';

  // 獲取資料 (並行讀取以減少等待時間)
  const fetchAllData = async () => {
    if (!isAdminDashboardOpen) return;
    setIsLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const headers = { Authorization: `Bearer ${token}` };

      // 同時發送請求
      const [userRes, prodRes] = await Promise.all([
        fetch(`${API_BASE}/admin/users`, { headers }),
        fetch(`${API_BASE}/admin/products`, { headers }),
      ]);

      const [userData, prodData] = await Promise.all([userRes.json(), prodRes.json()]);

      if (userData.success) setMembers(userData.data);
      if (prodData.success) setProducts(prodData.data);
    } catch (err: any) {
      console.error('Admin Fetch Error:', err);
      showToast(`❌ 獲取資料失敗: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 更新商品欄位 (庫存或價格)
  const handleUpdateProduct = async (
    id: string | number,
    field: 'stock' | 'price',
    newValue: number
  ) => {
    // 樂觀更新 UI
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: newValue } : p)));

    try {
      const token = await auth.currentUser?.getIdToken();
      await fetch(`${API_BASE}/admin/products/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: newValue }),
      });
    } catch (err) {
      console.error(`Update ${field} Error:`, err);
      showToast(`❌ ${field === 'stock' ? '庫存' : '售價'}同步失敗`);
    }
  };

  // 強制同步初始商品 (Seed)
  const handleForceSeed = async () => {
    if (!window.confirm('確定要同步初始商品資料嗎？這將會補齊缺少的預設品項。')) return;
    setIsLoading(true);
    try {
      const isLocal =
        window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const SEED_URL = isLocal
        ? 'http://localhost:5001/yogo-sprouts-app/us-central1/api/seed'
        : '/api/seed';

      const res = await fetch(SEED_URL, {
        method: 'POST',
        headers: { 'x-api-key': 'yogo-secret-admin-key-2026' },
      });
      const data = await res.json();
      if (data.success) {
        showToast('✅ 商品資料初始化成功！');
        fetchAllData();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      showToast(`❌ 初始化失敗: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminDashboardOpen) fetchAllData();
  }, [isAdminDashboardOpen]);

  if (!isAdminDashboardOpen) return null;

  return (
    <div className="modal-wrapper active admin-dashboard-overlay">
      <div className="modal-backdrop" onClick={() => setIsAdminDashboardOpen(false)}></div>
      <div className="modal-card admin-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="admin-header">
          <div className="admin-title-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <h2>👑 YoGo 後台管理系統</h2>
              <button
                className="quick-btn-small"
                onClick={handleForceSeed}
                style={{ background: '#fff', padding: '6px 12px' }}
              >
                🔄 初始化商品庫
              </button>
            </div>
            <button className="modal-close-btn" onClick={() => setIsAdminDashboardOpen(false)}>
              ✕
            </button>
          </div>
          <div className="admin-tabs">
            <button
              className={`admin-tab-btn ${activeTab === 'members' ? 'active' : ''}`}
              onClick={() => setActiveTab('members')}
            >
              👥 會員管理
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              📦 商品管理
            </button>
          </div>
        </div>

        <div className="admin-content-scroll">
          {isLoading && members.length === 0 ? (
            <div
              className="admin-loading-container"
              style={{ textAlign: 'center', padding: '50px' }}
            >
              <div className="spinner" style={{ margin: '0 auto 15px' }}></div>
              <p>資料處理中，請稍候...</p>
            </div>
          ) : (
            <>
              {activeTab === 'members' && (
                <div className="admin-table-wrapper">
                  {members.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                      查無會員資料
                    </div>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>帳號類型</th>
                          <th>名稱/Email/UID</th>
                          <th>聯絡資訊</th>
                          <th>持有的優惠券代碼</th>
                          <th>註冊時間</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((m) => (
                          <tr key={m.id}>
                            <td style={{ textAlign: 'center' }}>
                              {m.id.startsWith('line:') ? (
                                <span className="source-badge line">LINE</span>
                              ) : (
                                <span className="source-badge email">Email</span>
                              )}
                            </td>
                            <td>
                              <div className="user-cell">
                                <strong>{m.name}</strong>
                                <span>{m.email}</span>
                                <code style={{ fontSize: '0.65rem', color: '#aaa' }}>
                                  UID: {m.id}
                                </code>
                              </div>
                            </td>
                            <td>
                              <div style={{ fontSize: '0.85rem' }}>
                                <div>📞 {m.phone || '未填'}</div>
                                <div style={{ color: '#666', marginTop: '4px' }}>
                                  📍 {m.address || '未填配送地址'}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="coupon-badges">
                                {m.coupons?.map((c: string) => (
                                  <span key={c} className="mini-coupon">
                                    {c}
                                  </span>
                                )) || <span style={{ color: '#ccc' }}>無</span>}
                              </div>
                            </td>
                            <td>
                              {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {activeTab === 'products' && (
                <div className="admin-table-wrapper">
                  {products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                      <p style={{ color: '#999', marginBottom: '15px' }}>
                        目前資料庫中沒有商品資料
                      </p>
                      <button
                        className="modal-add-to-cart-btn"
                        onClick={handleForceSeed}
                        style={{ width: 'auto' }}
                      >
                        立即建立初始商品
                      </button>
                    </div>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th style={{ width: '60px' }}>ID</th>
                          <th>商品名稱</th>
                          <th>類別</th>
                          <th style={{ width: '160px' }}>售價調整</th>
                          <th style={{ width: '160px' }}>庫存調整</th>
                          <th>狀態</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p) => (
                          <tr key={p.id}>
                            <td style={{ color: '#aaa', fontWeight: 'bold' }}>#{p.id}</td>
                            <td>
                              <div className="prod-cell">
                                <span className="prod-emoji">{p.emoji}</span>
                                <strong>{p.name}</strong>
                              </div>
                            </td>
                            <td>
                              <span className="badge-tier">{p.category}</span>
                            </td>
                            <td>
                              <div className="stock-control-group price-control">
                                <button
                                  onClick={() =>
                                    handleUpdateProduct(p.id, 'price', Math.max(0, p.price - 10))
                                  }
                                >
                                  −
                                </button>
                                <div className="input-with-prefix">
                                  <span>$</span>
                                  <input
                                    type="number"
                                    value={p.price}
                                    onChange={(e) =>
                                      handleUpdateProduct(
                                        p.id,
                                        'price',
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                  />
                                </div>
                                <button
                                  onClick={() => handleUpdateProduct(p.id, 'price', p.price + 10)}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td>
                              <div className="stock-control-group">
                                <button
                                  onClick={() =>
                                    handleUpdateProduct(p.id, 'stock', Math.max(0, p.stock - 1))
                                  }
                                >
                                  −
                                </button>
                                <input
                                  type="number"
                                  value={p.stock}
                                  onChange={(e) =>
                                    handleUpdateProduct(
                                      p.id,
                                      'stock',
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                />
                                <button
                                  onClick={() => handleUpdateProduct(p.id, 'stock', p.stock + 1)}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td>
                              {p.stock === 0 ? (
                                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>完售</span>
                              ) : p.stock < 10 ? (
                                <span style={{ color: '#f59e0b' }}>低庫存</span>
                              ) : (
                                <span style={{ color: '#10b981' }}>充足</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        .admin-modal-card {
          width: 95%;
          max-width: 1250px;
          height: 90vh;
          display: flex;
          flex-direction: column;
          padding: 0 !important;
          overflow: hidden;
        }
        .admin-header {
          padding: 20px;
          background: #f8f9fa;
          border-bottom: 1px solid #eee;
        }
        .admin-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .admin-tabs {
          display: flex; gap: 10px;
        }
        .admin-tab-btn {
          padding: 10px 20px; border: none; background: #eee; border-radius: 6px; cursor: pointer; font-weight: bold; transition: all 0.2s;
        }
        .admin-tab-btn.active {
          background: #2d6a4f; color: #fff;
        }
        .admin-content-scroll {
          flex: 1; overflow-y: auto; padding: 20px;
        }
        .admin-table {
          width: 100%; border-collapse: collapse; text-align: left;
        }
        .admin-table th {
          background: #f1f3f5; padding: 12px; font-size: 0.85rem; color: #666; white-space: nowrap;
        }
        .admin-table td {
          padding: 12px; border-bottom: 1px solid #eee; font-size: 0.9rem; vertical-align: middle;
        }
        .user-cell { display: flex; flex-direction: column; gap: 2px; }
        .user-cell span { font-size: 0.8rem; color: #888; }
        .prod-cell { display: flex; flex-direction: row; align-items: center; gap: 8px; }
        .prod-emoji { font-size: 1.2rem; }
        .source-badge {
          padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; color: #fff;
        }
        .source-badge.line { background: #06c755; }
        .source-badge.email { background: #6c757d; }
        .mini-coupon {
          background: #e8f5e9; color: #2d6a4f; padding: 1px 6px; border-radius: 3px; font-size: 0.7rem; margin-right: 4px; border: 1px solid #2d6a4f33;
        }
        .badge-tier { font-size: 0.75rem; background: #e9ecef; padding: 2px 8px; border-radius: 10px; }
        
        .stock-control-group {
          display: flex; align-items: center; gap: 0; background: #fff; border: 1px solid #ddd; border-radius: 6px; width: fit-content; overflow: hidden;
        }
        .stock-control-group button {
          border: none; background: #f8f9fa; padding: 5px 10px; cursor: pointer; font-weight: bold; font-size: 1rem;
        }
        .stock-control-group button:hover { background: #eee; }
        .stock-control-group input {
          width: 50px; border: none; text-align: center; font-size: 0.9rem; padding: 5px 0; outline: none;
        }
        .input-with-prefix {
          display: flex; align-items: center; background: #fff; border-left: 1px solid #eee; border-right: 1px solid #eee;
        }
        .input-with-prefix span { padding-left: 8px; font-size: 0.8rem; color: #999; }
        .price-control input { width: 60px; }

        /* 隱藏 Input Number 的上下箭頭 */
        .stock-control-group input::-webkit-outer-spin-button,
        .stock-control-group input::-webkit-inner-spin-button {
          -webkit-appearance: none; margin: 0;
        }

        .spinner {
          width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #2d6a4f; border-radius: 50%; animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
