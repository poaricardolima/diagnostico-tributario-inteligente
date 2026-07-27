"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAdminAction, type LoginState } from "@/app/actions/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" size="lg" disabled={pending}>
      {pending ? "Entrando..." : "Entrar"}
    </Button>
  );
}

export function AdminLoginForm() {
  const [state, action] = useFormState<LoginState, FormData>(
    loginAdminAction,
    null
  );

  return (
    <form action={action} className="space-y-5">
      <div>
        <Label htmlFor="username" className="text-white">
          Usuário
        </Label>
        <Input
          id="username"
          name="username"
          autoComplete="username"
          required
          className="mt-2"
          placeholder="admin"
        />
      </div>
      <div>
        <Label htmlFor="password" className="text-white">
          Senha
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2"
          placeholder="••••••••"
        />
      </div>
      {state?.error && (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {state.error}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
