// src/pages/AuthPage.jsx
import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  Paper,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

// Ripple WaterButton (Blue + Gold)
function WaterButton({ children, onClick, type = "button", fullWidth = false }) {
  const handleClick = (e) => {
    const button = e.currentTarget;
    const ripple = document.createElement("span");

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.className = "ripple";
    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);

    if (onClick) onClick(e);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 0.95 }}
      style={{
        display: fullWidth ? "block" : "inline-block",
        borderRadius: 999,
        position: "relative",
        width: fullWidth ? "100%" : "auto",
      }}
    >
      <button
        type={type}
        onClick={handleClick}
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "14px 36px",
          borderRadius: "999px",
          fontWeight: "bold",
          fontSize: "1.05rem",
          color: "white",
          border: "none",
          cursor: "pointer",
          width: fullWidth ? "100%" : "auto",
          background: "linear-gradient(135deg, #1e40af, #fbbf24, #1e40af)",
          backgroundSize: "200% 200%",
          animation: "flow 6s ease infinite, pulse 3s ease-in-out infinite",
          boxShadow:
            "0 8px 24px rgba(30, 64, 175, 0.4), 0 4px 12px rgba(251, 191, 36, 0.3)",
        }}
      >
        {children}
      </button>

      {/* Styles */}
      <style>
        {`
          @keyframes flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.03); }
          }
          .ripple {
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(251, 191, 36, 0.6);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-effect 0.6s linear;
            pointer-events: none;
          }
          @keyframes ripple-effect {
            to {
              transform: scale(15);
              opacity: 0;
            }
          }
        `}
      </style>
    </motion.div>
  );
}

const MotionPaper = motion(Paper);

export default function AuthPage() {
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const navigate = useNavigate();

  const handleTabChange = (e, newValue) => setTab(newValue);
  const togglePassword = () => setShowPassword((s) => !s);

  const showMessage = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      showMessage(error.message, "error");
    } else {
      showMessage("Login successful!", "success");
      navigate("/dashboard");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fullName = e.target.fullName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    setLoading(false);

    if (error) {
      showMessage(error.message, "error");
    } else {
      showMessage("Signup successful! Check your email for verification.", "success");
      navigate("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "http://localhost:5173/dashboard" },
    });
    setLoading(false);
    if (error) showMessage(error.message, "error");
  };

  // Framer Motion variants
  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120, damping: 15 } },
    exit: { y: -20, opacity: 0, transition: { duration: 0.2 } },
  };

  const formVariants = {
    hidden: { x: 30, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.35 } },
    exit: { x: -30, opacity: 0, transition: { duration: 0.22 } },
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Left Side Branding */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          px: 4,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1581092334651-ddf46a1aef4d?auto=format&fit=crop&w=1200&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0, 0, 0, 0.55)",
          },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ position: "relative", zIndex: 2, maxWidth: 520, color: "white" }}
        >
          <Typography
            variant="h2"
            fontWeight={800}
            gutterBottom
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              background: "linear-gradient(90deg, #1e40af, #fbbf24)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Medico Hub
          </Typography>

          <Typography
            variant="h6"
            sx={{ opacity: 0.95, fontSize: { xs: "1rem", md: "1.25rem" }, mb: 3 }}
          >
            Smarter learning. Stronger future.
          </Typography>

          <Typography variant="body1" sx={{ maxWidth: 480, lineHeight: 1.6, opacity: 0.9 }}>
            A dynamic ecosystem supporting medical students and young professionals 
            with mentorship, resources, and innovation. Building bridges between 
            learning, growth, and professional excellence.
          </Typography>
        </motion.div>
      </Box>

      {/* Right Side Auth Form */}
      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 3, md: 6 },
          px: { xs: 2, sm: 0 },
        }}
      >
        <MotionPaper
          elevation={12}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={cardVariants}
          sx={{
            width: "100%",
            maxWidth: 420,
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 3,
            backgroundColor: "rgba(255,255,255,0.98)",
            boxShadow: "0 12px 40px rgba(2,6,23,0.2)",
          }}
        >
          {/* Tabs */}
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="fullWidth"
            textColor="primary"
            TabIndicatorProps={{ style: { backgroundColor: "#fbbf24" } }} // gold indicator
            sx={{ mb: 3 }}
          >
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>

          <AnimatePresence mode="wait">
            {tab === 0 ? (
              <motion.form
                key="login"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleLogin}
              >
                <TextField
                  name="email"
                  label="Email"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={18} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={18} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePassword} edge="end">
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <WaterButton type="submit" fullWidth>
                  {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Login"}
                </WaterButton>

                {/* Google Login */}
                <button
                  onClick={handleGoogleLogin}
                  style={{
                    marginTop: "1rem",
                    padding: "12px",
                    border: "1px solid #ccc",
                    borderRadius: "12px",
                    width: "100%",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src="https://www.svgrepo.com/show/355037/google.svg"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                  Continue with Google
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSignup}
              >
                <TextField
                  name="fullName"
                  label="Full Name"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={18} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  name="email"
                  label="Email"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={18} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={18} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePassword} edge="end">
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <WaterButton type="submit" fullWidth>
                  {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Sign Up"}
                </WaterButton>
              </motion.form>
            )}
          </AnimatePresence>
        </MotionPaper>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
