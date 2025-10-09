// =======================================
// 🌐 API CONFIGURATION — PRODUCTION READY
// =======================================

// Load API base URL from environment variable
// ⚠️ Make sure your .env (on Vercel) has:
// VITE_API_URL=https://med-learn-backend.onrender.com
const BASE_URL = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "");
console.log("🌐 Using API Base URL:", BASE_URL);

// Helper: Safe fetch wrapper with error handling
async function safeFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Request failed: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("❌ API Error:", err.message);
    throw err;
  }
}

// =======================================
// 👤 USER / AUTH ENDPOINTS
// =======================================

// ✅ Fetch user profile
export async function fetchUserProfile() {
  return safeFetch(`${BASE_URL}/api/profile`);
}

// ✅ Fetch leaderboard (default 10 users)
export async function fetchLeaderboard(limit = 10) {
  return safeFetch(`${BASE_URL}/api/leaderboard?limit=${limit}`);
}

// ✅ Fetch user courses
export async function fetchCourses() {
  return safeFetch(`${BASE_URL}/api/courses`);
}

// ✅ Fetch quizzes
export async function fetchQuizzes() {
  return safeFetch(`${BASE_URL}/api/quizzes`);
}

// ✅ Submit a quiz
export async function submitQuiz(quizId, answers, userEmail) {
  return safeFetch(`${BASE_URL}/api/quizzes/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quizId, answers, email: userEmail }),
  });
}

// =======================================
// 🧠 FLASHCARDS
// =======================================

// ✅ Fetch all flashcards
export async function fetchFlashcards() {
  return safeFetch(`${BASE_URL}/api/flashcards`);
}

// ✅ Create a new flashcard
export async function createFlashcard(data) {
  return safeFetch(`${BASE_URL}/api/flashcards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// ✅ Delete a flashcard
export async function deleteFlashcard(id) {
  return safeFetch(`${BASE_URL}/api/flashcards/${id}`, {
    method: "DELETE",
  });
}

// =======================================
// 🏆 COMPETITIONS
// =======================================

// ✅ Fetch all competitions
export async function fetchCompetitions() {
  return safeFetch(`${BASE_URL}/api/competitions`);
}

// ✅ Join competition
export async function joinCompetition(competitionId, userEmail) {
  return safeFetch(`${BASE_URL}/api/competitions/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ competitionId, email: userEmail }),
  });
}

// ✅ Submit competition result
export async function submitCompetitionResult(competitionId, userEmail, score) {
  return safeFetch(`${BASE_URL}/api/competitionresult/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ competitionId, email: userEmail, score }),
  });
}

// =======================================
// 📚 LIBRARY (FILE UPLOADS / MATERIALS)
// =======================================

// ✅ Fetch library items
export async function fetchLibraryItems() {
  return safeFetch(`${BASE_URL}/api/library`);
}

// ✅ Upload a new library item
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

// =======================================
// ⚙️ ADMIN ENDPOINTS
// =======================================

// ✅ Check if user is an admin
export async function checkAdmin(email) {
  return safeFetch(`${BASE_URL}/api/admin/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

// ✅ Fetch all users (admin)
export async function fetchAllUsers() {
  return safeFetch(`${BASE_URL}/api/admin/users`);
}

// ✅ Delete a user (admin)
export async function deleteUser(email) {
  return safeFetch(`${BASE_URL}/api/admin/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

// =======================================
// 🚀 EXPORT EVERYTHING
// =======================================
export default {
  fetchUserProfile,
  fetchLeaderboard,
  fetchCourses,
  fetchQuizzes,
  submitQuiz,
  fetchFlashcards,
  createFlashcard,
  deleteFlashcard,
  fetchCompetitions,
  joinCompetition,
  submitCompetitionResult,
  fetchLibraryItems,
  uploadLibraryItem,
  checkAdmin,
  fetchAllUsers,
  deleteUser,
};
