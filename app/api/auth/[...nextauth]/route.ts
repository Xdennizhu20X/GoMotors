import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

// Función para sincronizar usuario con nuestro backend
async function syncUserWithBackend(userData: any) {
  try {
    // Verificar si tenemos las variables de entorno necesarias
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.log('No NEXT_PUBLIC_API_URL found, skipping backend sync');
      return null;
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    const syncUrl = `${backendUrl}/auth/oauth-sync`;

    console.log('Syncing with backend at:', syncUrl);

    // Timeout para evitar que cuelgue indefinidamente
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos

    const response = await fetch(syncUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        avatar: userData.image,
        provider: 'google',
        providerId: userData.id,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn('Backend sync failed with status:', response.status, response.statusText);
      return null;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('Backend response is not JSON, continuing without sync');
      return null;
    }

    const result = await response.json();
    console.log('Backend sync result:', result);

    if (result.success || result.status === 'success') {
      return result.data || result;
    }

    console.log('Backend sync failed, continuing without sync:', result);
    return null;
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      console.warn('Backend sync timeout, continuing without sync');
    } else {
      console.warn('Error syncing user with backend, continuing without sync:', error?.message || error);
    }
    return null;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Aquí deberías validar contra tu base de datos
        // Por ahora, retornamos un usuario simulado para testing
        const user = {
          id: '1',
          email: credentials.email,
          name: 'Usuario Demo',
        }

        return user
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log('SignIn callback triggered:', { provider: account?.provider, user: user?.email });

        // Solo sincronizar para proveedores OAuth (Google)
        if (account?.provider === 'google' && user) {
          console.log('Google OAuth sign in detected, attempting backend sync...');

          const syncedUser = await syncUserWithBackend({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          });

          if (syncedUser) {
            // Agregar datos del backend al usuario
            user.id = syncedUser.user?.id || syncedUser.id || user.id;
            user.phone = syncedUser.user?.phone || syncedUser.phone;
            user.location = syncedUser.user?.location || syncedUser.location;

            // Guardar token del backend en el cliente
            if (syncedUser.token) {
              user.backendToken = syncedUser.token;
              console.log('Backend token saved to user');
            }

            console.log('User synced successfully with backend');
          } else {
            console.log('Backend sync skipped or failed, continuing with OAuth login');
          }
        }
        return true;
      } catch (error: any) {
        console.warn('Error in signIn callback, continuing with login:', error?.message || error);
        return true; // Continuar con el login incluso si hay errores
      }
    },
    async jwt({ token, user, account }) {
      try {
        if (user) {
          token.id = user.id;
          token.phone = user.phone;
          token.location = user.location;
          token.backendToken = user.backendToken;
        }
        return token;
      } catch (error: any) {
        console.warn('Error in jwt callback:', error?.message || error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (session.user) {
          session.user.id = token.id as string;
          session.user.phone = token.phone as string;
          session.user.location = token.location as string;
          session.user.backendToken = token.backendToken as string;
        }
        return session;
      } catch (error) {
        if (error instanceof Error) {
          console.warn('Error in session callback:', error.message);
        }
        return session;
      }
    },
  },
  pages: {
    signIn: '/auth',
  },
})

export { handler as GET, handler as POST }