import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

export default function VendorStore({ addToCart, triggerToast }) {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [vendorInfo, setVendorInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendorStoreData();
  }, [vendorId]);

  const fetchVendorStoreData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/vegetables/vendor/${vendorId}`);
      setProducts(res.data);

      if (res.data.length > 0 && res.data[0].vendorId) {
        setVendorInfo(res.data[0].vendorId);
      }
    } catch (err) {
      console.error("Error loading vendor storefront:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToBag = (veg) => {
    if (addToCart) {
      addToCart(veg);
    } else if (triggerToast) {
      triggerToast(`🛒 Added ${veg.name} to your bag!`);
    }
  };

  return (
    <div style={{ padding: '36px 40px', backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 70px)' }}>
      
      {/* ⬅️ BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: '10px 18px',
          backgroundColor: '#ffffff',
          color: '#334155',
          border: '1px solid #cbd5e1',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: '700',
          fontSize: '13px',
          marginBottom: '24px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}
      >
        ← Back to Marketplace
      </button>

      {/* 🏪 VENDOR SHOP BANNER */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '32px',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', backgroundColor: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase' }}>
            Verified Farmer Storefront
          </span>
        </div>
        <h1 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '28px', fontWeight: '800' }}>
          🏪 {vendorInfo?.shopName || 'Vendor Fresh Produce Store'}
        </h1>
        
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '14px', color: '#475569', marginTop: '12px' }}>
          <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            👤 <strong>Owner:</strong> {vendorInfo?.name || 'Local Seller'}
          </p>
          <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            📍 <strong>Location:</strong> {vendorInfo?.address || 'Local Farmers Market'}
          </p>
          {vendorInfo?.phone && (
            <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              📞 <strong>Contact:</strong> {vendorInfo.phone}
            </p>
          )}
        </div>
      </div>

      <h2 style={{ color: '#0f172a', fontSize: '20px', fontWeight: '800', marginBottom: '20px' }}>
        Available Produce ({products.length} Items)
      </h2>

      {/* PRODUCE GRID */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          <p style={{ fontSize: '15px', fontWeight: '600' }}>Loading vendor products...</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', padding: '60px', textAlign: 'center', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>This shop currently has no items in stock.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
          {products.map((item) => (
            <div
              key={item._id}
              className="hover-card"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 4px 12px -2px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ position: 'relative', overflow: 'hidden', height: '170px', backgroundColor: '#f1f5f9' }}>
                <img
                  src={getVegetableImage(item.name, item.imageUrl)}
                  alt={item.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/tomato.png.jpg';
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                    ...getFreshnessBadgeStyle(item.freshness)
                  }}
                >
                  {item.freshness || 'Fresh'}
                </span>
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ margin: '0 0 4px 0', color: '#0f172a', fontSize: '18px', fontWeight: '800', textTransform: 'capitalize' }}>
                  {item.name}
                </h3>

                <p style={{ margin: '0 0 6px 0', color: '#16a34a', fontWeight: '800', fontSize: '22px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  ₹{item.currentPrice}<span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>/ kg</span>
                </p>
                
                <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b' }}>
                  Available Stock: <strong style={{ color: '#334155' }}>{item.quantity} kg</strong>
                </p>

                <button
                  onClick={() => handleAddToBag(item)}
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
                    boxShadow: '0 4px 10px rgba(22, 163, 74, 0.25)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  🛒 Add to Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}