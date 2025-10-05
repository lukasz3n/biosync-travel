import { supabase } from "./supabase";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export interface Trip {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  image_url?: string;
  start_date?: string;
  end_date?: string;
  status: "planned" | "active" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface TripPoint {
  id: string;
  trip_id: string;
  name: string;
  description?: string;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  order_index: number;
  status: "pending" | "in_progress" | "completed" | "skipped";
  completed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TripWithPoints extends Trip {
  points: TripPoint[];
}

async function getAuthToken(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token || null;
}

export async function getAllTrips(): Promise<Trip[]> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/api/trips`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch trips");
  }

  return response.json();
}

export async function getTripById(id: string): Promise<TripWithPoints> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/api/trips/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch trip");
  }

  return response.json();
}

export async function getActiveTrip(): Promise<TripWithPoints | null> {
  const trips = await getAllTrips();
  const activeTrip = trips.find((trip) => trip.status === "active");

  if (!activeTrip) {
    return null;
  }

  return getTripById(activeTrip.id);
}

export async function createTrip(trip: {
  name: string;
  description?: string;
  image_url?: string;
  start_date?: string;
  end_date?: string;
  status?: "planned" | "active" | "completed" | "cancelled";
}): Promise<Trip> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/api/trips`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(trip),
  });

  if (!response.ok) {
    throw new Error("Failed to create trip");
  }

  return response.json();
}

export async function updateTrip(
  id: string,
  updates: Partial<Trip>,
): Promise<Trip> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/api/trips/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update trip");
  }

  return response.json();
}

export async function deleteTrip(id: string): Promise<void> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/api/trips/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete trip");
  }
}

export async function createTripPoint(
  tripId: string,
  point: {
    name: string;
    description?: string;
    location_name?: string;
    latitude?: number;
    longitude?: number;
    order_index?: number;
    status?: "pending" | "in_progress" | "completed" | "skipped";
    notes?: string;
  },
): Promise<TripPoint> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/api/trips/${tripId}/points`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(point),
  });

  if (!response.ok) {
    throw new Error("Failed to create trip point");
  }

  return response.json();
}

export async function updateTripPoint(
  tripId: string,
  pointId: string,
  updates: Partial<TripPoint>,
): Promise<TripPoint> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${API_URL}/api/trips/${tripId}/points/${pointId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to update trip point");
  }

  return response.json();
}

export async function deleteTripPoint(
  tripId: string,
  pointId: string,
): Promise<void> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${API_URL}/api/trips/${tripId}/points/${pointId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete trip point");
  }
}
