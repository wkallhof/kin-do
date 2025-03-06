import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { Session } from 'next-auth';

export async function auth(): Promise<Session | null> {
  return await getServerSession(authConfig);
}

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
} 