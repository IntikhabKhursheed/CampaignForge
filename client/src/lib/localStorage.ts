import type { Campaign, Contact, Task } from "@shared/models";
import { sampleCampaigns, sampleContacts, sampleTasks, sampleMetrics } from "./sampleData";

// Keys for localStorage
const STORAGE_KEYS = {
  campaigns: 'campaignforge_campaigns',
  contacts: 'campaignforge_contacts', 
  tasks: 'campaignforge_tasks',
  activities: 'campaignforge_activities'
} as const;

// Initialize localStorage with sample data if empty
function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.campaigns)) {
    localStorage.setItem(STORAGE_KEYS.campaigns, JSON.stringify(sampleCampaigns));
  }
  if (!localStorage.getItem(STORAGE_KEYS.contacts)) {
    localStorage.setItem(STORAGE_KEYS.contacts, JSON.stringify(sampleContacts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.tasks)) {
    localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(sampleTasks));
  }
  if (!localStorage.getItem(STORAGE_KEYS.activities)) {
    localStorage.setItem(STORAGE_KEYS.activities, JSON.stringify(sampleMetrics.recentActivities));
  }
}

// Generic storage functions
export function getStoredData<T>(key: keyof typeof STORAGE_KEYS): T[] {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS[key]);
  return data ? JSON.parse(data) : [];
}

export function setStoredData<T>(key: keyof typeof STORAGE_KEYS, data: T[]): void {
  localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
}

// Campaign functions
export function getCampaigns(): Campaign[] {
  return getStoredData<Campaign>('campaigns');
}

export function saveCampaign(campaign: Campaign): Campaign {
  const campaigns = getCampaigns();
  const existingIndex = campaigns.findIndex(c => c.id === campaign.id);
  
  if (existingIndex >= 0) {
    campaigns[existingIndex] = { ...campaign, updatedAt: new Date() };
  } else {
    campaigns.push({ ...campaign, createdAt: new Date(), updatedAt: new Date() });
  }
  
  setStoredData('campaigns', campaigns);
  addActivity('campaign', existingIndex >= 0 ? 'updated' : 'created', campaign.name, campaign.id);
  return campaign;
}

export function deleteCampaign(id: string): void {
  const campaigns = getCampaigns();
  const campaign = campaigns.find(c => c.id === id);
  const filtered = campaigns.filter(c => c.id !== id);
  setStoredData('campaigns', filtered);
  if (campaign) {
    addActivity('campaign', 'deleted', campaign.name, id);
  }
}

// Contact functions
export function getContacts(): Contact[] {
  return getStoredData<Contact>('contacts');
}

export function saveContact(contact: Contact): Contact {
  const contacts = getContacts();
  const existingIndex = contacts.findIndex(c => c.id === contact.id);
  
  if (existingIndex >= 0) {
    contacts[existingIndex] = { ...contact, updatedAt: new Date() };
  } else {
    contacts.push({ ...contact, createdAt: new Date(), updatedAt: new Date() });
  }
  
  setStoredData('contacts', contacts);
  addActivity('contact', existingIndex >= 0 ? 'updated' : 'added', `${contact.firstName} ${contact.lastName}`, contact.id);
  return contact;
}

export function deleteContact(id: string): void {
  const contacts = getContacts();
  const contact = contacts.find(c => c.id === id);
  const filtered = contacts.filter(c => c.id !== id);
  setStoredData('contacts', filtered);
  if (contact) {
    addActivity('contact', 'deleted', `${contact.firstName} ${contact.lastName}`, id);
  }
}

// Task functions
export function getTasks(): Task[] {
  return getStoredData<Task>('tasks');
}

export function saveTask(task: Task): Task {
  const tasks = getTasks();
  const existingIndex = tasks.findIndex(t => t.id === task.id);
  
  if (existingIndex >= 0) {
    tasks[existingIndex] = { ...task, updatedAt: new Date() };
  } else {
    tasks.push({ ...task, createdAt: new Date(), updatedAt: new Date() });
  }
  
  setStoredData('tasks', tasks);
  addActivity('task', existingIndex >= 0 ? 'updated' : 'created', task.title, task.id);
  return task;
}

export function deleteTask(id: string): void {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === id);
  const filtered = tasks.filter(t => t.id !== id);
  setStoredData('tasks', filtered);
  if (task) {
    addActivity('task', 'deleted', task.title, id);
  }
}

// Activity functions
function addActivity(entityType: string, action: string, description: string, entityId: string): void {
  const activities = getStoredData('activities');
  const newActivity = {
    id: `activity-${Date.now()}`,
    type: `${entityType}_${action}`,
    description: `${action.charAt(0).toUpperCase() + action.slice(1)} ${entityType}: ${description}`,
    entityId,
    entityType,
    userId: "demo-user-id",
    createdAt: new Date()
  };
  
  activities.unshift(newActivity); // Add to beginning
  activities.splice(20); // Keep only last 20 activities
  setStoredData('activities', activities);
}

export function getActivities() {
  return getStoredData('activities');
}

// Generate metrics from stored data
export function getMetrics() {
  const campaigns = getCampaigns();
  const contacts = getContacts();
  const tasks = getTasks();
  
  return {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === "active").length,
    totalContacts: contacts.length,
    totalLeads: campaigns.reduce((sum, c) => sum + ((c.metrics as any)?.leads || 0), 0),
    conversionRate: "7.8%",
    roi: "$285K",
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === "completed").length,
    growth: {
      campaigns: "+12%",
      leads: "+23%", 
      conversions: "+8.5%",
      roi: "+15%"
    },
    leadScores: {
      hot: contacts.filter(c => (c.leadScore || 0) >= 80).length,
      warm: contacts.filter(c => (c.leadScore || 0) >= 60 && (c.leadScore || 0) < 80).length,
      cold: contacts.filter(c => (c.leadScore || 0) < 60).length,
    },
    recentActivities: getActivities()
  };
}
