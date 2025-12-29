"use server"
import { cookies } from "next/headers";

export async function getUserFromCookie() {
  const cookieStore =await cookies();
  const userCookie = cookieStore.get("user");
  if (!userCookie) return null;
    return JSON.parse(userCookie.value) as {
    id: number,
    email: string,
    role: string,
  }
}

export async function getTokenFromCookie() {
  const cookieStore =await cookies();
  const tokenCookie = cookieStore.get("token");
  if (!tokenCookie) return null;
    return tokenCookie.value as string;

}