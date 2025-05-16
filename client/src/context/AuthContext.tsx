import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  role: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [role, setRole] = useState<string | null>(localStorage.getItem("role")); // 🔹 Store role in state

  const login = (token: string, role: string) => {
    setToken(token);
    setRole(role); // 🔹 Set role when logging in
    localStorage.setItem("token", token);
    localStorage.setItem("role", role); // 🔹 Store role in localStorage
  };

  const logout = () => {
    setToken(null);
    setRole(null); // 🔹 Clear role on logout
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔹 Custom Hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};


//