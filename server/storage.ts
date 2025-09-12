import { 
  type User, type InsertUser,
  type Campaign, type InsertCampaign,
  type Contact, type InsertContact,
  type Task, type InsertTask,
  type Activity, type InsertActivity
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Campaigns
  getCampaigns(userId: string): Promise<Campaign[]>;
  getCampaign(id: string, userId: string): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: string, campaign: Partial<InsertCampaign>, userId: string): Promise<Campaign | undefined>;
  deleteCampaign(id: string, userId: string): Promise<boolean>;

  // Contacts
  getContacts(userId: string): Promise<Contact[]>;
  getContact(id: string, userId: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: string, contact: Partial<InsertContact>, userId: string): Promise<Contact | undefined>;
  deleteContact(id: string, userId: string): Promise<boolean>;

  // Tasks
  getTasks(userId: string): Promise<Task[]>;
  getTask(id: string, userId: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<InsertTask>, userId: string): Promise<Task | undefined>;
  deleteTask(id: string, userId: string): Promise<boolean>;

  // Activities
  getActivities(userId: string, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Analytics
  getDashboardMetrics(userId: string): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private campaigns: Map<string, Campaign> = new Map();
  private contacts: Map<string, Contact> = new Map();
  private tasks: Map<string, Task> = new Map();
  private activities: Map<string, Activity> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create a sample user
    const userId = randomUUID();
    const user: User = {
      id: userId,
      username: "founder",
      password: "password",
      name: "Sarah Chen",
      email: "sarah@startup.com",
      role: "founder"
    };
    this.users.set(userId, user);

    // Create sample campaigns
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
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      userId: userId,
      metrics: { leads: 1234, conversions: 52, roi: 285 }
    };

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
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      userId: userId,
      metrics: { leads: 892, conversions: 34, roi: 192 }
    };

    const contentCampaign: Campaign = {
      id: randomUUID(),
      name: "Content Marketing Series",
      type: "content",
      status: "paused",
      description: "Educational content series",
      targetAudience: "Tech professionals",
      budget: 2000,
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      userId: userId,
      metrics: { leads: 721, conversions: 37, roi: 348 }
    };

    this.campaigns.set(emailCampaign.id, emailCampaign);
    this.campaigns.set(socialCampaign.id, socialCampaign);
    this.campaigns.set(contentCampaign.id, contentCampaign);

    // Create sample contacts
    const contact1: Contact = {
      id: randomUUID(),
      firstName: "Alex",
      lastName: "Johnson",
      email: "alex@techstart.com",
      phone: "+1-555-0123",
      company: "TechStart Inc.",
      position: "CEO",
      leadScore: 95,
      status: "qualified",
      source: emailCampaign.id,
      tags: ["enterprise", "hot-lead"],
      notes: "Very interested in our enterprise solution",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      userId: userId
    };

    const contact2: Contact = {
      id: randomUUID(),
      firstName: "Maria",
      lastName: "Garcia",
      email: "maria@growthco.com",
      phone: "+1-555-0124",
      company: "GrowthCo",
      position: "Marketing Director",
      leadScore: 88,
      status: "contacted",
      source: socialCampaign.id,
      tags: ["marketing", "warm-lead"],
      notes: "Interested in marketing automation features",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      userId: userId
    };

    this.contacts.set(contact1.id, contact1);
    this.contacts.set(contact2.id, contact2);

    // Create sample tasks
    const task1: Task = {
      id: randomUUID(),
      title: "Review email campaign performance",
      description: "Analyze the performance metrics of the Summer Product Launch campaign",
      priority: "high",
      status: "todo",
      dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000), // Due in 6 hours
      assignedTo: "Marketing Team",
      category: "campaign",
      campaignId: emailCampaign.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: userId
    };

    const task2: Task = {
      id: randomUUID(),
      title: "Update lead scoring criteria",
      description: "Review and update the lead scoring algorithm based on recent data",
      priority: "medium",
      status: "todo",
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Due tomorrow
      assignedTo: "Sales Team",
      category: "crm",
      campaignId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: userId
    };

    const task3: Task = {
      id: randomUUID(),
      title: "Create content calendar for next month",
      description: "Plan and schedule content for the upcoming month",
      priority: "low",
      status: "todo",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Due in 3 days
      assignedTo: "Content Team",
      category: "content",
      campaignId: contentCampaign.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: userId
    };

    this.tasks.set(task1.id, task1);
    this.tasks.set(task2.id, task2);
    this.tasks.set(task3.id, task3);

    // Create sample activities
    const activities = [
      {
        id: randomUUID(),
        type: "campaign_launched",
        title: 'Email Campaign "Summer Sale" launched',
        description: "2,340 recipients",
        metadata: { recipients: 2340, campaignId: emailCampaign.id },
        createdAt: new Date(Date.now() - 15 * 60 * 1000),
        userId: userId
      },
      {
        id: randomUUID(),
        type: "leads_generated",
        title: '47 new leads from "Product Demo" landing page',
        description: "Conversion rate: 6.2%",
        metadata: { leads: 47, conversionRate: 6.2, source: "landing_page" },
        createdAt: new Date(Date.now() - 60 * 60 * 1000),
        userId: userId
      },
      {
        id: randomUUID(),
        type: "social_campaign",
        title: "Social media campaign reached 12.5K impressions",
        description: "Instagram & LinkedIn",
        metadata: { impressions: 12500, platforms: ["instagram", "linkedin"] },
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        userId: userId
      },
      {
        id: randomUUID(),
        type: "crm_sync",
        title: "CRM sync completed",
        description: "2,847 contacts updated",
        metadata: { contactsUpdated: 2847 },
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        userId: userId
      }
    ];

    activities.forEach(activity => {
      this.activities.set(activity.id, activity as Activity);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || "founder"
    };
    this.users.set(id, user);
    return user;
  }

  // Campaign methods
  async getCampaigns(userId: string): Promise<Campaign[]> {
    return Array.from(this.campaigns.values()).filter(campaign => campaign.userId === userId);
  }

  async getCampaign(id: string, userId: string): Promise<Campaign | undefined> {
    const campaign = this.campaigns.get(id);
    return campaign?.userId === userId ? campaign : undefined;
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const id = randomUUID();
    const now = new Date();
    const newCampaign: Campaign = { 
      ...campaign, 
      id, 
      createdAt: now, 
      updatedAt: now,
      metrics: campaign.metrics || {},
      description: campaign.description || null,
      targetAudience: campaign.targetAudience || null,
      budget: campaign.budget || null,
      startDate: campaign.startDate || null,
      endDate: campaign.endDate || null,
      status: campaign.status || "draft"
    };
    this.campaigns.set(id, newCampaign);
    return newCampaign;
  }

  async updateCampaign(id: string, campaign: Partial<InsertCampaign>, userId: string): Promise<Campaign | undefined> {
    const existing = this.campaigns.get(id);
    if (!existing || existing.userId !== userId) return undefined;
    
    const updated: Campaign = { ...existing, ...campaign, updatedAt: new Date() };
    this.campaigns.set(id, updated);
    return updated;
  }

  async deleteCampaign(id: string, userId: string): Promise<boolean> {
    const campaign = this.campaigns.get(id);
    if (!campaign || campaign.userId !== userId) return false;
    
    return this.campaigns.delete(id);
  }

  // Contact methods
  async getContacts(userId: string): Promise<Contact[]> {
    return Array.from(this.contacts.values()).filter(contact => contact.userId === userId);
  }

  async getContact(id: string, userId: string): Promise<Contact | undefined> {
    const contact = this.contacts.get(id);
    return contact?.userId === userId ? contact : undefined;
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const now = new Date();
    const newContact: Contact = { 
      ...contact, 
      id, 
      createdAt: now, 
      updatedAt: now,
      tags: contact.tags || [],
      status: contact.status || "new",
      phone: contact.phone || null,
      company: contact.company || null,
      position: contact.position || null,
      leadScore: contact.leadScore || 0,
      source: contact.source || null,
      notes: contact.notes || null
    };
    this.contacts.set(id, newContact);
    return newContact;
  }

  async updateContact(id: string, contact: Partial<InsertContact>, userId: string): Promise<Contact | undefined> {
    const existing = this.contacts.get(id);
    if (!existing || existing.userId !== userId) return undefined;
    
    const updated: Contact = { ...existing, ...contact, updatedAt: new Date() };
    this.contacts.set(id, updated);
    return updated;
  }

  async deleteContact(id: string, userId: string): Promise<boolean> {
    const contact = this.contacts.get(id);
    if (!contact || contact.userId !== userId) return false;
    
    return this.contacts.delete(id);
  }

  // Task methods
  async getTasks(userId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.userId === userId);
  }

  async getTask(id: string, userId: string): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    return task?.userId === userId ? task : undefined;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const id = randomUUID();
    const now = new Date();
    const newTask: Task = { 
      ...task, 
      id, 
      createdAt: now, 
      updatedAt: now,
      description: task.description || null,
      priority: task.priority || "medium",
      status: task.status || "todo",
      dueDate: task.dueDate || null,
      assignedTo: task.assignedTo || null,
      category: task.category || null,
      campaignId: task.campaignId || null
    };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async updateTask(id: string, task: Partial<InsertTask>, userId: string): Promise<Task | undefined> {
    const existing = this.tasks.get(id);
    if (!existing || existing.userId !== userId) return undefined;
    
    const updated: Task = { ...existing, ...task, updatedAt: new Date() };
    this.tasks.set(id, updated);
    return updated;
  }

  async deleteTask(id: string, userId: string): Promise<boolean> {
    const task = this.tasks.get(id);
    if (!task || task.userId !== userId) return false;
    
    return this.tasks.delete(id);
  }

  // Activity methods
  async getActivities(userId: string, limit = 10): Promise<Activity[]> {
    const userActivities = Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => {
        const aTime = a.createdAt ? a.createdAt.getTime() : 0;
        const bTime = b.createdAt ? b.createdAt.getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, limit);
    
    return userActivities;
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const newActivity: Activity = { 
      ...activity, 
      id, 
      createdAt: new Date(),
      description: activity.description || null,
      metadata: activity.metadata || {}
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  // Analytics methods
  async getDashboardMetrics(userId: string): Promise<any> {
    const campaigns = await this.getCampaigns(userId);
    const contacts = await this.getContacts(userId);
    const tasks = await this.getTasks(userId);

    const activeCampaigns = campaigns.filter(c => c.status === 'active');
    const totalLeads = contacts.length;
    const hotLeads = contacts.filter(c => (c.leadScore || 0) >= 80).length;
    const warmLeads = contacts.filter(c => (c.leadScore || 0) >= 60 && (c.leadScore || 0) < 80).length;
    const coldLeads = contacts.filter(c => (c.leadScore || 0) < 60).length;

    const totalConversions = campaigns.reduce((sum, c) => {
      const metrics = c.metrics as any;
      return sum + (metrics?.conversions || 0);
    }, 0);
    const totalCampaignLeads = campaigns.reduce((sum, c) => {
      const metrics = c.metrics as any;
      return sum + (metrics?.leads || 0);
    }, 0);
    const conversionRate = totalCampaignLeads > 0 ? (totalConversions / totalCampaignLeads * 100).toFixed(1) : "0.0";

    const avgROI = campaigns.length > 0 
      ? Math.round(campaigns.reduce((sum, c) => {
          const metrics = c.metrics as any;
          return sum + (metrics?.roi || 0);
        }, 0) / campaigns.length)
      : 0;

    return {
      activeCampaigns: activeCampaigns.length,
      totalLeads,
      conversionRate: `${conversionRate}%`,
      roi: `${avgROI}%`,
      leadScores: {
        hot: hotLeads,
        warm: warmLeads,
        cold: coldLeads
      },
      growth: {
        campaigns: "+8.2%",
        leads: "+23.1%",
        conversions: "+1.2%",
        roi: "+45.3%"
      }
    };
  }
}

export const storage = new MemStorage();
