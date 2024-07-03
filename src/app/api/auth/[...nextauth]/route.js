import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@/db";
import User from "@/models/user.models";

const handleProvider = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXT_PUBLIC_SECRET,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      await connectToDB();

      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        await User.create({
          email: user.email,
          role: "subscriber",
        });
      }
      return true;
    },
    async session({ session, user }) {
      await connectToDB();

      const dbUser = await User.findOne({ email: session.user.email });

      if (dbUser) {
        session.user.role = dbUser.role;
        session.user.id = dbUser._id;
      }

      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});

export { handleProvider as GET, handleProvider as POST };
