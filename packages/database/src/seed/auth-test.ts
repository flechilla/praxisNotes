import { db } from "../client";
import {
  users,
  organizations,
  organizationUsers,
  roles,
  userRoles,
} from "../schema";
import { hash } from "bcryptjs";

/**
 * This is a special script to create a test user with known credentials for authentication testing
 */
export async function seedAuthTestUser() {
  console.log("👤 Creating authentication test user...");

  try {
    // Create a test password hash
    const testPassword = "Password123!";
    const passwordHash = await hash(testPassword, 12);

    // Create the test user with a consistent password hash
    const [testUser] = await db
      .insert(users)
      .values({
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        fullName: "Test User",
        isActive: true,
        isEmailVerified: true,
        authProvider: "credentials",
        passwordHash,
      })
      .returning();

    console.log(`Created test user with email: ${testUser.email}`);
    console.log(`Password: ${testPassword}`);

    // Create a test organization if needed
    let testOrg = await db.query.organizations.findFirst({
      where: (org, { eq }) => eq(org.name, "Test Organization"),
    });

    if (!testOrg) {
      [testOrg] = await db
        .insert(organizations)
        .values({
          name: "Test Organization",
          slug: "test-organization",
          description: "Organization for testing authentication",
        })
        .returning();

      console.log(`Created test organization: ${testOrg.name}`);
    }

    // Link user to organization
    await db.insert(organizationUsers).values({
      userId: testUser.id,
      organizationId: testOrg.id,
      isDefault: true,
    });

    // Assign admin role if it exists
    const adminRole = await db.query.roles.findFirst({
      where: (role, { eq }) => eq(role.name, "admin"),
    });

    if (adminRole) {
      await db.insert(userRoles).values({
        userId: testUser.id,
        roleId: adminRole.id,
      });
      console.log("Assigned admin role to test user");
    }

    console.log("✅ Authentication test user created successfully");
    console.log("You can now log in with:");
    console.log(`Email: ${testUser.email}`);
    console.log(`Password: ${testPassword}`);
  } catch (error) {
    console.error("❌ Error creating authentication test user:", error);
  }
}
