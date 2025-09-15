import { ComponentType, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export function ProtectedRoute<T extends Record<string, unknown>>({ component: Comp }: { component: ComponentType<T> }) {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  if (loading) return null; // could render a spinner
  if (!user) return null;

  // @ts-ignore - wouter passes route props if needed
  return <Comp />;
}

export function PublicRoute<T extends Record<string, unknown>>({ component: Comp }: { component: ComponentType<T> }) {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [loading, user, navigate]);

  if (loading) return null;
  if (user) return null;

  // @ts-ignore
  return <Comp />;
}
