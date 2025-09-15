import type { Campaign, Contact, Task } from "@shared/models";

export const sampleCampaigns: Campaign[] = [
  {
    id: "camp-1",
    name: "Summer Product Launch",
    description: "Launch campaign for our new summer product line",
    type: "email",
    status: "active",
    targetAudience: "Young professionals 25-35",
    budget: 15000,
    startDate: new Date("2024-06-01"),
    endDate: new Date("2024-08-31"),
    metrics: { leads: 1250, conversions: 89, roi: 285 },
    userId: "demo-user-id",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "camp-2",
    name: "Social Media Awareness",
    description: "Increase brand awareness through social media channels",
    type: "social",
    status: "active",
    targetAudience: "Millennials and Gen Z",
    budget: 8000,
    startDate: new Date("2024-05-15"),
    endDate: new Date("2024-07-15"),
    metrics: { leads: 890, conversions: 45, roi: 192 },
    userId: "demo-user-id",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "camp-3",
    name: "Content Marketing Strategy",
    description: "Educational content to drive organic traffic",
    type: "content",
    status: "active",
    targetAudience: "Business decision makers",
    budget: 12000,
    startDate: new Date("2024-07-01"),
    endDate: new Date("2024-12-31"),
    metrics: { leads: 567, conversions: 78, roi: 348 },
    userId: "demo-user-id",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "camp-4",
    name: "Holiday Sales Campaign",
    description: "Black Friday and holiday season promotions",
    type: "email",
    status: "draft",
    targetAudience: "Existing customers",
    budget: 25000,
    startDate: new Date("2024-11-01"),
    endDate: new Date("2024-12-31"),
    metrics: { leads: 0, conversions: 0, roi: 0 },
    userId: "demo-user-id",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const sampleContacts: Contact[] = [
  {
    id: "contact-1",
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
    userId: "demo-user-id",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "contact-2",
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
    userId: "demo-user-id",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "contact-3",
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
    userId: "demo-user-id",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "contact-4",
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
    userId: "demo-user-id",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "contact-5",
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
    userId: "demo-user-id",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const sampleTasks: Task[] = [
  {
    id: "task-1",
    title: "Create email templates for summer campaign",
    description: "Design and develop responsive email templates for the summer product launch campaign",
    priority: "high",
    status: "in_progress",
    assignedTo: "Design Team",
    category: "campaign",
    campaignId: "camp-1",
    dueDate: new Date("2024-06-15"),
    userId: "demo-user-id",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "task-2",
    title: "Set up social media automation",
    description: "Configure automated posting schedule for social media awareness campaign",
    priority: "medium",
    status: "todo",
    assignedTo: "Marketing Team",
    category: "campaign",
    campaignId: "camp-2",
    dueDate: new Date("2024-06-20"),
    userId: "demo-user-id",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "task-3",
    title: "Follow up with Sarah Johnson",
    description: "Send demo scheduling email and prepare presentation materials",
    priority: "high",
    status: "todo",
    assignedTo: "Sales Team",
    category: "crm",
    dueDate: new Date("2024-06-12"),
    userId: "demo-user-id",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "task-4",
    title: "Write blog post about industry trends",
    description: "Research and write comprehensive blog post about emerging industry trends",
    priority: "medium",
    status: "in_progress",
    assignedTo: "Content Team",
    category: "content",
    campaignId: "camp-3",
    dueDate: new Date("2024-06-25"),
    userId: "demo-user-id",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "task-5",
    title: "Analyze Q2 campaign performance",
    description: "Compile and analyze performance metrics for all Q2 campaigns",
    priority: "low",
    status: "completed",
    assignedTo: "Analytics Team",
    category: "campaign",
    dueDate: new Date("2024-06-10"),
    userId: "demo-user-id",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "task-6",
    title: "Update CRM contact segments",
    description: "Review and update contact segmentation based on recent lead scoring changes",
    priority: "medium",
    status: "todo",
    assignedTo: "CRM Team",
    category: "crm",
    dueDate: new Date("2024-06-18"),
    userId: "demo-user-id",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const sampleMetrics = {
  totalCampaigns: sampleCampaigns.length,
  activeCampaigns: sampleCampaigns.filter(c => c.status === "active").length,
  totalContacts: sampleContacts.length,
  totalLeads: 2707, // Sum of leads from all campaigns
  conversionRate: "7.8%",
  roi: "$285K",
  totalTasks: sampleTasks.length,
  completedTasks: sampleTasks.filter(t => t.status === "completed").length,
  growth: {
    campaigns: "+12%",
    leads: "+23%", 
    conversions: "+8.5%",
    roi: "+15%"
  },
  leadScores: {
    hot: sampleContacts.filter(c => (c.leadScore || 0) >= 80).length,
    warm: sampleContacts.filter(c => (c.leadScore || 0) >= 60 && (c.leadScore || 0) < 80).length,
    cold: sampleContacts.filter(c => (c.leadScore || 0) < 60).length,
  },
  recentActivities: [
    {
      id: "activity-1",
      type: "campaign_created",
      description: "Created new campaign: Summer Product Launch",
      entityId: "camp-1",
      entityType: "campaign",
      userId: "demo-user-id",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      id: "activity-2",
      type: "contact_added",
      description: "Added new contact: Sarah Johnson from TechCorp Solutions",
      entityId: "contact-1",
      entityType: "contact",
      userId: "demo-user-id",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      id: "activity-3",
      type: "task_completed",
      description: "Completed task: Analyze Q2 campaign performance",
      entityId: "task-5",
      entityType: "task",
      userId: "demo-user-id",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
    },
    {
      id: "activity-4",
      type: "contact_qualified",
      description: "Contact Sarah Johnson marked as qualified lead",
      entityId: "contact-1",
      entityType: "contact",
      userId: "demo-user-id",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
    },
    {
      id: "activity-5",
      type: "campaign_updated",
      description: "Updated campaign metrics for Social Media Awareness",
      entityId: "camp-2",
      entityType: "campaign",
      userId: "demo-user-id",
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
    }
  ]
};
