import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { sampleCampaigns, sampleContacts, sampleTasks, sampleMetrics } from "./sampleData";

// Demo mode flag - set to true to use sample data instead of API
const DEMO_MODE = true;

function getApiBase() {
  // e.g. VITE_API_BASE="http://localhost:3000" or ""
  const base = import.meta.env.VITE_API_BASE as string | undefined;
  return base?.replace(/\/$/, "") || "";
}

function joinUrl(base: string, path: string) {
  if (!base) return path; // relative to current origin
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  endpoint: string,
  data?: unknown | undefined,
): Promise<Response> {
  // In demo mode, simulate auth and other operations
  if (DEMO_MODE) {
    // Mock authentication endpoints
    if (endpoint === "/api/auth/me") {
      const demoUser = {
        id: "demo-user-id",
        username: "demo",
        name: "Demo User",
        email: "demo@campaignforge.com",
        role: "admin"
      };
      return new Response(JSON.stringify(demoUser), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    if (endpoint === "/api/auth/login" || endpoint === "/api/auth/register") {
      const demoUser = {
        id: "demo-user-id",
        username: "demo",
        name: "Demo User", 
        email: "demo@campaignforge.com",
        role: "admin"
      };
      return new Response(JSON.stringify(demoUser), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    if (endpoint === "/api/auth/logout") {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // For other non-GET requests, return success
    if (method !== "GET") {
      return new Response(JSON.stringify({ success: true, id: Date.now().toString() }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
  
  const url = endpoint.startsWith("http") ? endpoint : joinUrl(getApiBase(), endpoint);
  
  const response = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    credentials: "include",
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn = <T>(options: {
  on401: UnauthorizedBehavior;
}): QueryFunction<T> =>
  async ({ queryKey }) => {
    const endpoint = queryKey.join("/") as string;
    
    // Return sample data in demo mode
    if (DEMO_MODE) {
      switch (endpoint) {
        case "/api/campaigns":
          return sampleCampaigns as T;
        case "/api/contacts":
          return sampleContacts as T;
        case "/api/tasks":
          return sampleTasks as T;
        case "/api/dashboard/metrics":
          return sampleMetrics as T;
        case "/api/activities":
          return sampleMetrics.recentActivities as T;
        default:
          return [] as T;
      }
    }
    
    const res = await fetch(joinUrl(getApiBase(), endpoint), {
      credentials: "include",
    });

    if (options.on401 === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
