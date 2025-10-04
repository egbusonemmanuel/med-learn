// src/lib/api.js

// Base URL from Vite env
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Fetch profile
export async function fetchProfile() {
  const res = await fetch(`${BASE_URL}/api/users/profile`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

// Fetch user stats
export async function fetchUserStats(userId) {
  const res = await fetch(`${BASE_URL}/api/users/${userId}/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

// Fetch leaderboard
export async function fetchLeaderboard(limit = 10) {
  const res = await fetch(`${BASE_URL}/api/leaderboard?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
}

// Fetch library items
export async function fetchLibraryItems() {
  const res = await fetch(`${BASE_URL}/api/library`);
  if (!res.ok) throw new Error("Failed to fetch library items");
  return res.json();
}

// Upload library item
export async function uploadLibraryItem(formData) {
  const res = await fetch(`${BASE_URL}/api/library/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}
