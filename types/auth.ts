import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      phone?: string
      location?: string
      backendToken?: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string
    phone?: string
    location?: string
    backendToken?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    phone?: string
    location?: string
    backendToken?: string
  }
}