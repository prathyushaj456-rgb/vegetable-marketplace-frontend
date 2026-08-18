import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function VendorDashboard({ triggerToast }) {
  const [vegetables, setVegetables] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [freshness, setFreshness] = useState('Fresh Today');
  const [bannerMsg, setBannerMsg] = useState('');

  // Editing state
  const [editingVegId, setEditingVegId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editFreshness, setEditFreshness] = useState('Fresh Today');

  const loggedInUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch (e) {
      return null;
    }
  })();

  const vendorId = loggedInUser ? loggedInUser.id || loggedInUser._id : null;
  const shopName = loggedInUser?.shopName || 'My Shop';

  useEffect(() => {
    if (vendorId) {
      fetchVendorInventory();
    }
  }, [vendorId]);

  const fetchVendorInventory = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/vegetables/vendor/${vendorId}`);
      setVegetables(res.data);
    } catch (err) {
      console.error("Error loading dashboard inventory:", err);
    }
  };

  const showNotification = (msg) => {
    if (triggerToast) {
      triggerToast(msg);
    } else {
      setBannerMsg(msg);
      setTimeout(() => setBannerMsg(''), 3000);
    }
  };

  const handleAddVegetable = async (e) => {
    e.preventDefault();
    if (!name || !quantity || !currentPrice) {
      return showNotification("⚠️ Please fill out all fields!");
    }
    if (!vendorId) {
      return showNotification("⚠️ Session expired. Please log in again.");
    }

    try {
      const newVeg = {
        name,
        quantity: Number(quantity),
        currentPrice: Number(currentPrice),
        freshness,
        vendorId
      };

      const response = await axios.post('http://localhost:5000/api/vegetables/add', newVeg);
      if (response.status === 201 || response.status === 200) {
        showNotification(`🥦 Added ${name} to stock successfully!`);
        setName('');
        setQuantity('');
        setCurrentPrice('');
        setFreshness('Fresh Today');
        await fetchVendorInventory();
      }
    } catch (err) {
      console.error("Error adding stock:", err);
      showNotification("❌ Failed to log product batch.");
    }
  };

  const startEdit = (veg) => {
    setEditingVegId(veg._id);
    setEditPrice(veg.currentPrice);
    setEditQuantity(veg.quantity);
    setEditFreshness(veg.freshness || 'Fresh Today');
  };

  const cancelEdit = () => {
    setEditingVegId(null);
  };

  const handleUpdateVegetable = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/vegetables/update/${id}`, {
        currentPrice: Number(editPrice),
        quantity: Number(editQuantity),
        freshness: editFreshness
      });
      showNotification("✅ Item details updated successfully!");
      setEditingVegId(null);
      await fetchVendorInventory();
    } catch (err) {
      showNotification("❌ Failed to update item.");
    }
  };

  const handleRemoveVegetable = async (id, vegName) => {
    if (!window.confirm(`Are you sure you want to remove "${vegName}"?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/vegetables/${id}`);
      setVegetables((prev) => prev.filter((veg) => veg._id !== id));
      showNotification(`🗑️ Removed ${vegName} from inventory.`);
    } catch (err) {
      showNotification("❌ Failed to remove item.");
    }
  };

  const totalStockKg = vegetables.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const freshItemsCount = vegetables.filter(item => item.freshness === 'Fresh Today').length;

  return (
    <div style={{ padding: '36px 40px', backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 70px)' }}>
      
      {/* 🏪 VENDOR SHOP BANNER HEADER */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '28px 32px',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#16a34a', backgroundColor: '#dcfce7', padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Active Vendor Storefront
          </span>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '8px 0 4px 0' }}>
            🏪 {shopName}
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            Owner: <strong style={{ color: '#334155' }}>{loggedInUser?.name || 'Seller'}</strong> | Manage inventory and pricing in real time
          </p>
        </div>
      </div>

      {bannerMsg && (
        <div style={{ backgroundColor: '#10b981', color: 'white', padding: '12px 20px', borderRadius: '12px', marginBottom: '24px', fontWeight: 'bold' }}>
          {bannerMsg}
        </div>
      )}

      {/* 📊 SUMMARY METRICS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '20px 24px', borderRadius: '16px', borderLeft: '5px solid #16a34a', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderTop: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Listed Produce Items</span>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: '6px 0 0 0' }}>📦 {vegetables.length}</h2>
        </div>
        <div style={{ backgroundColor: '#ffffff', padding: '20px 24px', borderRadius: '16px', borderLeft: '5px solid #2563eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderTop: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Total In-Stock Produce</span>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: '6px 0 0 0' }}>⚖️ {totalStockKg} kg</h2>
        </div>
        <div style={{ backgroundColor: '#ffffff', padding: '20px 24px', borderRadius: '16px', borderLeft: '5px solid #059669', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderTop: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Fresh Today Stock</span>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: '6px 0 0 0' }}>✨ {freshItemsCount} Items</h2>
        </div>
      </div>

      {/* ➕ ADD NEW PRODUCE STOCK CARD */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '28px 32px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
        <h3 style={{ margin: '0 0 18px 0', fontSize: '18px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ➕ Log New Produce Stock
        </h3>

        <form onSubmit={handleAddVegetable} style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'end' }}>
          <div style={{ flex: '2', minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Vegetable Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Tomato, Potato" style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '14px', outline: 'none' }} />
          </div>
          <div style={{ flex: '1', minWidth: '130px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Stock (kg)</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="20" style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '14px', outline: 'none' }} />
          </div>
          <div style={{ flex: '1', minWidth: '130px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Price (₹ / kg)</label>
            <input type="number" value={currentPrice} onChange={(e) => setCurrentPrice(e.target.value)} placeholder="40" style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '14px', outline: 'none' }} />
          </div>
          <div style={{ flex: '1.2', minWidth: '160px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Freshness</label>
            <select value={freshness} onChange={(e) => setFreshness(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', backgroundColor: '#ffffff', fontSize: '14px', outline: 'none' }}>
              <option value="Fresh Today">Fresh Today</option>
              <option value="1 Day Old">1 Day Old</option>
              <option value="Limited Stock">Limited Stock</option>
            </select>
          </div>
          <button type="submit" style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '13px 26px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(22, 163, 74, 0.25)' }}>
            Add Produce Item
          </button>
        </form>
      </div>

      {/* 📋 INVENTORY TABLE */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Live Inventory Catalog</h3>
          <span style={{ fontSize: '13px', color: '#64748b' }}>Showing {vegetables.length} items</span>
        </div>

        {vegetables.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            <p style={{ margin: 0, fontSize: '15px' }}>No items in your stock yet. Use the form above to add produce.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '14px 24px', color: '#475569', fontWeight: '700' }}>Item Name</th>
                <th style={{ padding: '14px 24px', color: '#475569', fontWeight: '700' }}>Quantity (kg)</th>
                <th style={{ padding: '14px 24px', color: '#475569', fontWeight: '700' }}>Price (₹ / kg)</th>
                <th style={{ padding: '14px 24px', color: '#475569', fontWeight: '700' }}>Freshness</th>
                <th style={{ padding: '14px 24px', color: '#475569', fontWeight: '700' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vegetables.map((veg) => (
                <tr key={veg._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 24px', fontWeight: '700', color: '#0f172a', textTransform: 'capitalize' }}>{veg.name}</td>
                  
                  {/* Quantity Cell */}
                  <td style={{ padding: '14px 24px', color: '#334155' }}>
                    {editingVegId === veg._id ? (
                      <input
                        type="number"
                        value={editQuantity}
                        onChange={(e) => setEditQuantity(e.target.value)}
                        style={{ width: '80px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    ) : (
                      `${veg.quantity} kg`
                    )}
                  </td>

                  {/* Price Cell */}
                  <td style={{ padding: '14px 24px', color: '#16a34a', fontWeight: '800' }}>
                    {editingVegId === veg._id ? (
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        style={{ width: '80px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    ) : (
                      `₹${veg.currentPrice}`
                    )}
                  </td>

                  {/* Freshness Cell */}
                  <td style={{ padding: '14px 24px' }}>
                    {editingVegId === veg._id ? (
                      <select
                        value={editFreshness}
                        onChange={(e) => setEditFreshness(e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      >
                        <option value="Fresh Today">Fresh Today</option>
                        <option value="1 Day Old">1 Day Old</option>
                        <option value="Limited Stock">Limited Stock</option>
                      </select>
                    ) : (
                      <span style={{
                        fontSize: '11px',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontWeight: '700',
                        backgroundColor: veg.freshness === 'Fresh Today' ? '#dcfce7' : veg.freshness === '1 Day Old' ? '#fef3c7' : '#fee2e2',
                        color: veg.freshness === 'Fresh Today' ? '#15803d' : veg.freshness === '1 Day Old' ? '#b45309' : '#b91c1c'
                      }}>
                        {veg.freshness || 'Fresh Today'}
                      </span>
                    )}
                  </td>

                  {/* Actions Cell */}
                  <td style={{ padding: '14px 24px' }}>
                    {editingVegId === veg._id ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleUpdateVegetable(veg._id)} style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>Save</button>
                        <button onClick={cancelEdit} style={{ backgroundColor: '#94a3b8', color: 'white', border: 'none', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => startEdit(veg)} style={{ backgroundColor: '#e0f2fe', color: '#0369a1', border: '1px solid #7dd3fc', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>Edit</button>
                        <button onClick={() => handleRemoveVegetable(veg._id, veg.name)} style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Remove</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}