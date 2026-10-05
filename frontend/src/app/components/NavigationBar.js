'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function NavigationBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  if (pathname === '/login' || pathname === '/register') return null;

  return (
    <header style={{ maxWidth: '850px', margin: '0 auto 2rem auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
      <a href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: '#111827' }}>⚡ OpenBlog</a>
      <nav style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
        <a href="/" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500' }}>Home Feed</a>
        <a href="/dashboard" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500' }}>📊 Dashboard</a>
        <a href="/create" style={{ textDecoration: 'none', color: '#2563eb', fontWeight: '600' }}>+ Write Post</a>
        {isLoggedIn && (
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '1rem', fontWeight: '500', fontFamily: 'inherit' }}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}