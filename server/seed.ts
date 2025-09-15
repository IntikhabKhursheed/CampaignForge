import { randomUUID } from "crypto";
import { getDb } from "./db";
import type { User, Campaign, Contact, Task, Activity } from "@shared/models";

export async function seedDatabase() {
  try {
    console.log("Starting MongoDB database seeding...");

    const db = await getDb();
    console.log("Connected to MongoDB");

    // Ensure indexes
    await db.collection<User>("users").createIndex({ username: 1 }, { unique: true });
    await db.collection<Campaign>("campaigns").createIndex({ userId: 1, createdAt: -1 });
    await db.collection<Contact>("contacts").createIndex({ userId: 1, createdAt: -1 });
    await db.collection<Task>("tasks").createIndex({ userId: 1, createdAt: -1 });
    await db.collection<Activity>("activities").createIndex({ userId: 1, createdAt: -1 });

    // Upsert default user
    const user: User = {
      id: randomUUID(),
      username: "founder",
      password: "password",
      name: "Sarah Chen",
      email: "sarah@startup.com",
      role: "founder",
    };
    const userRes = await db.collection<User>("users").findOneAndUpdate(
      { username: user.username },
      { $setOnInsert: user },
      { upsert: true, returnDocument: "after" }
    );
    const userId = (userRes?.value ?? user).id;
    console.log("Ensured user:", (userRes?.value ?? user).name);

    // Campaigns
    const emailCampaign: Campaign = {
      id: randomUUID(),
      name: "Summer Product Launch",
      type: "email",
      status: "active",
      description: "Email campaign for new product launch",
      targetAudience: "Enterprise customers",
      budget: 5000,
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
      metrics: { leads: 1234, conversions: 52, roi: 285 },
    } as Campaign;

    const socialCampaign: Campaign = {
      id: randomUUID(),
      name: "Social Media Boost",
      type: "social",
      status: "active",
      description: "Multi-platform social media campaign",
      targetAudience: "SMB customers",
      budget: 3000,
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
      metrics: { leads: 892, conversions: 34, roi: 192 },
    } as Campaign;

    await db.collection<Campaign>("campaigns").insertMany([emailCampaign, socialCampaign]);
    console.log("Created campaigns:", emailCampaign.name, socialCampaign.name);

    // Contacts
    const sampleContacts: Contact[] = [
      {
        id: randomUUID(),
        firstName: "Alex",
        lastName: "Johnson",
        email: "alex@techcorp.com",
        company: "TechCorp",
        leadScore: 90,
        status: "qualified",
        tags: ["enterprise", "decision-maker"],
        notes: null,
        phone: null,
        position: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
      } as Contact,
      {
        id: randomUUID(),
        firstName: "Maria",
        lastName: "Garcia",
        email: "maria@innovate.com",
        company: "Innovate Solutions",
        leadScore: 60,
        status: "nurturing",
        tags: ["mid-market", "interested"],
        notes: null,
        phone: null,
        position: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
      } as Contact,
    ];
    await db.collection<Contact>("contacts").insertMany(sampleContacts);
    console.log("Created contacts:", sampleContacts.length);

    // Tasks
    const sampleTasks: Task[] = [
      {
        id: randomUUID(),
        title: "Review Q3 Campaign Performance",
        description: "Analyze metrics and prepare report",
        status: "in-progress",
        priority: "high",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
        assignedTo: null,
        category: null,
        campaignId: null,
        userId,
      } as Task,
      {
        id: randomUUID(),
        title: "Follow up with qualified leads",
        description: "Schedule calls with hot leads from email campaign",
        status: "pending",
        priority: "medium",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
        assignedTo: null,
        category: null,
        campaignId: null,
        userId,
      } as Task,
    ];
    await db.collection<Task>("tasks").insertMany(sampleTasks);
    console.log("Created tasks:", sampleTasks.length);

    // Activities
    const sampleActivities: Activity[] = [
      {
        id: randomUUID(),
        type: "campaign_created",
        title: "Campaign Created",
        description: "Summer Product Launch campaign was created",
        userId,
        metadata: { campaignId: emailCampaign.id, campaignName: emailCampaign.name },
        createdAt: new Date(),
      } as Activity,
      {
        id: randomUUID(),
        type: "contact_added",
        title: "New Contact Added",
        description: "Alex Johnson from TechCorp was added to contacts",
        userId,
        metadata: { contactId: sampleContacts[0].id, company: sampleContacts[0].company },
        createdAt: new Date(),
      } as Activity,
    ];
    await db.collection<Activity>("activities").insertMany(sampleActivities);
    console.log("Created activities:", sampleActivities.length);

    console.log("MongoDB seeding completed successfully!");
    return true;
  } catch (error) {
    console.error("Database seeding failed:", error);
    return false;
  }
}

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Seeding script failed:", error);
      process.exit(1);
    });
}