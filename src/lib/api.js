// src/lib/api.js
const BASE_URL = import.meta.env.VITE_API_URL;
console.log("🌐 Using API Base URL:", BASE_URL);

async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (err) {
    console.error("❌ API Error:", err);
    throw err;
  }
}

// 👇 Export functions only (no default export at bottom)
export async function fetchUserProfile() {
  return safeFetch(`${BASE_URL}/api/profile`);
}
