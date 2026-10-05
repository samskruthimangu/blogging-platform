import CommentSection from './CommentSection';

export async function generateMetadata({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${params.slug}`);
  if (!res.ok) return { title: 'Post Not Found' };
  const post = await res.json();
  return {
    title: `${post.title} | OpenBlog`,
    description: post.content.substring(0, 150),
  };
}

export default async function BlogPostPage({ params }) {
  const postRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${params.slug}`, { cache: 'no-store' });
  if (!postRes.ok) return <h1 style={{ textAlign: 'center', marginTop: '4rem' }}>Post not found</h1>;
  const post = await postRes.json();

  const commentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${post._id}`, { cache: 'no-store' });
  const initialComments = commentRes.ok ? await commentRes.json() : [];

  return (
    <article style={{ background: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', letterSpacing: '-0.025em' }}>{post.title}</h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Published by <strong>{post.author?.username}</strong> on {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', fontSize: '1.1rem', color: '#1f2937' }}>
        {post.content}
      </div>
      <hr style={{ border: '0', borderTop: '1px solid #e5e7eb', margin: '3rem 0' }} />
      <CommentSection postId={post._id} initialComments={initialComments} />
    </article>
  );
}