import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  verifyAdminToken,
} from "@/lib/admin-session";

export {
  ADMIN_COOKIE,
  createAdminSession,
  getAdminCredentials,
  verifyAdminToken,
} from "@/lib/admin-session";

export async function isAdminAuthenticated(): Promise<boolean> {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return verifyAdminToken(token);
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
}

export function setAdminCookie(token: string) {
  cookies().set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAdminCookie() {
  cookies().set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
