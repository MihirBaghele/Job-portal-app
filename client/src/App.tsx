import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css"; // Ensure Tailwind styles are included
import { useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import SignUp from "./components/SignUp";  // Add SignUp component
import Candidates from "./components/Candidates";
import Requirements from "./components/Requirements";
import { ReactNode } from "react"; // ✅ Import ReactNode
import RoleSelection from "./components/RoleSelection";


const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<RoleSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/candidates" element={<ProtectedRoute><Candidates /></ProtectedRoute>} />
        <Route path="/requirements" element={<ProtectedRoute><Requirements /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
