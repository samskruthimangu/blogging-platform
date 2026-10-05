'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [userPosts, setUserPosts] = useState([]);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      setUsername(tokenPayload.username || 'Author');
    } catch (e) {
      console.error('Error decoding token payload', e);
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((myPosts) => {
        setUserPosts(myPosts);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        // Immediately remove the deleted article from state to update UI
        setUserPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete post');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('An error occurred while deleting the article');
    }
  };

  if (loading) {
    return (
      <p style={{ textAlign: 'center', marginTop: '4rem', color: '#6b7280' }}>
        Loading your personal workspace...
      </p>
    );
  }

  return (
    <div
      style={{
        background: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}
    >
      <div style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, letterSpacing: '-0.025em' }}>Welcome back, {username}!</h1>
        <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
          Manage your published content and author settings.
        </p>
      </div>

      <section>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#374151' }}>
          Your Published Articles ({userPosts.length})
        </h3>
        {userPosts.length === 0 ? (
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              background: '#f9fafb',
              borderRadius: '6px',
              border: '1px dashed #d1d5db'
            }}
          >
            <p style={{ color: '#9ca3af', margin: '0 0 1rem 0' }}>
              You haven't written any articles yet.
            </p>
            <a
              href="/create"
              style={{
                display: 'inline-block',
                background: '#2563eb',
                color: '#fff',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}
            >
              Write Your First Post
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {userPosts.map((post) => (
              <div
                key={post._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  border: '1px solid #f3f4f6',
                  borderRadius: '6px',
                  background: '#f9fafb'
                }}
              >
                <div>
                  <strong style={{ fontSize: '1.1rem', color: '#111827' }}>{post.title}</strong>
                  <span style={{ fontSize: '0.85rem', color: '#9ca3af', marginLeft: '10px' }}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <a
                    href={`/blog/${post.slug}`}
                    style={{ textDecoration: 'none', color: '#2563eb', fontWeight: '600' }}
                  >
                    View Post ↗
                  </a>
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    style={{
                      background: '#fee2e2',
                      color: '#dc2626',
                      border: '1px solid #fca5a5',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.85rem'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}