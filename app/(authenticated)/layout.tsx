import { redirect } from "next/navigation";
import { MainNav } from "./components/main-nav";
import { UserNav } from "./components/user-nav";
import { MobileNav } from "./components/mobile-nav";
import { auth } from "@/lib/auth";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Desktop Header - Hidden on Mobile */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hidden md:block">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <MainNav />
            <UserNav user={session.user} />
          </div>
        </div>
      </header>

      {/* Main Content - Adjusted Padding for Mobile Nav */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 pb-[80px] md:pb-8">
          {children}
        </div>
      </main>

      {/* Mobile Navigation - Hidden on Desktop */}
      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  );
} 