// Shared admin UI primitives.
import { useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`surface-card rounded-2xl p-5 sm:p-6 ${className}`}>{children}</div>;
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-brand ${props.className ?? ""}`}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-brand min-h-[88px] ${props.className ?? ""}`}
    />
  );
}

export function Button({
  children,
  variant = "primary",
  loading,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger"; loading?: boolean }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-60";
  const styles =
    variant === "primary"
      ? "bg-gradient-brand text-brand-foreground shadow-lg shadow-brand/20 hover:opacity-95"
      : variant === "danger"
      ? "border border-destructive/40 bg-destructive/10 text-destructive-foreground hover:bg-destructive/20"
      : "border border-border bg-surface text-foreground hover:bg-accent";
  return (
    <button {...rest} className={`${base} ${styles} ${rest.className ?? ""}`} disabled={rest.disabled || loading}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function useToast() {
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const toast = (kind: "ok" | "err", text: string) => {
    setMessage({ kind, text });
    setTimeout(() => setMessage(null), 3000);
  };
  const view = message && (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-50 rounded-xl border px-4 py-3 text-sm shadow-xl ${
        message.kind === "ok"
          ? "border-brand/40 bg-surface-elevated text-foreground"
          : "border-destructive/40 bg-destructive/10 text-destructive-foreground"
      }`}
    >
      {message.text}
    </div>
  );
  return { toast, view };
}
