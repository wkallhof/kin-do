"use client";

interface ProfilePageLayoutProps {
  children: React.ReactNode;
}

export function ProfilePageLayout({ children }: ProfilePageLayoutProps) {
  return (
    <div className="md:flex">
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
} 