import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import dbConnect from './db'
import User from '@/models/User'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        await dbConnect()

        // FIX: Add .select('+password') to include the hidden password field
        const user = await User.findOne({ email: credentials.email }).select('+password')

        if (!user) {
          console.log("User not found") // Debugging helper
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          console.log("Password invalid") // Debugging helper
          return null
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        await dbConnect()
        try {
          const existingUser = await User.findOne({ email: user.email })
          if (!existingUser) {
            const newUser = await User.create({
              name: user.name || profile?.name || 'Google User',
              email: user.email,
              image: user.image,
              password: bcrypt.hashSync(Math.random().toString(36).slice(-8), 10), // Dummy password
              role: 'user',
            })
          }
          return true
        } catch (error) {
          console.error("Error creating user from Google login", error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account, trigger, session }) {
      if (trigger === 'update' && session) {
        token.name = session.name
        token.email = session.email
        token.image = session.image
      }

      if (user) {
        token.role = user.role
        token.id = user.id
        token.image = user.image

        // If Google login, fetch the REAL MongoDB ID
        if (account?.provider === 'google') {
          await dbConnect()
          const dbUser = await User.findOne({ email: user.email })
          if (dbUser) {
            token.id = dbUser._id.toString()
            token.role = dbUser.role
            token.image = dbUser.image
          }
        }
      }

      // Always fetch fresh user data from DB to ensure session stays in sync
      if (token.id) {
        await dbConnect()
        const dbUser = await User.findById(token.id)
        if (dbUser) {
          token.name = dbUser.name
          token.email = dbUser.email
          token.image = dbUser.image
          token.role = dbUser.role
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
        session.user.image = token.image as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}