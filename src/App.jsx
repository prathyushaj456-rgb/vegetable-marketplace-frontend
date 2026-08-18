import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import MarketPlace from './pages/MarketPlace';
import VendorDashboard from './pages/VendorDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import VendorStore from './pages/VendorStore';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent({
  cart,
  setCart,
  searchTerm,
  setSearchTerm,
  showCartDropdown,
  setShowCartDropdown,
  showProfileDropdown,
  setShowProfileDropdown,
  toastMessage,
  cartRef,
  profileRef,
  loggedInUser,
  addToCart,
  updateQuantity,
  removeFromCart,
  handleCheckout,
  handleLogout,
  totalItems,
  grandTotal,
  triggerToast
}) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const showSearchAndCart = loggedInUser && !isAuthPage;

  return (
    <>
      {/* 🍞 TOP-CENTER TOAST POPUP */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '30px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
          zIndex: 99999,
          fontSize: '14px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid #334155'
        }}>
          {toastMessage}
        </div>
      )}

      {/* 📌 FIXED / STICKY NAVBAR HEADER */}
      <nav style={{ 
        backgroundColor: '#1e293b', 
        padding: '15px 40px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)', 
        position: 'sticky', 
        top: 0,
        zIndex: 1000,
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', gap: '25px', alignItems: 'center', flexWrap: 'wrap', flexShrink: 0 }}>
          <Link to="/" style={{ color: '#16a34a', textDecoration: 'none', fontWeight: 'bold', fontSize: '24px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            🥬 FreshCart Marketplace
          </Link>

          {!loggedInUser && (
            <div style={{ display: 'flex', gap: '15px' }}>
              <Link to="/login" style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Sign In</Link>
              <Link to="/register" style={{ color: '#f8fafc', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Register</Link>
            </div>
          )}

          {loggedInUser?.role === 'vendor' && (
            <Link to="/vendor" style={{ color: '#4ade80', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>🏪 Vendor Dashboard</Link>
          )}

          {loggedInUser?.role === 'admin' && (
            <Link to="/admin" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>👑 Admin Dashboard</Link>
          )}
        </div>

        {/* 🔍 SEARCH BAR (Only visible after login and not on auth pages) */}
        {showSearchAndCart && (
          <div style={{ flexGrow: 1, maxWidth: '450px', minWidth: '180px' }}>
            <input 
              type="text" 
              placeholder="Search fresh vegetables..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#1e293b', outline: 'none', fontSize: '14px' }}
            />
          </div>
        )}

        {/* UTILITY ACTIONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', flexShrink: 0, marginLeft: !showSearchAndCart ? 'auto' : '0' }}>
          
          {/* 🛍️ CART CONTAINER (Only visible after login and not on auth pages) */}
          {showSearchAndCart && (
            <div ref={cartRef} style={{ position: 'relative' }}>
              <div 
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} 
                onClick={() => { setShowCartDropdown(prev => !prev); setShowProfileDropdown(false); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                {totalItems > 0 && (
                  <span style={{ position: 'absolute', top: '-8px', right: '-10px', backgroundColor: '#dc2626', color: 'white', borderRadius: '50%', padding: '2px 7px', fontSize: '11px', fontWeight: 'bold', border: '2px solid #1e293b' }}>
                    {totalItems}
                  </span>
                )}
              </div>

              {/* CART DROPDOWN */}
              {showCartDropdown && (
                <div style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', width: '320px', padding: '16px', zIndex: 200 }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Your Bag</h4>
                  
                  {cart.length === 0 ? (
                    <p style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', margin: '20px 0' }}>Your bag is empty!</p>
                  ) : (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '220px', overflowY: 'auto', marginBottom: '14px' }}>
                        {cart.map((item) => (
                          <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                            <div>
                              <span style={{ fontWeight: 'bold', color: '#334155', display: 'block', textTransform: 'capitalize' }}>{item.name}</span>
                              <span style={{ color: '#16a34a', fontWeight: 'bold' }}>₹{item.currentPrice * (item.qty || 1)}</span>
                            </div>

                            {/* QTY TOGGLES & REMOVE */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <button onClick={() => updateQuantity(item._id, -1)} style={{ padding: '2px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', cursor: 'pointer', background: '#f8fafc' }}>-</button>
                              <span style={{ fontWeight: 'bold', fontSize: '12px' }}>{item.qty || 1}</span>
                              <button onClick={() => updateQuantity(item._id, 1)} style={{ padding: '2px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', cursor: 'pointer', background: '#f8fafc' }}>+</button>
                              <button onClick={() => removeFromCart(item._id)} style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', padding: '3px 6px', cursor: 'pointer', marginLeft: '4px' }}>✕</button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '12px' }}>
                        <span>Total Due:</span>
                        <span style={{ color: '#16a34a', fontSize: '16px' }}>₹{grandTotal}</span>
                      </div>

                      <button
                        onClick={handleCheckout}
                        style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: '#16a34a',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '15px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 6px -1px rgba(22, 163, 74, 0.3)',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        🛍️ Buy Now (₹{grandTotal})
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* PROFILE CONTAINER */}
          {loggedInUser && loggedInUser.name && (
            <div ref={profileRef} style={{ position: 'relative' }}>
              <div 
                onClick={() => { setShowProfileDropdown(prev => !prev); setShowCartDropdown(false); }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#16a34a', color: 'white', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', border: '2px solid #475569' }}
              >
                {loggedInUser.name.charAt(0).toUpperCase()}
              </div>

              {showProfileDropdown && (
                <div style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', width: '220px', padding: '15px', zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', fontWeight: 'bold', fontSize: '20px', border: '2px solid #16a34a' }}>
                    {loggedInUser.name ? loggedInUser.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <h4 style={{ margin: '0 0 2px 0', color: '#1e293b', fontSize: '15px' }}>{loggedInUser.name || 'User'}</h4>
                    <span style={{ fontSize: '10px', backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>{loggedInUser.role || 'customer'}</span>
                  </div>
                  <button onClick={handleLogout} style={{ width: '100%', backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '8px 0', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>Sign Out</button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<MarketPlace addToCart={addToCart} searchTerm={searchTerm} triggerToast={triggerToast} />} />
        <Route path="/vendor" element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <VendorDashboard triggerToast={triggerToast} />
          </ProtectedRoute>
        } />
        <Route path="/vendor-store/:vendorId" element={<VendorStore addToCart={addToCart} triggerToast={triggerToast} />} />
        <Route path="/login" element={<Login triggerToast={triggerToast} />} />
        <Route path="/register" element={<Register triggerToast={triggerToast} />} />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard triggerToast={triggerToast} />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const cartRef = useRef(null);
  const profileRef = useRef(null);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      console.error("Failed writing cart to storage", e);
    }
  }, [cart]);

  // 🔄 Click outside listener to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setShowCartDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loggedInUser = (() => {
    try {
      const data = localStorage.getItem('user');
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error("Session data corrupted:", err);
      localStorage.removeItem('user');
      return null;
    }
  })();

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2200);
  };

  const addToCart = (vegetable) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item._id === vegetable._id);
      if (existing) {
        return prevCart.map((item) =>
          item._id === vegetable._id ? { ...item, qty: (item.qty || 1) + 1 } : item
        );
      }
      return [...prevCart, { ...vegetable, qty: 1 }];
    });
    triggerToast(`🛒 Added ${vegetable.name} to your bag!`);
  };

  const updateQuantity = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item._id === id) {
            const newQty = (item.qty || 1) + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  const handleCheckout = async () => {
    if (!loggedInUser) {
      triggerToast("⚠️ Please sign in to complete purchase!");
      setTimeout(() => {
        window.location.href = '/login';
      }, 1200);
      return;
    }

    if (cart.length === 0) {
      return triggerToast("⚠️ Your bag is empty!");
    }

    try {
      const payload = {
        customerId: loggedInUser.id || loggedInUser._id,
        customerName: loggedInUser.name,
        customerEmail: loggedInUser.email,
        items: cart,
        totalAmount: grandTotal
      };

      await axios.post('http://localhost:5000/api/orders/create', payload);

      triggerToast("🎉 Order placed successfully!");
      setCart([]);
      localStorage.removeItem('cart');
      setShowCartDropdown(false);
    } catch (err) {
      console.error("Checkout failed:", err);
      triggerToast("❌ Order checkout failed. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setShowProfileDropdown(false);
    triggerToast("Logged out successfully! 🥬");
    setTimeout(() => {
      window.location.href = '/login';
    }, 1000);
  };

  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const grandTotal = cart.reduce((sum, item) => sum + item.currentPrice * (item.qty || 1), 0);

  return (
    <BrowserRouter>
      <AppContent
        cart={cart}
        setCart={setCart}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showCartDropdown={showCartDropdown}
        setShowCartDropdown={setShowCartDropdown}
        showProfileDropdown={showProfileDropdown}
        setShowProfileDropdown={setShowProfileDropdown}
        toastMessage={toastMessage}
        cartRef={cartRef}
        profileRef={profileRef}
        loggedInUser={loggedInUser}
        addToCart={addToCart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        handleCheckout={handleCheckout}
        handleLogout={handleLogout}
        totalItems={totalItems}
        grandTotal={grandTotal}
        triggerToast={triggerToast}
      />
    </BrowserRouter>
  );
}