// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";  

// Pages
import Landing from "./pages/Landing.jsx";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Library from "./pages/library.jsx";
import Flashcards from "./pages/Flashcards.jsx";
import Quizzes from "./pages/Quizzes.jsx";
import Courses from "./pages/Courses.jsx";
import Subscriptions from "./pages/Subscriptions.jsx";
import AdminPage from "./pages/AdminPage.jsx"; 
import AdminPanel from "./pages/AdminPanel.jsx";

// 🔒 Wrapper for paid/admin-only content
function ProtectedContent({ children }) {
  const { isAdmin, isPaid } = useAuth();

  if (isAdmin || isPaid) {
    return children;
  }

  return <div className="p-6 text-center text-gray-600">🔒 This feature is locked. Please subscribe.</div>;
}

// 🔑 Wrapper for admin-only route
function AdminRoute({ children }) {
  const { currentUser, isAdmin } = useAuth();

  if (!currentUser) {
    return <Dashboard />; // fallback if not logged in
  }

  return isAdmin ? children : <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />

        {/* General Protected Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/quizzes" element={<Quizzes />} />

        {/* Paid/Admin-only Routes */}
        <Route
          path="/library"
          element={
            <ProtectedContent>
              <Library />
            </ProtectedContent>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedContent>
              <Courses />
            </ProtectedContent>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <ProtectedContent>
              <Subscriptions />
            </ProtectedContent>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-page"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
