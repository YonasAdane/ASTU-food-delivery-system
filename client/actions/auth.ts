"use server"

import { getErrorMessage } from "@/lib/get-error-message"
import { z } from "zod"


const registerSchema = z
  .object({
    phone: z.string().min(3, "Phone Number is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine(val => val === true, {
      message: "You must accept the terms",
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

export type RegisterInput = z.infer<typeof registerSchema>


type ActionResponse = {
  success: boolean
  message: string
  fieldErrors?: Record<string, string[]>
}


export async function registerCustomer(
  input: RegisterInput
): Promise<ActionResponse> {
  // 1️⃣ Validate input
  const parsed = registerSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    // 2️⃣ Call backend API
    const response = await fetch(
      `${process.env.API_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: parsed.data.phone,
          email: parsed.data.email,
          password: parsed.data.password,
        }),
        cache: "no-store",
      }
    )

    const data = await response.json()

    // 3️⃣ Handle backend errors
    if (!response.ok) {
      return {
        success: false,
        message: data?.message ?? "Registration failed",
      }
    }

    // 4️⃣ Success
    return {
      success: true,
      message: "Account created successfully",
    }
  } catch (error) {
    console.error("REGISTER ERROR:", error)

    return {
      success: false,
      message: getErrorMessage(error),
    }
  }
}
