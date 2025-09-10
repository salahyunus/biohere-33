import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PasswordProtection } from "./PasswordProtection";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <PasswordProtection />;
  }

  return <>{children}</>;
};
