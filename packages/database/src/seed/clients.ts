import { db } from "../client";
import { clients, userClients, users } from "../schema";
import type { User } from "../schema/user.table";

/**
 * Seeds the clients table with sample clients
 */
export async function seed() {
  console.log("👪 Seeding clients...");

  try {
    // Get all organizations
    const allOrganizations = await db.query.organizations.findMany();

    console.log(`amount of organizations: ${allOrganizations.length}`);

    if (allOrganizations.length === 0) {
      throw new Error("Organizations must be seeded first");
    }

    // Sample client data
    const clientNames = [
      "John Smith",
      "Emma Johnson",
      "Michael Williams",
      "Olivia Brown",
      "William Jones",
      "Sophia Miller",
      "James Davis",
      "Isabella Wilson",
      "Benjamin Moore",
      "Mia Taylor",
      "Jacob Anderson",
      "Charlotte Thomas",
      "Ethan Jackson",
      "Amelia White",
      "Alexander Harris",
    ];

    console.log(`amount of clients to seed: ${clientNames.length}`);

    // Create clients, distributing them among organizations
    for (let i = 0; i < clientNames.length; i++) {
      const name = clientNames[i] || "Unknown Client";
      // Distribute clients among organizations
      const orgIndex = i % allOrganizations.length;
      const organization = allOrganizations[orgIndex];

      if (organization) {
        await db.insert(clients).values({
          name,
          email: `${name.toLowerCase().replace(/\s+/g, ".")}@client.example.com`,
          phone: `555-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, "0")}`,
          address: `${Math.floor(Math.random() * 9000) + 1000} Main St, Example City, EX ${String(Math.floor(Math.random() * 90000) + 10000).padStart(5, "0")}`,
          notes: `Sample client notes for ${name}`,
          organizationId: organization.id,
        });
      }
    }

    console.log("✅ Clients seeded successfully");

    // Associate clients with users (therapists/supervisors)
    const allClients = await db.query.clients.findMany();

    console.log(`amount of clients: ${allClients.length}`);

    // Get users with therapist or supervisor roles
    const therapistRoleId = (
      await db.query.roles.findFirst({
        where: (role, { eq }) => eq(role.name, "therapist"),
      })
    )?.id;

    const supervisorRoleId = (
      await db.query.roles.findFirst({
        where: (role, { eq }) => eq(role.name, "supervisor"),
      })
    )?.id;

    if (!therapistRoleId && !supervisorRoleId) {
      console.warn(
        "No therapist or supervisor roles found, skipping client-user associations",
      );
      return;
    }

    console.log("getting users with therapist or supervisor roles");
    // Get all users with therapist or supervisor roles
    const userRolesResult = await db.query.userRoles.findMany({
      where: (userRole, { or, eq }) =>
        or(
          therapistRoleId ? eq(userRole.roleId, therapistRoleId) : undefined,
          supervisorRoleId ? eq(userRole.roleId, supervisorRoleId) : undefined,
        ),
      with: {
        user: true,
      },
    });

    console.log(
      `amount of users with therapist or supervisor roles: ${userRolesResult.length}`,
    );

    // Define the type that matches what the query returns
    type UserRoleWithUser = {
      userId: string;
      roleId: string;
      createdAt: Date;
      updatedAt: Date;
      user: User;
    };

    // Cast the result to the correct type
    const userRolesWithUsers = userRolesResult as UserRoleWithUser[];

    const therapistsAndSupervisors = userRolesWithUsers
      .map((ur) => ur.user)
      .filter((user): user is User => user !== null);

    if (therapistsAndSupervisors.length === 0) {
      console.warn(
        "No therapists or supervisors found, skipping client-user associations",
      );
      return;
    }

    // For each client, assign 1-3 therapists/supervisors
    for (const client of allClients) {
      // Assign 1-3 random therapists/supervisors
      const userCount = Math.floor(Math.random() * 3) + 1;
      const assignedUsers = new Set<string>();

      for (let i = 0; i < userCount; i++) {
        const randomUserIndex = Math.floor(
          Math.random() * therapistsAndSupervisors.length,
        );
        const user = therapistsAndSupervisors[randomUserIndex];

        if (user && !assignedUsers.has(user.id)) {
          assignedUsers.add(user.id);

          // Check if the user belongs to the same organization as the client
          const userInOrg = await db.query.organizationUsers.findFirst({
            where: (ou, { and, eq }) =>
              and(
                eq(ou.userId, user.id),
                eq(ou.organizationId, client.organizationId),
              ),
          });

          // Only create association if user is in the same organization
          if (userInOrg) {
            await db.insert(userClients).values({
              userId: user.id,
              clientId: client.id,
            });
          }
        }
      }
    }

    console.log("✅ Clients seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding clients:", error);
    throw error;
  }
}
