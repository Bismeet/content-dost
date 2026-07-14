import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminLoginPage() {
  const { login, isAuthenticated, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated === true) {
      navigate('/admin/leads');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim() || !password.trim()) {
      setFormError('Both email and password are required');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      // Error message is handled by the hook
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#050604',
        color: '#f5f5ef',
        fontFamily: 'Manrope, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#0b0e07',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '32px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#f5f5ef',
              letterSpacing: '-0.03em',
              marginBottom: '8px',
            }}
          >
            Content Dost
          </h1>
          <p style={{ fontSize: '11px', color: '#686d61', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Administrator Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Email field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              htmlFor="email"
              style={{
                fontSize: '10px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: 'monospace',
                color: '#aaad9f',
              }}
            >
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#686d61',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Mail size={16} />
              </span>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@contentdost.agency"
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 38px',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  color: '#f5f5ef',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Password field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              htmlFor="password"
              style={{
                fontSize: '10px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: 'monospace',
                color: '#aaad9f',
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#686d61',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Lock size={16} />
              </span>
              <input
                id="password"
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 38px',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  color: '#f5f5ef',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Error Message */}
          {(formError || error) && (
            <div
              style={{
                backgroundColor: 'rgba(255, 59, 48, 0.08)',
                border: '1px solid rgba(255, 59, 48, 0.2)',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '11px',
                color: '#ff3b30',
                fontFamily: 'monospace',
                textAlign: 'center',
              }}
            >
              {formError || error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#d7ff00',
              border: 'none',
              borderRadius: '8px',
              color: '#050604',
              fontWeight: 700,
              fontSize: '13px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '12px',
              transition: 'background-color 0.2s',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
