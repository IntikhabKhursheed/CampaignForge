import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "wouter";

export default function Register() {
  const { register, loading } = useAuth();
  const [, navigate] = useLocation();
  const [form, setForm] = useState({ username: "", password: "", name: "", email: "" });
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register(form);
      navigate("/");
    } catch (e: any) {
      setError(e?.message || "Registration failed");
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <h1 className="text-xl font-semibold">Create account</h1>
        <p className="text-sm text-muted-foreground">Start your journey by creating an account.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              placeholder="Sarah Chen"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              placeholder="sarah@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Username</label>
            <Input
              value={form.username}
              onChange={(e) => setForm((s) => ({ ...s, username: e.target.value }))}
              placeholder="yourname"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-center text-muted-foreground">
          Already have an account? <Link href="/login" className="text-primary">Sign in</Link>
        </p>
      </CardContent>
    </Card>
  );
}
