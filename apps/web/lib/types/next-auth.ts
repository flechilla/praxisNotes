import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      organizationId?: string;
      isDefaultOrg?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    organizationId?: string;
    isDefaultOrg?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    organizationId?: string;
    isDefault?: boolean;
  }
}
