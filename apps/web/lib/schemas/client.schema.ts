import { z } from "zod";

/**
 * Schema for client query parameters
 */
export const clientQuerySchema = z.object({
  id: z.string().uuid().optional(),
  search: z.string().optional(),
  isActive: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => val === "true"),
  page: z.string().optional().transform(Number),
  limit: z.string().optional().transform(Number),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

/**
 * Schema for creating a new client
 */
export const createClientSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  email: z.string().email("Invalid email address").optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  organizationId: z.string().uuid("Invalid organization ID"),
  isActive: z.boolean().default(true),
});

/**
 * Schema for updating an existing client
 */
export const updateClientSchema = createClientSchema.partial().extend({
  id: z.string().uuid("Invalid client ID"),
});

/**
 * Schema for client response (includes computed/server fields)
 */
export const clientResponseSchema = createClientSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});
