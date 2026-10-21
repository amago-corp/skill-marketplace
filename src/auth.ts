import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      // ALLOWED_EMAILS 는 Sensitive 라 읽을 수 없으므로, 새 사람은 읽을 수 있는 ALLOWED_EMAILS_EXTRA 에 덧붙인다
      const allowed = [process.env.ALLOWED_EMAILS, process.env.ALLOWED_EMAILS_EXTRA]
        .join(",")
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
      if (allowed.length === 0) return true;
      return !!user.email && allowed.includes(user.email);
    },
  },
});
