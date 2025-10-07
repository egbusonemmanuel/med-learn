// src/lib/api.js

// ✅ Automatically detects correct backend URL
// Uses .env variable if provided, otherwise uses the current site origin
const BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || window.location.origin;

// ✅ Safe wrapper for all fetch requests
async function safeFetch(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ✅ Fetch current user profile
export async function fetchProfile() {
  return safeFetch(`${BASE_URL}/api/profile`);
}

// ✅ Fetch user statistics by user ID
export async function fetchUserStats(userId) {
  return safeFetch(`${BASE_URL}/api/stats/${userId}`);
}

// ✅ Fetch leaderboard (default 10 users)
export async function fetchLeaderboard(limit = 10) {
  return safeFetch(`${BASE_URL}/api/leaderboard?limit=${limit}`);
}

// ✅ Fetch library items (uploaded files, courses, etc.)
export async function fetchLibraryItems() {
  return safeFetch(`${BASE_URL}/api/library`);
}

// ✅ Upload a new library item (e.g., file, course material)
export async function uploadLibraryItem(formData) {
  const res = await fetch(`${BASE_URL}/api/library/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Upload failed");
  }
  return res.json().catch(() => ({}));
}
console.log("🌐 Using API Base URL:", BASE_URL);
