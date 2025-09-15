import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { sampleCampaigns, sampleContacts, sampleTasks, sampleMetrics } from "./sampleData";
import { 
  getCampaigns, saveCampaign, deleteCampaign,
  getContacts, saveContact, deleteContact,
  getTasks, saveTask, deleteTask,
  getActivities, getMetrics
} from "./localStorage";

// Demo mode flag - set to true to use sample data instead of API
const DEMO_MODE = false;

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
    
    // Handle CRUD operations with localStorage persistence
    if (method === "POST") {
      if (endpoint === "/api/campaigns") {
        const campaign = saveCampaign({ ...data as any, id: `camp-${Date.now()}` });
        return new Response(JSON.stringify(campaign), {
          status: 201,
          headers: { "Content-Type": "application/json" }
        });
      }
      if (endpoint === "/api/contacts") {
        const contact = saveContact({ ...data as any, id: `contact-${Date.now()}` });
        return new Response(JSON.stringify(contact), {
          status: 201,
          headers: { "Content-Type": "application/json" }
        });
      }
      if (endpoint === "/api/tasks") {
        const task = saveTask({ ...data as any, id: `task-${Date.now()}` });
        return new Response(JSON.stringify(task), {
          status: 201,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    
    if (method === "PUT") {
      if (endpoint.startsWith("/api/campaigns/")) {
        const campaign = saveCampaign(data as any);
        return new Response(JSON.stringify(campaign), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
      if (endpoint.startsWith("/api/contacts/")) {
        const contact = saveContact(data as any);
        return new Response(JSON.stringify(contact), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
      if (endpoint.startsWith("/api/tasks/")) {
        const task = saveTask(data as any);
        return new Response(JSON.stringify(task), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    
    if (method === "DELETE") {
      if (endpoint.startsWith("/api/campaigns/")) {
        const id = endpoint.split("/").pop();
        if (id) deleteCampaign(id);
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
      if (endpoint.startsWith("/api/contacts/")) {
        const id = endpoint.split("/").pop();
        if (id) deleteContact(id);
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
      if (endpoint.startsWith("/api/tasks/")) {
        const id = endpoint.split("/").pop();
        if (id) deleteTask(id);
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
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
    
    // Return persistent data in demo mode
    if (DEMO_MODE) {
      switch (endpoint) {
        case "/api/campaigns":
          return getCampaigns() as T;
        case "/api/contacts":
          return getContacts() as T;
        case "/api/tasks":
          return getTasks() as T;
        case "/api/dashboard/metrics":
          return getMetrics() as T;
        case "/api/activities":
          return getActivities() as T;
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
