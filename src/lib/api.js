// src/lib/api.js

// Example: fetch profile
export async function fetchProfile() {
  const res = await fetch("http://localhost:4000/api/profile");
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

// Example: fetch user stats
export async function fetchUserStats(userId) {
  const res = await fetch(`http://localhost:4000/api/stats/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

// ✅ Add missing fetchLeaderboard
export async function fetchLeaderboard(limit = 10) {
  const res = await fetch(`http://localhost:4000/api/leaderboard?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
}

// (Optional) If you also use library features
export async function fetchLibraryItems() {
  const res = await fetch("http://localhost:4000/api/library");
  if (!res.ok) throw new Error("Failed to fetch library items");
  return res.json();
}

export async function uploadLibraryItem(formData) {
  const res = await fetch("http://localhost:4000/api/library", {
    method: "POST",
    body: formData, // 🚀 send FormData directly
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}
