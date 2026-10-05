'use client';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const fetchPosts = (query = '') => {
    setLoading(true);
    const url = query 
      ? `${process.env.NEXT_PUBLIC_API_URL}/posts?search=${encodeURIComponent(query)}`
      : `${process.env.NEXT_PUBLIC_API_URL}/posts`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      window.location.href = '/login'; 
      return;
    }

    fetchPosts();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPosts(searchTerm);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value === '') {
      fetchPosts('');
    }
  };

  if (!mounted) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      {/* 🔍 HEADER + SEARCH BAR ROW */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem', 
        flexWrap: 'wrap', 
        gap: '1rem' 
      }}>
        <h1 style={{ fontSize: '2.25rem', margin: 0, letterSpacing: '-0.025em' }}>
          Global Feed
        </h1>

        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '6px',
              border: '1.5px solid #d1d5db',
              outline: 'none',
              fontSize: '0.95rem',
              minWidth: '220px'
            }}
          />
          <button
            type="submit"
            style={{
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '4rem', color: '#6b7280' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Fetching articles...</p>
        </div>
      ) : posts.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No stories match your criteria.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {posts.map((post) => (
            <article
              key={post._id}
              style={{
                background: '#fff',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}
            >
              <h2 style={{ margin: '0 0 0.5rem 0' }}>
                <a href={`/blog/${post.slug}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                  {post.title}
                </a>
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 1rem 0' }}>
                By <strong>{post.author?.username || 'Community Creator'}</strong> •{' '}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <p style={{ color: '#374151', lineHeight: '1.6' }}>{post.content.substring(0, 180)}...</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}