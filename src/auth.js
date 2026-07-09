import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect, { collectionNameObj } from "./lib/dbConnect";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const adminCollection = await dbConnect(
          collectionNameObj.adminCollection,
        );

        const admin = await adminCollection.findOne({
          email: credentials.email,
        });

        if (!admin) return null;

        const matched = await bcrypt.compare(
          credentials.password,
          admin.password,
        );

        if (!matched) return null;

        return {
          id: admin._id.toString(),
          email: admin.email,
          role: "admin",
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.role = token.role;

      return session;
    },
  },

  pages: {
    signIn: "/admin/login",
  },
});
