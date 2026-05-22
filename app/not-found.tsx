import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-brand-cream flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-[11px] uppercase tracking-[0.3em] text-brand-yellow mb-4">404</p>
        <h1 className="font-display text-5xl md:text-6xl text-brand-brown uppercase tracking-widest mb-4">
          Page Not Found
        </h1>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-12 h-px bg-brand-yellow/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
          <div className="w-12 h-px bg-brand-yellow/60" />
        </div>
        <p className="text-brand-brown-mid text-sm mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center uppercase tracking-[0.25em] text-xs font-medium px-10 py-4 bg-brand-yellow text-brand-brown hover:bg-brand-yellow-light transition-all duration-300"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
