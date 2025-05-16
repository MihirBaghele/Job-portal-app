// src/components/RoleSelection.jsx
import { Link } from "react-router-dom";

const RoleSelection = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700">
      {/* Hero Section */}
      <div className="absolute top-10 text-center w-full">
        <h1 className="text-5xl font-extrabold text-white mb-4">Welcome to Info Origin Job Portal </h1>
        <p className="text-xl text-white mb-8">Your platform for seamless recruitment and candidate management</p>
        <Link to="/about" className="text-white font-semibold text-lg underline hover:text-yellow-300 transition">
          Learn more about us
        </Link>
      </div>

      {/* Role Cards Section */}
      <div className="flex flex-col md:flex-row gap-8 p-8 z-10">
        {/* Candidate Card */}
        <Link 
          to="/login?role=candidate" 
          className="bg-white p-8 rounded-xl shadow-2xl w-80 border border-white/20 backdrop-blur-sm relative overflow-hidden hover:scale-105 hover:shadow-lg transition-all duration-300 transform-gpu"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Candidate</h3>
            <p className="text-gray-600 mb-4">Login to access your candidate dashboard</p>
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              Login as Candidate
            </button>
          </div>
        </Link>

        {/* Recruiter Card */}
        <Link 
          to="/login?role=recruiter" 
          className="bg-white p-8 rounded-xl shadow-2xl w-80 border border-white/20 backdrop-blur-sm relative overflow-hidden hover:scale-105 hover:shadow-lg transition-all duration-300 transform-gpu"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Recruiter</h3>
            <p className="text-gray-600 mb-4">Login to access recruiter tools and requirements</p>
            <button className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">
              Login as Recruiter
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default RoleSelection;
