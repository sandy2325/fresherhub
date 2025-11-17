import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // This would connect to your backend API
        // For now, returning mock user for demo
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (response.ok) {
            const user = await response.json();
            return {
              id: user.id,
              email: user.email,
              name: user.firstName || user.email.split('@')[0],
              image: user.avatarUrl,
            };
          } else {
            // For demo, allow simple email/password
            if (credentials?.email && credentials?.password && credentials.password.length >= 6) {
              return {
                id: '1',
                email: credentials.email,
                name: credentials.email.split('@')[0],
                image: null,
              };
            }
            return null;
          }
        } catch (error) {
          console.error('Auth error:', error);
          // Fallback for demo
          if (credentials?.email && credentials?.password && credentials.password.length >= 6) {
            return {
              id: '1',
              email: credentials.email,
              name: credentials.email.split('@')[0],
              image: null,
            };
          }
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/signup',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};