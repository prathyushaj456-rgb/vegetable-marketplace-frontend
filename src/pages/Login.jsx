import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Login({ triggerToast }) {
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        role
      });

      const { user } = response.data;
      localStorage.setItem('user', JSON.stringify(user));

      if (triggerToast) {
        triggerToast(`Welcome back, ${user.name}! 👋`);
      }

      setTimeout(() => {
        if (user.role === 'vendor') {
          window.location.href = '/vendor';
        } else if (user.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      }, 600);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Connection to server failed. Please check network.');
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
        maxWidth: '460px',
        padding: '40px 36px',
        border: '1px solid rgba(226, 232, 240, 0.8)'
      }}>
        {/* LOGO & TITLE HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            backgroundColor: '#dcfce7',
            color: '#16a34a',
            borderRadius: '16px',
            fontSize: '28px',
            marginBottom: '14px',
            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.15)'
          }}>
            🥬
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Welcome to FreshCart
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            Sign in to access your marketplace account
          </p>
        </div>

        {/* ERROR NOTIFICATION */}
        {errorMessage && (
          <div style={{
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontWeight: '600',
            fontSize: '13px',
            textAlign: 'center',
            border: '1px solid #fecaca',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* ROLE SEGMENTED CONTROL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Select Account Type
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

          {/* EMAIL INPUT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                fontSize: '14px',
                color: '#0f172a'
              }}
            />
          </div>

          {/* PASSWORD INPUT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                fontSize: '14px',
                color: '#0f172a'
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
              marginTop: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? 'Signing In...' : `Sign In as ${role === 'vendor' ? 'Vendor 🏪' : role === 'admin' ? 'Admin 👑' : 'Customer 🛒'}`}
          </button>

          {/* REGISTER LINK */}
          <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', margin: '8px 0 0 0' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#16a34a', textDecoration: 'none', fontWeight: '700' }}>
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}