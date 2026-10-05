'use client';
import { useState } from 'react';

export default function CommentSection({ postId, initialComments }) {
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState('');

  const handlePostComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Authentication token expired. Please login again.');
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ post_id: postId, content: text }),
    });

    if (res.ok) {
      const freshComment = await res.json();
      setComments([...comments, freshComment]);
      setText('');
    } else {
      alert('Error updating server records.');
    }
  };

  return (
    <div>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', letterSpacing: '-0.025em' }}>Discussions ({comments.length})</h3>
      <form onSubmit={handlePostComment} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        <textarea placeholder="Join the discussion safely..." rows="3" value={text} onChange={e => setText(e.target.value)} required style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        <button type="submit" style={{ alignSelf: 'flex-start', background: '#111827', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Add Comment</button>
      </form>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {comments.map(c => (
          <div key={c._id} style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '6px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{c.user?.username || 'User'}</span>
            <p style={{ margin: '0.25rem 0 0 0', color: '#374151', lineHeight: '1.5' }}>{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}