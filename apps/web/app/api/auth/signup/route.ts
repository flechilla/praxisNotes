import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db, withDb } from "../../../../lib/db";
import {
  users,
  insertUserSchema,
  organizations,
  organizationUsers,
} from "@praxisnotes/database";
import { ErrorCode } from "@praxisnotes/types";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json();

    // Validate using Zod schema
    try {
      insertUserSchema.parse({
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid input data", error },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await withDb(async () => {
      const [foundUser] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, body.email.toLowerCase()))
        .limit(1);
      return foundUser;
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already in use" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await hash(body.password, 12);

    // Create user and default organization (inside a transaction)
    const result = await withDb(async () => {
      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          email: body.email.toLowerCase(),
          firstName: body.firstName,
          lastName: body.lastName,
          passwordHash: hashedPassword,
          fullName: `${body.firstName} ${body.lastName}`.trim(),
          isActive: true,
          isEmailVerified: false, // We'd typically set this to true after email verification
        })
        .returning({ id: users.id });

      if (!newUser?.id) {
        throw new Error("Failed to create user");
      }

      // Create default organization for the user
      const orgName = `${body.firstName}'s Organization`;
      const orgSlug = `${body.firstName.toLowerCase()}-${newUser.id.substring(0, 8)}`;

      const [newOrg] = await db
        .insert(organizations)
        .values({
          name: orgName,
          slug: orgSlug,
          description: `Default organization for ${body.firstName} ${body.lastName}`,
        })
        .returning({ id: organizations.id });

      if (!newOrg?.id) {
        throw new Error("Failed to create organization");
      }

      // Link user to organization
      await db.insert(organizationUsers).values({
        userId: newUser.id,
        organizationId: newOrg.id,
        isDefault: true,
      });

      return { userId: newUser.id, organizationId: newOrg.id };
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        userId: result.userId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create user",
        code: ErrorCode.INTERNAL_SERVER_ERROR,
      },
      { status: 500 },
    );
  }
}
