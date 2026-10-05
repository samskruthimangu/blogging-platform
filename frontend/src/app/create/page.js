'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        setTitle('');
        setContent('');
        router.push('/');
        router.refresh();
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to publish story');
      }
    } catch (err) {
      alert('A network error occurred. Please verify your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.03)' }}>
      <h2 style={{ marginTop: 0, marginBottom: '1.5rem', letterSpacing: '-0.025em' }}>Draft a New Story</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <input type="text" placeholder="Inspirational Title" value={title} onChange={e => setTitle(e.target.value)} required disabled={isSubmitting} style={{ padding: '0.75rem', fontSize: '1.25rem', borderRadius: '6px', border: '1px solid #d1d5db', outlineColor: '#2563eb' }} />
        <textarea placeholder="Tell your deep narrative..." rows="12" value={content} onChange={e => setContent(e.target.value)} required disabled={isSubmitting} style={{ padding: '0.75rem', fontSize: '1rem', borderRadius: '6px', border: '1px solid #d1d5db', fontFamily: 'inherit', lineHeight: '1.6', outlineColor: '#2563eb' }} />
        <button type="submit" disabled={isSubmitting} style={{ padding: '0.75rem', background: isSubmitting ? '#93c5fd' : '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
          {isSubmitting ? 'Publishing Story...' : 'Publish Article'}
        </button>
      </form>
    </div>
  );
}