import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { queryClient } from "../client";

async function createTestUser() {
  try {
    console.log("Creating test user for authentication...");

    // Create a test password with consistent hash
    const email = "test@example.com";
    const password = "Test123!";
    const passwordHash = await hash(password, 12);
    const userId = uuidv4();

    // Check if user already exists
    const existingUser = await queryClient`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      console.log(`User ${email} already exists, updating password...`);
      await queryClient`
        UPDATE users 
        SET password_hash = ${passwordHash}
        WHERE email = ${email}
      `;
    } else {
      // Insert the user
      console.log(`Creating new user: ${email}`);
      await queryClient`
        INSERT INTO users (
          id, email, first_name, last_name, full_name, 
          password_hash, is_active, is_email_verified, auth_provider
        ) VALUES (
          ${userId}, ${email}, 'Test', 'User', 'Test User', 
          ${passwordHash}, true, true, 'credentials'
        )
      `;
    }

    // Check for organization
    const organizations = await queryClient`
      SELECT id FROM organizations WHERE name = 'Test Organization'
    `;

    let organizationId;
    if (organizations.length === 0) {
      // Create a test organization
      organizationId = uuidv4();
      await queryClient`
        INSERT INTO organizations (id, name, slug, description)
        VALUES (
          ${organizationId}, 
          'Test Organization', 
          'test-organization', 
          'Organization for testing authentication'
        )
      `;
      console.log("Created test organization");
    } else {
      organizationId = organizations[0].id;
      console.log("Using existing test organization");
    }

    // Check if user is already linked to organization
    const orgUsers = await queryClient`
      SELECT * FROM organization_users 
      WHERE user_id = ${userId} AND organization_id = ${organizationId}
    `;

    if (orgUsers.length === 0) {
      // Link user to organization
      await queryClient`
        INSERT INTO organization_users (user_id, organization_id, is_default)
        VALUES (${userId}, ${organizationId}, true)
      `;
      console.log("Linked user to organization");
    }

    console.log("\n-------------------------------------------");
    console.log("🎉 Test user created successfully!");
    console.log("-------------------------------------------");
    console.log("Use these credentials to log in:");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("-------------------------------------------\n");
  } catch (error) {
    console.error("Error creating test user:", error);
  } finally {
    await queryClient.end();
  }
}

// Execute the function
createTestUser();
