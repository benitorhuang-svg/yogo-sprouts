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

  // 獲取資料
  const fetchData = async () => {
    if (!isAdminDashboardOpen) return;
    setIsLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const headers = { Authorization: `Bearer ${token}` };

      if (activeTab === 'members') {
        const res = await fetch(`${API_BASE}/admin/users`, { headers });
        const data = await res.json();
        if (data.success) setMembers(data.data);
        else throw new Error(data.error);
      } else {
        const res = await fetch(`${API_BASE}/admin/products`, { headers });
        const data = await res.json();
        if (data.success) setProducts(data.data);
        else throw new Error(data.error);
      }
    } catch (err: any) {
      console.error('Admin Fetch Error:', err);
      showToast(`❌ 獲取資料失敗: ${err.message}`);
    } finally {
      setIsLoading(false);
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
        fetchData();
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
    fetchData();
  }, [isAdminDashboardOpen, activeTab]);

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
          {isLoading ? (
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
                          <th>名稱/Email</th>
                          <th>聯絡電話</th>
                          <th>等級/紅利</th>
                          <th>註冊時間</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((m) => (
                          <tr key={m.id}>
                            <td>
                              <div className="user-cell">
                                <strong>{m.name}</strong>
                                <span>{m.email}</span>
                              </div>
                            </td>
                            <td>{m.phone || '未填寫'}</td>
                            <td>
                              <span className="badge-tier">{m.tier}</span>
                              <div className="points-val">{m.points} pts</div>
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
                          <th>商品資訊</th>
                          <th>類別</th>
                          <th>售價</th>
                          <th>庫存</th>
                          <th>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p) => (
                          <tr key={p.id}>
                            <td>
                              <div className="prod-cell">
                                <span className="prod-emoji">{p.emoji}</span>
                                <strong>{p.name}</strong>
                              </div>
                            </td>
                            <td>{p.category}</td>
                            <td>${p.price}</td>
                            <td>
                              <span className={`stock-val ${p.stock < 5 ? 'low' : ''}`}>
                                {p.stock}
                              </span>
                            </td>
                            <td>
                              <button
                                className="quick-btn-small"
                                onClick={() => alert('編輯功能即將上線')}
                              >
                                編輯
                              </button>
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
          max-width: 1000px;
          height: 85vh;
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
          display: flex;
          gap: 10px;
        }
        .admin-tab-btn {
          padding: 10px 20px;
          border: none;
          background: #eee;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s;
        }
        .admin-tab-btn.active {
          background: #2d6a4f;
          color: #fff;
        }
        .admin-content-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }
        .admin-table-wrapper {
          width: 100%;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .admin-table th {
          background: #f1f3f5;
          padding: 12px;
          font-size: 0.9rem;
          color: #666;
        }
        .admin-table td {
          padding: 15px 12px;
          border-bottom: 1px solid #eee;
          font-size: 0.95rem;
        }
        .user-cell, .prod-cell {
          display: flex;
          flex-direction: column;
        }
        .user-cell span { font-size: 0.8rem; color: #888; }
        .prod-cell { flex-direction: row; align-items: center; gap: 10px; }
        .badge-tier { font-size: 0.75rem; background: #e9ecef; padding: 2px 8px; border-radius: 10px; }
        .stock-val.low { color: #ef4444; font-weight: bold; }
        .quick-btn-small { padding: 4px 10px; font-size: 0.8rem; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; }
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #2d6a4f;
          border-radius: 50%;
          animation: spin 1s linear infinite;
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
