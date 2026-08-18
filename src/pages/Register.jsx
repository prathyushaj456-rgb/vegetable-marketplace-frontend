import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Register({ triggerToast }) {
  const [role, setRole] = useState('customer');
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (role === 'vendor' && !shopName.trim()) {
      setError('Shop Name is compulsory for vendor registration!');
      return;
    }

    if (role === 'admin' && !adminSecret.trim()) {
      setError('Admin Passkey is required! Default key is "admin123"');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        shopName: role === 'vendor' ? shopName.trim() : '',
        adminSecret: role === 'admin' ? adminSecret.trim() : '',
        email,
        password,
        role,
        phone,
        address
      });

      setMessage(response.data.message + ' Redirecting to Login...');
      if (triggerToast) triggerToast(`🎉 ${role.toUpperCase()} registered! Redirecting...`);
      
      setName('');
      setShopName('');
      setAdminSecret('');
      setEmail('');
      setPassword('');
      setPhone('');
      setAddress('');

      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #f8fafc 50%, #e0f2fe 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 20px'
    }}>
      <div className="animate-fade-in" style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.04)',
        width: '100%',
        maxWidth: '480px',
        padding: '40px 36px',
        border: '1px solid rgba(226, 232, 240, 0.8)'
      }}>
        {/* LOGO & HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '52px',
            height: '52px',
            backgroundColor: '#dcfce7',
            color: '#16a34a',
            borderRadius: '16px',
            fontSize: '26px',
            marginBottom: '12px',
            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.15)'
          }}>
            🌱
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
            Create FreshCart Account
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            Join the local fresh produce network today
          </p>
        </div>

        {/* NOTIFICATIONS */}
        {message && (
          <div style={{
            backgroundColor: '#dcfce7',
            color: '#15803d',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontWeight: '600',
            fontSize: '13px',
            textAlign: 'center',
            border: '1px solid #bbf7d0'
          }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontWeight: '600',
            fontSize: '13px',
            textAlign: 'center',
            border: '1px solid #fecaca'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* ROLE SELECTOR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Registering As
            </label>
            <div style={{
              display: 'flex',
              backgroundColor: '#f1f5f9',
              padding: '4px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <button
                type="button"
                onClick={() => setRole('customer')}
                style={{
                  flex: 1,
                  padding: '9px 8px',
                  borderRadius: '9px',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: role === 'customer' ? '#ffffff' : 'transparent',
                  color: role === 'customer' ? '#16a34a' : '#64748b',
                  boxShadow: role === 'customer' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                🛒 Customer
              </button>
              <button
                type="button"
                onClick={() => setRole('vendor')}
                style={{
                  flex: 1,
                  padding: '9px 8px',
                  borderRadius: '9px',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: role === 'vendor' ? '#ffffff' : 'transparent',
                  color: role === 'vendor' ? '#16a34a' : '#64748b',
                  boxShadow: role === 'vendor' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                🏪 Vendor
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                style={{
                  flex: 1,
                  padding: '9px 8px',
                  borderRadius: '9px',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: role === 'admin' ? '#ffffff' : 'transparent',
                  color: role === 'admin' ? '#2563eb' : '#64748b',
                  boxShadow: role === 'admin' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                👑 Admin
              </button>
            </div>
          </div>

          {/* FULL NAME */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>
              Full Name <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                fontSize: '14px'
              }}
            />
          </div>

          {/* COMPULSORY SHOP NAME FOR VENDORS */}
          {role === 'vendor' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#16a34a' }}>
                Shop / Stall Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Fresh Farm Organics"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '2px solid #16a34a',
                  backgroundColor: '#f0fdf4',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              />
            </div>
          )}

          {/* ADMIN PASSKEY FOR ADMINS */}
          {role === 'admin' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#2563eb' }}>
                Admin Security Key <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="password"
                placeholder="Enter admin security key"
                required
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '2px solid #2563eb',
                  backgroundColor: '#eff6ff',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              />
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                Enter the master admin security key
              </span>
            </div>
          )}

          {/* EMAIL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>
              Email Address <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                fontSize: '14px'
              }}
            />
          </div>

          {/* PASSWORD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>
              Password <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                fontSize: '14px'
              }}
            />
          </div>

          {/* PHONE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>
              Phone Number
            </label>
            <input
              type="text"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                fontSize: '14px'
              }}
            />
          </div>

          {/* ADDRESS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>
              {role === 'vendor' ? 'Shop Location / Address' : 'Address'}
            </label>
            <input
              type="text"
              placeholder="Main Market Road, Podili"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                fontSize: '14px'
              }}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px',
              backgroundColor: role === 'admin' ? '#2563eb' : '#16a34a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '15px',
              cursor: loading ? 'wait' : 'pointer',
              boxShadow: role === 'admin' ? '0 4px 12px rgba(37, 99, 235, 0.3)' : '0 4px 12px rgba(22, 163, 74, 0.3)',
              transition: 'all 0.15s ease',
              marginTop: '8px'
            }}
          >
            {loading ? 'Creating Account...' : `Sign Up as ${role.toUpperCase()}`}
          </button>

          {/* LOGIN LINK */}
          <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#16a34a', textDecoration: 'none', fontWeight: '700' }}>
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}