// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import AuthPage from "./components/Auth/AuthPage";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Dashboard from "./components/Dashboard/Dashboard";
import MainDocument from "./components/Editor/MainDocument";
import Navbar from "./components/Common/Navbar";

const AppContent = () => {
  const location = useLocation();
  // Hide Navbar on the authentication page
  const hideNavbar = location.pathname === "/";
  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="pt-14">
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor/:id"
            element={
              <ProtectedRoute>
                <MainDocument />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
