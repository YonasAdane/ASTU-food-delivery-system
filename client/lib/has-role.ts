import { getUserFromCookie } from "./auth";

export async function hasRole(requiredRoles: string[]): Promise<boolean> {
  const sessionUser = await getUserFromCookie();
  if (!sessionUser) return false;
  // Check if the user's role matches any of the required roles
  return requiredRoles.some((role) => sessionUser.role.includes(role));
}
