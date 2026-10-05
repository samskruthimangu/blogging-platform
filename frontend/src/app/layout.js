import NavigationBar from './components/NavigationBar';

export const metadata = {
  title: 'OpenBlog | Collaborative Publishing Network',
  description: 'An optimized full stack blogging environment.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: '1.5rem', background: '#f9fafb', color: '#111827' }}>
        <NavigationBar />
        <main style={{ maxWidth: '850px', margin: '0 auto' }}>{children}</main>
      </body>
    </html>
  );
}