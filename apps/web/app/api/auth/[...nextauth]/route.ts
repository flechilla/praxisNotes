import NextAuth from "next-auth";
import type { AuthSession, AuthUser, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db, withDb } from "../../../../lib/db";
import { organizationUsers, users } from "@praxisnotes/database";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await withDb(async () => {
          const [foundUser] = await db
            .select({
              id: users.id,
              email: users.email,
              fullName: users.fullName,
              firstName: users.firstName,
              lastName: users.lastName,
              avatarUrl: users.avatarUrl,
              passwordHash: users.passwordHash,
              organizationId: organizationUsers.organizationId,
              isDefault: organizationUsers.isDefault,
            })
            .from(users)
            .leftJoin(organizationUsers, eq(users.id, organizationUsers.userId))
            .where(eq(users.email, credentials.email.toLowerCase()))
            .groupBy(
              users.id,
              organizationUsers.organizationId,
              organizationUsers.isDefault,
            )
            .limit(1);
          return foundUser;
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.passwordHash,
        );

        if (!isPasswordValid) {
          return null;
        }

        const authUser = {
          id: user.id,
          email: user.email,
          name: user.fullName || `${user.firstName} ${user.lastName}`.trim(),
          image: user.avatarUrl,
          organizationId: user.organizationId,
          isDefault: user.isDefault,
        } as AuthUser;

        console.log("authUser", authUser);

        return authUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;

        // Fetch the user's organization
        const organizationUser = await withDb(async () => {
          const { organizationUsers } = await import("@praxisnotes/database");
          const [userOrg] = await db
            .select()
            .from(organizationUsers)
            .where(eq(organizationUsers.userId, user.id))
            .limit(1);
          return userOrg;
        });

        if (organizationUser) {
          token.organizationId = organizationUser.organizationId;
          token.isDefault = organizationUser.isDefault;
        }
      }
      return token;
    },
    async session({ session, token }) {
      const outputSession: AuthSession = {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          organizationId: token.organizationId as string,
          isDefaultOrg: token.isDefault as boolean,
        },
      };
      console.log("outputSession", outputSession);
      return outputSession;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
