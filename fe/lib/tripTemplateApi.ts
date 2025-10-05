import { supabase } from "./supabase";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export interface TripTemplate {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  category: "comfort" | "energy" | "relax" | "adventure" | "culture" | "nature";
  mood_target: "sad" | "stressed" | "tired" | "energetic" | "calm" | "excited";
  energy_level?: "low" | "medium" | "high";
  duration_hours?: number;
  difficulty?: "easy" | "moderate" | "hard";
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface TripTemplatePoint {
  id: string;
  template_id: string;
  name: string;
  description?: string;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  order_index: number;
  estimated_duration_minutes?: number;
  activity_type?:
    | "walk"
    | "visit"
    | "eat"
    | "relax"
    | "sport"
    | "culture"
    | "nature";
  notes?: string;
  created_at: string;
}

export interface TripTemplateWithPoints extends TripTemplate {
  points: TripTemplatePoint[];
}

export interface UserMoodData {
  mood?: "sad" | "stressed" | "tired" | "energetic" | "calm" | "excited";
  energy_level?: "low" | "medium" | "high";
  stress_level?: number; // 0-10
  sleep_quality?: number; // 0-10
}

async function getAuthToken(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token || null;
}

export async function getAllTemplates(): Promise<TripTemplate[]> {
  const response = await fetch(`${API_URL}/api/trip-templates`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch templates");
  }

  return response.json();
}

export async function getTemplateById(
  id: string,
): Promise<TripTemplateWithPoints> {
  const response = await fetch(`${API_URL}/api/trip-templates/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch template");
  }

  return response.json();
}

export async function getRecommendedTemplate(
  moodData: UserMoodData,
): Promise<TripTemplateWithPoints> {
  const response = await fetch(`${API_URL}/api/trip-templates/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(moodData),
  });

  if (!response.ok) {
    throw new Error("Failed to get recommendation");
  }

  return response.json();
}

export async function createTripFromTemplate(
  templateId: string,
  startDate?: string,
): Promise<any> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${API_URL}/api/trip-templates/${templateId}/create-trip`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ start_date: startDate }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to create trip from template");
  }

  return response.json();
}

export async function smartCreateTrip(moodData: UserMoodData): Promise<{
  trip: any;
  template_used: string;
  reasoning: {
    mood: string | null;
    energy: string | null;
  };
}> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/api/trip-templates/smart-create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(moodData),
  });

  if (!response.ok) {
    throw new Error("Failed to create smart trip");
  }

  return response.json();
}
