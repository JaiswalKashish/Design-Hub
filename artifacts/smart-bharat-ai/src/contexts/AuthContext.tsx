import { createContext, useContext, useState, ReactNode } from "react";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  photoUrl: string | null;
}

interface AuthContextType {
  user: MockUser | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);

  const login = () => {
    setUser({
      id: "user-1",
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      photoUrl: null,
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
