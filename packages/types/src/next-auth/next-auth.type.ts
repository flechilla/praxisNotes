/**
 * NextAuth type declarations
 * These module augmentations extend the NextAuth default types with application-specific fields
 */
import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extends the default NextAuth Session type
   * Adds user-specific fields needed across the application
   */
  interface Session {
    user: {
      id: string;
      organizationId?: string; // Current active organization
      isDefaultOrg?: boolean; // Whether this is the user's default organization
    } & DefaultSession["user"];
  }

  /**
   * Extends the default NextAuth User type
   */
  interface User {
    id: string;
    organizationId?: string;
    isDefaultOrg?: boolean;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extends the default JWT type to include custom claims
   */
  interface JWT {
    id: string;
    organizationId?: string;
    isDefault?: boolean;
  }
}
