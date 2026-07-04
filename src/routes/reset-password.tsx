import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button, Card, Field, TextInput } from "@/components/admin/ui";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password" }, { name: "robots", content: "noindex" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      await navigate({ to: "/admin" });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-background px-4">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Set new password</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label="New password">
            <TextInput type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Field>
          <Field label="Confirm password">
            <TextInput type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </Field>
          {error && <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">{error}</p>}
          <Button type="submit" loading={busy} className="w-full">Save password</Button>
        </form>
      </Card>
    </div>
  );
}