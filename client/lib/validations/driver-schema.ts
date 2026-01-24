import * as z from "zod";

export const createDriverSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  restaurantId: z.string().optional(),
});

export const updateDriverSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(10, "Phone must be at least 10 digits").optional(),
  firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
  status: z.enum(["available", "unavailable"]).optional(),
  restaurantId: z.string().optional(),
});

export type CreateDriverFormValues = z.infer<typeof createDriverSchema>;
export type UpdateDriverFormValues = z.infer<typeof updateDriverSchema>;