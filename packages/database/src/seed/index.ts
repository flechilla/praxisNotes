import postgres from "postgres";
import "dotenv/config";

// Validate environment variable
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Database connection URL from environment
const connectionString = process.env.DATABASE_URL;

/**
 * Seed function to populate the database with initial data
 */
async function seed() {
  console.log("🌱 Starting database seeding...");

  // Create a Postgres client for seeding
  const sql = postgres(connectionString);

  try {
    // Create default roles
    console.log("Creating roles...");
    const adminRole = await sql`
      INSERT INTO roles (name, description)
      VALUES ('admin', 'Administrator with full access')
      RETURNING *
    `;

    const userRole = await sql`
      INSERT INTO roles (name, description)
      VALUES ('user', 'Regular user with limited access')
      RETURNING *
    `;

    if (!adminRole[0] || !userRole[0]) {
      throw new Error("Failed to create roles");
    }

    console.log(`Created ${adminRole[0].name} and ${userRole[0].name} roles`);

    // Create default organization
    console.log("Creating default organization...");
    const defaultOrg = await sql`
      INSERT INTO organizations (name, slug, description)
      VALUES ('Default Organization', 'default-organization', 'Default organization created during seeding')
      RETURNING *
    `;

    if (!defaultOrg[0]) {
      throw new Error("Failed to create organization");
    }

    console.log(`Created organization: ${defaultOrg[0].name}`);

    // Create admin user
    console.log("Creating admin user...");
    const adminUser = await sql`
      INSERT INTO users (email, first_name, last_name, full_name, is_active, is_email_verified)
      VALUES ('admin@example.com', 'Admin', 'User', 'Admin User', true, true)
      RETURNING *
    `;

    if (!adminUser[0]) {
      throw new Error("Failed to create admin user");
    }

    console.log(`Created user: ${adminUser[0].email}`);

    // Associate admin user with the default organization
    await sql`
      INSERT INTO organization_users (organization_id, user_id, is_default)
      VALUES (${defaultOrg[0].id}, ${adminUser[0].id}, true)
    `;

    console.log(`Associated user with organization`);

    // Assign admin role to admin user
    await sql`
      INSERT INTO user_roles (user_id, role_id)
      VALUES (${adminUser[0].id}, ${adminRole[0].id})
    `;

    console.log(`Assigned admin role to user`);

    // Create a sample client
    console.log("Creating sample client...");
    const sampleClient = await sql`
      INSERT INTO clients (name, email, organization_id)
      VALUES ('Sample Client', 'client@example.com', ${defaultOrg[0].id})
      RETURNING *
    `;

    if (!sampleClient[0]) {
      throw new Error("Failed to create sample client");
    }

    console.log(`Created client: ${sampleClient[0].name}`);

    // Associate client with admin user
    await sql`
      INSERT INTO user_clients (user_id, client_id)
      VALUES (${adminUser[0].id}, ${sampleClient[0].id})
    `;

    console.log(`Associated client with user`);

    console.log("✅ Seeding completed successfully");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  } finally {
    // Close the database connection
    await sql.end();
  }
}

// Run seed function
seed()
  .then(() => {
    console.log("Seeding completed. Exiting...");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed with error:", error);
    process.exit(1);
  });
