import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  if (session?.user) {
    redirect("/activities");
  }

  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
} 