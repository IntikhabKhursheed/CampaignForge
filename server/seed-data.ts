import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const MONGODB_DB = process.env.MONGODB_DB || "CampaignForge";

async function seedData() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(MONGODB_DB);
    
    console.log("🌱 Seeding sample data...");
    
    // Sample user ID (you can replace with actual user ID after registration)
    const userId = "demo-user-id";
    
    // Clear existing data
    await db.collection("campaigns").deleteMany({ userId });
    await db.collection("contacts").deleteMany({ userId });
    await db.collection("tasks").deleteMany({ userId });
    await db.collection("activities").deleteMany({ userId });
    
    // Sample campaigns
    const campaigns = [
      {
        id: uuidv4(),
        name: "Summer Product Launch",
        description: "Launch campaign for our new summer product line",
        type: "email",
        status: "active",
        targetAudience: "Young professionals 25-35",
        budget: 15000,
        startDate: new Date("2024-06-01"),
        endDate: new Date("2024-08-31"),
        metrics: { leads: 1250, conversions: 89, roi: 285 },
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: "Social Media Awareness",
        description: "Increase brand awareness through social media channels",
        type: "social",
        status: "active",
        targetAudience: "Millennials and Gen Z",
        budget: 8000,
        startDate: new Date("2024-05-15"),
        endDate: new Date("2024-07-15"),
        metrics: { leads: 890, conversions: 45, roi: 192 },
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: "Content Marketing Strategy",
        description: "Educational content to drive organic traffic",
        type: "content",
        status: "in_progress",
        targetAudience: "Business decision makers",
        budget: 12000,
        startDate: new Date("2024-07-01"),
        endDate: new Date("2024-12-31"),
        metrics: { leads: 567, conversions: 78, roi: 348 },
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: "Holiday Sales Campaign",
        description: "Black Friday and holiday season promotions",
        type: "email",
        status: "draft",
        targetAudience: "Existing customers",
        budget: 25000,
        startDate: new Date("2024-11-01"),
        endDate: new Date("2024-12-31"),
        metrics: { leads: 0, conversions: 0, roi: 0 },
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Sample contacts
    const contacts = [
      {
        id: uuidv4(),
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@techcorp.com",
        phone: "+1-555-0123",
        company: "TechCorp Solutions",
        position: "Marketing Director",
        leadScore: 85,
        status: "qualified",
        source: "LinkedIn Campaign",
        tags: ["enterprise", "decision-maker"],
        notes: "Very interested in our enterprise solution. Scheduled demo for next week.",
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        firstName: "Michael",
        lastName: "Chen",
        email: "m.chen@startup.io",
        phone: "+1-555-0124",
        company: "StartupIO",
        position: "CEO",
        leadScore: 92,
        status: "contacted",
        source: "Summer Product Launch",
        tags: ["startup", "ceo"],
        notes: "Founder of fast-growing startup. High potential for partnership.",
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        firstName: "Emily",
        lastName: "Rodriguez",
        email: "emily.r@designstudio.com",
        phone: "+1-555-0125",
        company: "Creative Design Studio",
        position: "Creative Director",
        leadScore: 67,
        status: "new",
        source: "Social Media Awareness",
        tags: ["creative", "design"],
        notes: "Interested in our design tools. Needs pricing information.",
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        firstName: "David",
        lastName: "Kim",
        email: "david.kim@enterprise.com",
        phone: "+1-555-0126",
        company: "Enterprise Solutions Inc",
        position: "VP of Operations",
        leadScore: 78,
        status: "qualified",
        source: "Content Marketing Strategy",
        tags: ["enterprise", "operations"],
        notes: "Looking for scalable solutions for their growing team.",
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        firstName: "Lisa",
        lastName: "Thompson",
        email: "lisa.t@smallbiz.com",
        phone: "+1-555-0127",
        company: "Small Business Co",
        position: "Owner",
        leadScore: 45,
        status: "new",
        source: "Google Ads",
        tags: ["small-business", "owner"],
        notes: "Small business owner looking for affordable solutions.",
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Sample tasks
    const tasks = [
      {
        id: uuidv4(),
        title: "Create email templates for summer campaign",
        description: "Design and develop responsive email templates for the summer product launch campaign",
        priority: "high",
        status: "in_progress",
        assignedTo: "Design Team",
        category: "campaign",
        campaignId: campaigns[0].id,
        dueDate: new Date("2024-06-15"),
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        title: "Set up social media automation",
        description: "Configure automated posting schedule for social media awareness campaign",
        priority: "medium",
        status: "todo",
        assignedTo: "Marketing Team",
        category: "campaign",
        campaignId: campaigns[1].id,
        dueDate: new Date("2024-06-20"),
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        title: "Follow up with Sarah Johnson",
        description: "Send demo scheduling email and prepare presentation materials",
        priority: "high",
        status: "todo",
        assignedTo: "Sales Team",
        category: "crm",
        dueDate: new Date("2024-06-12"),
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        title: "Write blog post about industry trends",
        description: "Research and write comprehensive blog post about emerging industry trends",
        priority: "medium",
        status: "in_progress",
        assignedTo: "Content Team",
        category: "content",
        campaignId: campaigns[2].id,
        dueDate: new Date("2024-06-25"),
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        title: "Analyze Q2 campaign performance",
        description: "Compile and analyze performance metrics for all Q2 campaigns",
        priority: "low",
        status: "completed",
        assignedTo: "Analytics Team",
        category: "campaign",
        dueDate: new Date("2024-06-10"),
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        title: "Update CRM contact segments",
        description: "Review and update contact segmentation based on recent lead scoring changes",
        priority: "medium",
        status: "todo",
        assignedTo: "CRM Team",
        category: "crm",
        dueDate: new Date("2024-06-18"),
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Sample activities
    const activities = [
      {
        id: uuidv4(),
        type: "campaign_created",
        description: "Created new campaign: Summer Product Launch",
        entityId: campaigns[0].id,
        entityType: "campaign",
        userId,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        id: uuidv4(),
        type: "contact_added",
        description: "Added new contact: Sarah Johnson from TechCorp Solutions",
        entityId: contacts[0].id,
        entityType: "contact",
        userId,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        id: uuidv4(),
        type: "task_completed",
        description: "Completed task: Analyze Q2 campaign performance",
        entityId: tasks[4].id,
        entityType: "task",
        userId,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      },
      {
        id: uuidv4(),
        type: "contact_qualified",
        description: "Contact Sarah Johnson marked as qualified lead",
        entityId: contacts[0].id,
        entityType: "contact",
        userId,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
      },
      {
        id: uuidv4(),
        type: "campaign_updated",
        description: "Updated campaign metrics for Social Media Awareness",
        entityId: campaigns[1].id,
        entityType: "campaign",
        userId,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
      }
    ];
    
    // Insert data
    await db.collection("campaigns").insertMany(campaigns);
    await db.collection("contacts").insertMany(contacts);
    await db.collection("tasks").insertMany(tasks);
    await db.collection("activities").insertMany(activities);
    
    console.log("✅ Sample data seeded successfully!");
    console.log(`- ${campaigns.length} campaigns`);
    console.log(`- ${contacts.length} contacts`);
    console.log(`- ${tasks.length} tasks`);
    console.log(`- ${activities.length} activities`);
    
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  } finally {
    await client.close();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedData();
}

export { seedData };
