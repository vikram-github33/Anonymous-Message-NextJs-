import bcrypt from "bcryptjs";
import dbConnect from "@/app/lib/dbConnect";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import UserModel from "@/app/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",

      credentials: {
        identifier: {
          label: "Email or Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        await dbConnect();

        try {
          console.log("Credentials received:", {
            identifier: credentials?.identifier,
            hasPassword: Boolean(credentials?.password),
          });

          if (!credentials?.identifier || !credentials?.password) {
            console.log("Missing credentials");
            return null;
          }

          const identifier = credentials.identifier.trim();

          const user = await UserModel.findOne({
            $or: [{ email: identifier }, { username: identifier }],
          });

          console.log("User found:", Boolean(user));
          console.log("User data:", user);
console.log("Message status:", user?.isAcceptingMessage);

          if (!user) {
            return null;
          }

          console.log("Verified:", user.isVerified);

          const passwordCorrect = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          console.log("Password correct:", passwordCorrect);

          if (!user.isVerified || !passwordCorrect) {
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.username,
            email: user.email,
            username: user.username,
            isVerified: user.isVerified,
            isAcceptingMessages: user.isAcceptingMessage,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          throw error;
        }
      },
    }),
  ],

  pages: {
    signIn: "/sign-in",
  },

  callbacks: {
    async jwt({ token, user }) {
      console.log("user=============",user)
      if (user) {
        token._id = user.id;
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
      }

      return token;
    },

    async session({ session, token }) {
      console.log("token",token)
      if (session.user) {
        session.user._id = token._id as string;
        session.user.username = token.username as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
      }

      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
