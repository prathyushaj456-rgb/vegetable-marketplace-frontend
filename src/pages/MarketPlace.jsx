import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const getVegetableImage = (name, customUrl) => {
  if (customUrl && !customUrl.includes('default.png') && customUrl.startsWith('http')) {
    return customUrl;
  }

  const n = name ? name.toLowerCase().trim() : '';
  const localImages = {
    'beens': '/images/beens.png.jpg',
    'beans': '/images/beens.png.jpg',
    'beetroot': '/images/beetroot.png.jpg',
    'bitter gourd': '/images/bitter gourd.png.jpg',
    'bottle gourd': '/images/bottle gourd.png.jpg',
    'bringal': '/images/bringal.png.jpg',
    'brinjal': '/images/bringal.png.jpg',
    'eggplant': '/images/bringal.png.jpg',
    'carrot': '/images/carrot.png.jpg',
    'carrots': '/images/carrot.png.jpg',
    'cauliflower': '/images/cauliflower.png.jpg',
    'coriander': '/images/coriander.png.jpg',
    'curry leaves': '/images/curryleeves.png.jpg',
    'curryleeves': '/images/curryleeves.png.jpg',
    'okra': '/images/okra.png.jpg',
    'ladies finger': '/images/okra.png.jpg',
    'lady finger': '/images/okra.png.jpg',
    'onion': '/images/onion.png.jpg',
    'onions': '/images/onion.png.jpg',
    'potato': '/images/potato.png.jpg',
    'potatoes': '/images/potato.png.jpg',
    'pumpkin': '/images/pumpkin.png.jpg',
    'ridge gourd': '/images/ridge gourd.png.jpg',
    'snake gourd': '/images/snake gourd.png.jpg',
    'spinach': '/images/spinatch.png.jpg',
    'spinatch': '/images/spinatch.png.jpg',
    'tomato': '/images/tomato.png.jpg',
    'tomatoes': '/images/tomato.png.jpg'
  };

  return localImages[n] || '/images/tomato.png.jpg';
};

const getFreshnessBadgeStyle = (condition) => {
  switch (condition) {
    case 'Fresh Today':
      return { backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' };
    case '1 Day Old':
      return { backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' };
    case 'Limited Stock':
      return { backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' };
    default:
      return { backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' };
  }
};

export default function MarketPlace({ addToCart, searchTerm = '', triggerToast }) {
  const [vegetables, setVegetables] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/vegetables');
      setVegetables(res.data);
    } catch (err) {
      console.error("Error loading catalog:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (veg) => {
    const vendorId = typeof veg.vendorId === 'object' ? veg.vendorId?._id : veg.vendorId;
    if (vendorId) {
      navigate(`/vendor-store/${vendorId}`);
    }
  };

  const handleAddToBag = (e, veg) => {
    e.stopPropagation();
    if (addToCart) {
      addToCart(veg);
    }
  };

  const getFilteredAndSortedVegetables = () => {
    let list = vegetables;

    // Freshness filter
    if (activeFilter !== 'All') {
      list = list.filter(v => v.freshness === activeFilter);
    }

    // Search term filtering & sorting
    const query = searchTerm.toLowerCase().trim();
    if (!query) return list;

    const matched = [];
    const others = [];

    list.forEach((veg) => {
      const vegName = veg.name?.toLowerCase() || '';
      const vendorName = (typeof veg.vendorId === 'object' ? veg.vendorId?.name : '')?.toLowerCase() || '';
      const shopName = (typeof veg.vendorId === 'object' ? veg.vendorId?.shopName : '')?.toLowerCase() || '';

      if (vegName.includes(query) || vendorName.includes(query) || shopName.includes(query)) {
        matched.push(veg);
      } else {
        others.push(veg);
      }
    });

    return [...matched, ...others];
  };

  const displayVegetables = getFilteredAndSortedVegetables();

  return (
    <div style={{ padding: '36px 40px', backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 70px)' }}>
      
      {/* 🌟 HERO BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #15803d 0%, #16a34a 50%, #059669 100%)',
        borderRadius: '20px',
        padding: '36px 40px',
        color: '#ffffff',
        marginBottom: '32px',
        boxShadow: '0 12px 28px -6px rgba(22, 163, 74, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🌾 Direct From Farm Sellers
          </span>
          <h1 style={{ fontSize: '30px', fontWeight: '800', margin: '10px 0 6px 0', letterSpacing: '-0.02em' }}>
            Fresh Harvest Marketplace
          </h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '15px', maxWidth: '520px' }}>
            Connect directly with verified local farmers and vendors. Order farm-fresh vegetables delivered to your doorstep.
          </p>
        </div>

        {/* METRICS BADGES */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', padding: '12px 20px', borderRadius: '14px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span style={{ fontSize: '20px', fontWeight: '800', display: 'block' }}>{vegetables.length}</span>
            <span style={{ fontSize: '12px', opacity: 0.85 }}>Live Products</span>
          </div>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', padding: '12px 20px', borderRadius: '14px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span style={{ fontSize: '20px', fontWeight: '800', display: 'block' }}>100%</span>
            <span style={{ fontSize: '12px', opacity: 0.85 }}>Locally Sourced</span>
          </div>
        </div>
      </div>

      {/* 🏷️ FILTER TABS ROW */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['All', 'Fresh Today', '1 Day Old', 'Limited Stock'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              style={{
                padding: '8px 18px',
                borderRadius: '30px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                border: activeFilter === tab ? 'none' : '1px solid #cbd5e1',
                backgroundColor: activeFilter === tab ? '#16a34a' : '#ffffff',
                color: activeFilter === tab ? '#ffffff' : '#475569',
                boxShadow: activeFilter === tab ? '0 4px 10px rgba(22, 163, 74, 0.25)' : '0 1px 2px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease'
              }}
            >
              {tab === 'All' ? '🥬 All Produce' : tab}
            </button>
          ))}
        </div>

        {searchTerm.trim() && (
          <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
            Results matching: <strong style={{ color: '#16a34a' }}>"{searchTerm}"</strong>
          </p>
        )}
      </div>

      {/* 📦 PRODUCE CARDS GRID */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          <p style={{ fontSize: '16px', fontWeight: '600' }}>Loading fresh produce catalog...</p>
        </div>
      ) : displayVegetables.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', padding: '60px', textAlign: 'center', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>🥦</span>
          <h3 style={{ color: '#1e293b', margin: '0 0 6px 0' }}>No Vegetables Found</h3>
          <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
            Try adjusting your search query or switching filter tabs.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {displayVegetables.map((veg) => {
            const vendorObj = typeof veg.vendorId === 'object' ? veg.vendorId : null;
            const vendorName = vendorObj?.name || 'Local Seller';
            const shopName = vendorObj?.shopName || 'Produce Stall';

            return (
              <div
                key={veg._id}
                onClick={() => handleCardClick(veg)}
                className="hover-card"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.05)',
                  cursor: 'pointer',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* IMAGE CONTAINER */}
                <div style={{ position: 'relative', overflow: 'hidden', height: '180px', backgroundColor: '#f1f5f9' }}>
                  <img
                    src={getVegetableImage(veg.name, veg.imageUrl)}
                    alt={veg.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/tomato.png.jpg';
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      fontSize: '11px',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontWeight: '800',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      ...getFreshnessBadgeStyle(veg.freshness)
                    }}
                  >
                    {veg.freshness || 'Fresh Today'}
                  </span>
                </div>

                {/* CARD BODY */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ margin: '0 0 4px 0', color: '#0f172a', fontSize: '18px', fontWeight: '800', textTransform: 'capitalize' }}>
                    {veg.name}
                  </h3>

                  <p style={{ margin: '0 0 12px 0', color: '#16a34a', fontWeight: '800', fontSize: '22px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    ₹{veg.currentPrice}<span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>/ kg</span>
                  </p>

                  <div style={{ marginBottom: '18px', padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9', fontSize: '13px' }}>
                    <p style={{ margin: '0 0 2px 0', fontWeight: '700', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      🏪 {shopName}
                    </p>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '12px' }}>
                      Sold by: <span style={{ color: '#475569', fontWeight: '600' }}>{vendorName}</span>
                    </p>
                  </div>

                  {/* ADD TO BAG BUTTON */}
                  <button
                    onClick={(e) => handleAddToBag(e, veg)}
                    style={{
                      marginTop: 'auto',
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: '700',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 10px rgba(22, 163, 74, 0.25)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    🛒 Add to Bag
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}