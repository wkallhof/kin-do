import { Metadata } from "next";
import { PageHeader } from "@/app/(authenticated)/components/page-header";

export const metadata: Metadata = {
  title: "My Profile | Kin•Do",
  description: "Manage your account settings and preferences",
};

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container max-w-7xl py-6">
      <PageHeader
        title="My Profile"
        description="Manage your account settings and preferences"
      />
      
      <div className="mt-8 md:flex">
        <div className="flex-1">
          {children}
        </div>
      </div>
    </main>
  );
} 