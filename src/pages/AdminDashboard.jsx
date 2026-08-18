import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard({ triggerToast }) {
  const [vendors, setVendors] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const vendorRes = await axios.get('http://localhost:5000/api/vegetables/admin/vendors');
      setVendors(vendorRes.data);
    } catch (err) {
      console.error("Error fetching vendors:", err);
    }

    try {
      const customerRes = await axios.get('http://localhost:5000/api/vegetables/admin/customers');
      setCustomers(customerRes.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  const handleRemoveVendor = async (id, shopName) => {
    if (!window.confirm(`Delete shop "${shopName}" and purge all its produce stock?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/vegetables/admin/vendor/${id}`);
      setVendors((prev) => prev.filter((v) => v._id !== id));
      if (triggerToast) triggerToast(`🗑️ Purged vendor "${shopName}" from marketplace.`);
    } catch (err) {
      alert("Failed to delete vendor.");
    }
  };

  return (
    <div style={{ padding: '36px 40px', backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 70px)' }}>
      
      {/* 👑 ADMIN HEADER */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '28px 32px',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
        marginBottom: '28px'
      }}>
        <span style={{ fontSize: '12px', fontWeight: '800', backgroundColor: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase' }}>
          Central Control System
        </span>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '8px 0 4px 0' }}>
          👑 Executive Admin Dashboard
        </h1>
        <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
          Monitor system metrics, vendor storefront accounts, and customer registrations.
        </p>
      </div>

      {/* SUMMARY STATS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', borderLeft: '5px solid #16a34a', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', borderTop: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Registered Vendors</span>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '8px 0 0 0' }}>🏪 {vendors.length}</h2>
        </div>
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', borderLeft: '5px solid #2563eb', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', borderTop: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Registered Customers</span>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '8px 0 0 0' }}>👥 {customers.length}</h2>
        </div>
      </div>

      {/* VENDORS TABLE */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Registered Shops & Vendor Accounts</h3>
        </div>

        {vendors.length === 0 ? (
          <p style={{ padding: '30px', color: '#64748b', margin: 0, textAlign: 'center' }}>No vendors registered yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '14px 24px', color: '#475569', fontWeight: '700' }}>Shop Name</th>
                <th style={{ padding: '14px 24px', color: '#475569', fontWeight: '700' }}>Owner Name</th>
                <th style={{ padding: '14px 24px', color: '#475569', fontWeight: '700' }}>Email Address</th>
                <th style={{ padding: '14px 24px', color: '#475569', fontWeight: '700' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 24px', fontWeight: '700', color: '#16a34a' }}>{vendor.shopName || 'Unnamed Shop'}</td>
                  <td style={{ padding: '14px 24px', color: '#0f172a', fontWeight: '600' }}>{vendor.name}</td>
                  <td style={{ padding: '14px 24px', color: '#64748b' }}>{vendor.email}</td>
                  <td style={{ padding: '14px 24px' }}>
                    <button onClick={() => handleRemoveVendor(vendor._id, vendor.shopName || vendor.name)} style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>Delete Shop</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CUSTOMERS TABLE */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Registered Customers Directory</h3>
        </div>

        {customers.length === 0 ? (
          <p style={{ padding: '30px', color: '#64748b', margin: 0, textAlign: 'center' }}>No registered customers found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '14px 24px', color: '#475569', fontWeight: '700' }}>Customer ID</th>
                <th style={{ padding: '14px 24px', color: '#475569', fontWeight: '700' }}>Name</th>
                <th style={{ padding: '14px 24px', color: '#475569', fontWeight: '700' }}>Email</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => (
                <tr key={cust._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 24px', fontFamily: 'monospace', color: '#2563eb', fontWeight: '700', fontSize: '13px' }}>{cust._id}</td>
                  <td style={{ padding: '14px 24px', fontWeight: '700', color: '#0f172a' }}>{cust.name || 'Customer User'}</td>
                  <td style={{ padding: '14px 24px', color: '#64748b' }}>{cust.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}