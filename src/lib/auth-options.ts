import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Only register the Google provider when its credentials are configured.
// This prevents runtime crashes when GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
// are missing (e.g. Preview deployments or local dev without OAuth setup).
const googleConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

export const authOptions: NextAuthOptions = {
  providers: [
    ...(googleConfigured
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await db.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });
        if (!user || !user.password) {
          return null;
        }
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          return null;
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          if (!user.email) {
            return false;
          }
          const email = user.email.toLowerCase();
          const existing = await db.user.findUnique({
            where: { email },
          });
          if (!existing) {
            await db.user.create({
              data: {
                email,
                name: user.name,
                image: user.image,
                googleId: account.providerAccountId,
              },
            });
          } else if (!existing.googleId) {
            await db.user.update({
              where: { id: existing.id },
              data: {
                googleId: account.providerAccountId,
                image: user.image ?? existing.image,
                name: existing.name ?? user.name,
              },
            });
          }
        } catch (error) {
          console.error('Google signIn callback error:', error);
          // Let the OAuth flow complete; /api/auth/me will surface DB issues.
          return true;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === 'google' && user.email) {
          // For OAuth sign-ins, `user.id` is Google's profile id, NOT our DB id.
          // Resolve the real DB user so `token.sub` matches the User table.
          const dbUser = await db.user.findUnique({
            where: { email: user.email.toLowerCase() },
          });
          token.sub = dbUser?.id ?? token.sub;
        } else {
          // Credentials flow: user.id is already the DB id.
          token.sub = user.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.sub) {
        const dbUser = await db.user.findUnique({
          where: { id: token.sub as string },
        });
        if (dbUser) {
          session.user = {
            ...session.user,
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            image: dbUser.image,
          } as typeof session.user & { id: string };
        }
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
