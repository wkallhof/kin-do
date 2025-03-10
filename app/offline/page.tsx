import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-bold mb-6">You&apos;re offline</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        You appear to be offline. Check your internet connection and try again.
      </p>
      <Link 
        href="/welcome"
        className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Try again
      </Link>
    </div>
  );
} 