import { z } from "zod";

// Metrics schemas
export const campaignMetricsSchema = z.object({
  leads: z.number().default(0),
  conversions: z.number().default(0),
  roi: z.number().default(0),
});

export const dashboardMetricsSchema = z.object({
  activeCampaigns: z.number(),
  totalLeads: z.number(),
  conversionRate: z.string(),
  roi: z.string(),
  leadScores: z.object({
    hot: z.number(),
    warm: z.number(),
    cold: z.number(),
  }),
  growth: z.object({
    campaigns: z.string(),
    leads: z.string(),
    conversions: z.string(),
    roi: z.string(),
  }),
});

export type CampaignMetrics = z.infer<typeof campaignMetricsSchema>;
export type DashboardMetrics = z.infer<typeof dashboardMetricsSchema>;

// Collections' item schemas (agnostic to DB driver)
export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string().default("founder"),
});

export const insertUserSchema = userSchema.pick({
  username: true,
  password: true,
  name: true,
  email: true,
  role: true,
});

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

export const campaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  status: z.string().default("draft"),
  description: z.string().nullable().optional(),
  targetAudience: z.string().nullable().optional(),
  budget: z.coerce.number().nullable().optional(),
  startDate: z.preprocess((v) => {
    if (v === undefined) return undefined;
    if (v === null || v === "") return null;
    return new Date(v as any);
  }, z.date().nullable()),
  endDate: z.preprocess((v) => {
    if (v === undefined) return undefined;
    if (v === null || v === "") return null;
    return new Date(v as any);
  }, z.date().nullable()),
  createdAt: z.preprocess((v) => {
    if (v === undefined) return undefined;
    if (v === null || v === "") return null;
    return new Date(v as any);
  }, z.date().nullable().optional()),
  updatedAt: z.preprocess((v) => {
    if (v === undefined) return undefined;
    if (v === null || v === "") return null;
    return new Date(v as any);
  }, z.date().nullable().optional()),
  userId: z.string(),
  metrics: z.unknown().default({}),
});

export const insertCampaignSchema = campaignSchema.pick({
  name: true,
  type: true,
  status: true,
  description: true,
  targetAudience: true,
  budget: true,
  startDate: true,
  endDate: true,
  userId: true,
  metrics: true,
});

export type Campaign = z.infer<typeof campaignSchema>;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;

export const contactSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  position: z.string().nullable().optional(),
  leadScore: z.number().default(0),
  status: z.string().default("new"),
  source: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
  notes: z.string().nullable().optional(),
  createdAt: z.preprocess((v) => {
    if (v === undefined) return undefined;
    if (v === null || v === "") return null;
    return new Date(v as any);
  }, z.date().nullable().optional()),
  updatedAt: z.preprocess((v) => {
    if (v === undefined) return undefined;
    if (v === null || v === "") return null;
    return new Date(v as any);
  }, z.date().nullable().optional()),
  userId: z.string(),
});

export const insertContactSchema = contactSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  company: true,
  position: true,
  leadScore: true,
  status: true,
  source: true,
  tags: true,
  notes: true,
  userId: true,
});

export type Contact = z.infer<typeof contactSchema>;
export type InsertContact = z.infer<typeof insertContactSchema>;

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  priority: z.string().default("medium"),
  status: z.string().default("todo"),
  dueDate: z.preprocess((v) => {
    if (v === undefined) return undefined;
    if (v === null || v === "") return null;
    return new Date(v as any);
  }, z.date().nullable().optional()),
  assignedTo: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  campaignId: z.preprocess((v) => (v === "" ? null : v), z.string().nullable().optional()),
  createdAt: z.preprocess((v) => {
    if (v === undefined) return undefined;
    if (v === null || v === "") return null;
    return new Date(v as any);
  }, z.date().nullable().optional()),
  updatedAt: z.preprocess((v) => {
    if (v === undefined) return undefined;
    if (v === null || v === "") return null;
    return new Date(v as any);
  }, z.date().nullable().optional()),
  userId: z.string(),
});

export const insertTaskSchema = taskSchema.pick({
  title: true,
  description: true,
  priority: true,
  status: true,
  dueDate: true,
  assignedTo: true,
  category: true,
  campaignId: true,
  userId: true,
});

export type Task = z.infer<typeof taskSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export const activitySchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  metadata: z.unknown().default({}),
  createdAt: z.date().nullable().optional(),
  userId: z.string(),
});

export const insertActivitySchema = activitySchema.pick({
  type: true,
  title: true,
  description: true,
  metadata: true,
  userId: true,
});

export type Activity = z.infer<typeof activitySchema>;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
