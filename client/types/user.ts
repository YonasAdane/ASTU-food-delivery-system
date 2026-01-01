import * as z from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "restaurant", "customer", "driver"]),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export interface User {
  _id: string;
  email: string;
  phone: string;
  role: "admin" | "restaurant" | "customer" | "driver";
  status: "available" | "unavailable";
  isVerified: boolean;
  createdAt: string;
}

export interface UserResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}