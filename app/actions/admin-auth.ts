"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import {
  clearAdminCookie,
  createAdminSession,
  getAdminCredentials,
  setAdminCookie,
} from "@/lib/admin-auth";

const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type LoginState = { error?: string } | null;

export async function loginAdminAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Informe usuário e senha." };
  }

  const creds = getAdminCredentials();
  const userOk = parsed.data.username === creds.username;
  const passOk = parsed.data.password === creds.password;

  if (!userOk || !passOk) {
    return { error: "Usuário ou senha inválidos." };
  }

  const token = await createAdminSession();
  setAdminCookie(token);
  redirect("/admin");
}

export async function logoutAdminAction(): Promise<void> {
  clearAdminCookie();
  redirect("/admin/login");
}
