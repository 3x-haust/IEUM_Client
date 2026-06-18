import { z } from 'zod';

const stackGroupSchema = z.object({
  category: z.string(),
  color: z.string(),
  items: z.array(z.string()),
});

const featureDescriptionSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const projectSummarySchema = z.object({
  id: z.string(),
  serviceName: z.string(),
  teamName: z.string(),
  description: z.string().nullable(),
  thumbnailUrl: z.string().nullable(),
  thumbnailPath: z.string().nullable(),
  experienceCategory: z.string().nullable(),
  boothSlot: z.string().nullable(),
  developmentStacks: z.array(z.string()),
  designStacks: z.array(z.string()),
  stackGroups: z.array(stackGroupSchema),
  featureDescriptions: z.array(featureDescriptionSchema),
  acceptsFeedback: z.boolean().default(true),
  isPublished: z.boolean(),
  feedbackCount: z.number(),
  contactCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const projectMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  displayOrder: z.number(),
  roles: z.array(z.string()),
});

export const projectDetailSchema = projectSummarySchema.extend({
  members: z.array(projectMemberSchema),
});

export const projectListSchema = z.object({
  items: z.array(projectSummarySchema),
  nextCursor: z.string().nullable(),
});

export const visitorProfileSchema = z.object({
  id: z.string(),
  ageGroup: z.string().optional(),
  visitorType: z.enum(['general', 'recruiter']).optional(),
  businessCardFileId: z.string().nullable().optional(),
  businessCardBackFileId: z.string().nullable().optional(),
  businessCardRegistered: z.boolean().optional(),
  ocrRawText: z.string().nullable().optional(),
  ocrName: z.string().nullable().optional(),
  ocrOrganization: z.string().nullable().optional(),
  ocrPosition: z.string().nullable().optional(),
  ocrEmail: z.string().nullable().optional(),
  ocrPhone: z.string().nullable().optional(),
});

export const contactSchema = z.object({
  id: z.string(),
});

export const feedbackSchema = z.object({
  id: z.string(),
  status: z.enum(['public', 'blocked', 'deleted']),
  visitorProfileId: z.string().nullable().optional(),
  ageGroup: z.string().nullable().optional(),
  visitorType: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  moderationReason: z.string().nullable().optional(),
});

export const projectInterestSchema = z.object({
  projectId: z.string(),
  interestCount: z.number(),
  alreadyInterested: z.boolean(),
});

export const apiResponseSchema = z.object({
  statusCode: z.number(),
  data: z.unknown(),
  message: z.array(z.string()),
  timestamp: z.string(),
});

export type IeumFeedback = z.infer<typeof feedbackSchema>;
export type IeumProjectSummary = z.infer<typeof projectSummarySchema>;
export type IeumProjectDetail = z.infer<typeof projectDetailSchema>;
export type IeumProjectMember = z.infer<typeof projectMemberSchema>;
export type IeumProjectInterest = z.infer<typeof projectInterestSchema>;
export type IeumVisitorProfile = z.infer<typeof visitorProfileSchema>;
