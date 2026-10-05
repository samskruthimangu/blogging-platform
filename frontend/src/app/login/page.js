'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const router = useRouter();

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.field) {
          setErrors((prev) => ({ ...prev, [data.field]: data.message }));
        } else {
          setServerError(data.message || 'Login failed');
        }
        return;
      }

      localStorage.setItem('token', data.token);
      router.push('/');
    } catch (err) {
      setServerError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%', maxWidth: '420px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.75rem', fontWeight: '700' }}>Sign In to OpenBlog</h2>

        {serverError && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.6rem 0.8rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
          <div style={{ marginBottom: '1.25rem' }}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                border: `1px solid ${errors.email ? '#ef4444' : '#d1d5db'}`,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {errors.email && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.35rem', marginBottom: 0 }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                border: `1px solid ${errors.password ? '#ef4444' : '#d1d5db'}`,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {errors.password && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.35rem', marginBottom: 0 }}>
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              background: '#0f172a',
              color: '#fff',
              border: 'none',
              padding: '0.85rem',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#6b7280' }}>
          New writer? <a href="/register" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>Create an account</a>
        </p>
      </div>
    </div>
  );
}