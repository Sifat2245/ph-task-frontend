import Link from "next/link";
export default function NotFound() {
  return (
    <main className="standalone-error">
      <div className="empty-state">
        <span className="eyebrow">404 · A SMALL DETOUR</span>
        <h1>This page got away.</h1>
        <p>Let’s get you back to your workspace.</p>
        <Link href="/dashboard" className="btn btn-primary">
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
