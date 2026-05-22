import { getSession, SessionPayload } from "./auth-helpers";
import { User } from "./types";

function sessionToUser(session: SessionPayload): User {
  return {
    id: session.sub,
    email: session.email,
    firstName: session.firstName,
    lastName: session.lastName,
    role: session.role as "customer" | "admin",
    emailVerified: session.emailVerified,
    createdAt: new Date().toISOString(),
    addresses: [],
  };
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;
  return sessionToUser(session);
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthenticated");
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth();
  if (user.role !== "admin") throw new Error("Forbidden");
  return user;
}
