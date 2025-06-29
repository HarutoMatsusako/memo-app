import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development",
  callbacks: {
    session: ({ session, token }: any) => {
      console.log("Session callback - token:", token);
      console.log("Session callback - session:", session);

      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      };
    },
    jwt: ({ token, user, account }: any) => {
      console.log("JWT callback - token:", token);
      console.log("JWT callback - user:", user);
      console.log("JWT callback - account:", account);

      if (user) {
        token.sub = user.id || token.sub;
      }
      if (account) {
        token.sub = token.sub;
      }

      console.log("JWT callback - final token:", token);
      return token;
    },
  },
  debug: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
