import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ padding: '4rem', fontFamily: 'sans-serif', textAlign: 'center', lineHeight: '1.6' }}>
      <h1>Deployment Test Successful!</h1>
      <p>If you can see this, your app is being served correctly by Cloudflare.</p>
      <p>
        The original page tried to redirect you. You can now navigate to the dashboard using the link below.
      </p>
      <Link href="/dashboard" style={{ color: 'hsl(var(--primary))', textDecoration: 'underline', fontWeight: 'bold' }}>
        Proceed to your Dashboard
      </Link>
    </div>
  );
}
