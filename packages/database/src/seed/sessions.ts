import { db } from "../client";
import { sessions, reports } from "../schema";

/**
 * Seeds the sessions table with sample sessions
 */
export async function seed() {
  console.log("📅 Seeding sessions...");

  try {
    // Get all clients
    const allClients = await db.query.clients.findMany();

    if (allClients.length === 0) {
      throw new Error("Clients must be seeded first");
    }

    // Get all users
    const allUsers = await db.query.users.findMany();

    if (allUsers.length === 0) {
      throw new Error("Users must be seeded first");
    }

    // Create 1-3 sessions for each client
    for (const client of allClients) {
      // Find users who are associated with this client
      const userClientsResult = await db.query.userClients.findMany({
        where: (uc, { eq }) => eq(uc.clientId, client.id),
        with: {
          user: true,
        },
      });

      const clientUsers = userClientsResult
        .map((uc) => uc.user)
        .filter(Boolean);

      if (clientUsers.length === 0) {
        continue; // Skip if no users are associated with this client
      }

      // Create 1-3 sessions for this client
      const sessionCount = Math.floor(Math.random() * 3) + 1;

      for (let i = 0; i < sessionCount; i++) {
        // Random date within the last 30 days
        const sessionDate = new Date();
        sessionDate.setDate(
          sessionDate.getDate() - Math.floor(Math.random() * 30),
        );

        // Random user from client's assigned users
        const randomUser =
          clientUsers[Math.floor(Math.random() * clientUsers.length)];

        if (!randomUser) continue;

        // Use valid session status values
        const statusValues = ["draft", "submitted", "reviewed"] as const;
        const randomStatus =
          statusValues[Math.floor(Math.random() * statusValues.length)];

        // Create session
        const sessionResult = await db
          .insert(sessions)
          .values({
            clientId: client.id,
            userId: randomUser.id,
            sessionDate,
            startTime: sessionDate,
            endTime: new Date(sessionDate.getTime() + 60 * 60 * 1000), // 1 hour later
            location: "Office",
            status: randomStatus,
            isActivityBased: Math.random() > 0.5,
          })
          .returning();

        // For completed sessions, create a report
        if (sessionResult.length > 0) {
          const session = sessionResult[0];
          if (session) {
            await db.insert(reports).values({
              sessionId: session.id,
              userId: randomUser.id,
              clientId: client.id,
              summary: `Session summary for ${client.firstName} ${client.lastName} on ${sessionDate.toLocaleDateString()}`,
              fullContent: `Detailed notes for the session with ${client.firstName} ${client.lastName} on ${sessionDate.toLocaleDateString()}. 
This session focused on behavior management and skill development.`,
              status: "draft",
            });
          }
        }
      }
    }

    console.log("✅ Sessions seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding sessions:", error);
    throw error;
  }
}
