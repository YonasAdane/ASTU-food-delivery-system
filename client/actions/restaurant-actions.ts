"use server"

import { getErrorMessage } from "@/lib/get-error-message";
import { z } from "zod";


const registerRestaurantSchema = z.object({
  name: z.string().min(2, "Restaurant name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is too short"),
  area: z.string().min(2, "Area is required"),

  deliveryTime: z
    .number()
    .min(0, "Delivery time must be positive"),

  latitude: z
    .number()
    .min(-90, "Invalid latitude")
    .max(90, "Invalid latitude"),

  longitude: z
    .number()
    .min(-180, "Invalid longitude")
    .max(180, "Invalid longitude"),

  image: z.instanceof(File).optional(),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterRestaurantInput = z.infer<
  typeof registerRestaurantSchema
>;

type ActionResponse = {
	success: boolean
	message: string
	fieldErrors?: Record<string, string[]>
}


export async function registerRestaurant(
	input: RegisterRestaurantInput
): Promise<ActionResponse> {
	// 1️⃣ Validate input
	const parsed = registerRestaurantSchema.safeParse(input)

	if (!parsed.success) {
		return {
			success: false,
			message: "Validation failed",
			fieldErrors: parsed.error.flatten().fieldErrors,
		}
	}

	try {
		console.log(JSON.stringify({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
			password: parsed.data.password,
      area: parsed.data.area,
      deliveryTime: parsed.data.deliveryTime,
      image: parsed.data.image,
      location: {
        type: "Point",
        coordinates: [parsed.data.longitude, parsed.data.latitude],
      }
    }))
		// 2️⃣ Call backend API
		const response = await fetch(
			`${process.env.API_URL}/restaurants/register`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
			password: parsed.data.password,
      area: parsed.data.area,
      deliveryTime: parsed.data.deliveryTime,
      image: parsed.data.image,
      location: {
        type: "Point",
        coordinates: [parsed.data.longitude, parsed.data.latitude],
      }
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
			message: "sucessfully registered.",
		}
	} catch (error) {
		console.error("REGISTER ERROR:", error)

		return {
			success: false,
			message: getErrorMessage(error),
		}
	}
}

