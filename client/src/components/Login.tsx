import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { validatePassword } from "../utils/passwordValidation";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "candidate";

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedRole) {
      navigate(storedRole === "recruiter" ? "/requirements" : "/candidates");
    }    
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        toast.error(passwordValidation.message);
        return;
      }

      const response = await axios.post("http://localhost:5000/api/users/login", {
        user_id: userId,
        password
      });

      const data = response.data;

      if (!data.token || !data.role) throw new Error("Invalid response from server");

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role.toLowerCase());
      localStorage.setItem("userId", data.userId);

      toast.success(`Logged in successfully as ${data.role}`);

      // Dismiss toast after 3 seconds manually if needed
      setTimeout(() => {
        navigate(data.role.toLowerCase() === "recruiter" ? "/requirements" : "/candidates");
      }, 2000);

    } catch (error) {
      console.error("Login Failed:", error);
      const errorMessage = "Login failed. Please check your credentials.";
      toast.error(errorMessage);

      setTimeout(() => {
        toast.dismiss();
      }, 3000);  // Automatically dismiss after 3 seconds
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700">
      <div className="absolute top-6 left-6 flex items-center space-x-2">
        {/* Logo and Text on the Left */}
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
        <span className="text-xl font-bold text-white">Info Origin</span>
      </div>

      {/* Home Button on the Right */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => navigate("/")} // Change URL if needed
          className="flex items-center space-x-2 text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 2L2 8h3v8h4V12h2v4h4V8h3L10 2z" clipRule="evenodd" />
          </svg>
          <span className="font-bold">Home</span>
        </button>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-2xl w-96 border border-white/20 backdrop-blur-sm relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-400 rounded-full opacity-20"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-400 rounded-full opacity-20"></div>

        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${role === "candidate" ? "bg-blue-100" : "bg-purple-100"}`}>
              {role === "candidate" ? (
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                </svg>
              )}
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-1 text-center">
            {role === "candidate" ? "Candidate Login" : "Recruiter Login"}
          </h2>
          <p className="text-gray-500 text-center mb-6">
            {role === "candidate"
              ? "Login to access your candidate dashboard"
              : "Login to access recruiter tools"}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="User ID"
              className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <div className="absolute left-3 top-3.5 text-gray-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
          </div>

          <div className="mb-6 relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="absolute left-3 top-3.5 text-gray-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Password must contain: 8+ chars, uppercase, lowercase, number, and special char (!@#$%^&*)
            </p>
          </div>

          <button
            onClick={handleLogin}
            className={`w-full text-white py-3 rounded-lg font-semibold text-lg transition duration-300 shadow-lg hover:shadow-indigo-500/30 ${
              role === "candidate"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            }`}
          >
            Login
          </button>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to={`/signup?role=${role}`}
              className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition duration-200"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default Login;