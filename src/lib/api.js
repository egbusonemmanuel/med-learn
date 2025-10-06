// src/lib/api.js

// ✅ Dynamic base URL from .env (for deployment)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// ✅ Helper: fetch wrapper for cleaner error handling
async function safeFetch(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  return res.json();
}

// =====================
// Profile
// =====================
export async function fetchProfile() {
  return safeFetch(`${BASE_URL}/api/profile`);
}

// =====================
// User Stats
// =====================
export async function fetchUserStats(userId) {
  return safeFetch(`${BASE_URL}/api/stats/${userId}`);
}

// =====================
// Leaderboard
// =====================
export async function fetchLeaderboard(limit = 10) {
  return safeFetch(`${BASE_URL}/api/leaderboard?limit=${limit}`);
}

// =====================
// Library
// =====================
export async function fetchLibraryItems() {
  return safeFetch(`${BASE_URL}/api/library`);
}

export async function uploadLibraryItem(formData) {
  return safeFetch(`${BASE_URL}/api/library/upload`, {
    method: "POST",
    body: formData,
  });
}
