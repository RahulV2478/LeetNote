// src/components/AuthPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Login state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup state
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Login failed.");
      }
      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/dashboard"); // Redirect after login
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    if (signupPassword !== signupConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: signupUsername, password: signupPassword }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Registration failed.");
      }
      await response.json();
      // Registration succeeded: switch to login mode
      setIsLogin(true);
      setError("Registration successful. Please log in.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Tabs for Login/Signup */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => {
              setError(null);
              setIsLogin(true);
            }}
            className={`px-4 py-2 font-semibold border-b-2 ${
              isLogin ? "text-indigo-600 border-indigo-600" : "text-gray-600 border-transparent"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setError(null);
              setIsLogin(false);
            }}
            className={`px-4 py-2 font-semibold border-b-2 ${
              !isLogin ? "text-indigo-600 border-indigo-600" : "text-gray-600 border-transparent"
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && <p className="text-center text-red-500 mb-4">{error}</p>}

        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-indigo-300"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-indigo-300"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition duration-150"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-indigo-300"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-indigo-300"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-indigo-300"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition duration-150"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
