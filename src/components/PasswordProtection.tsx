import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, BookOpen, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const PasswordProtection: React.FC = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { authenticate } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Small delay for better UX
    setTimeout(() => {
      if (authenticate(password)) {
        setPassword("");
      } else {
        setError("Invalid password. Please try again.");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-primary/10 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <BookOpen className="h-6 w-6" />
            Biology Unit-4 Study Hub
          </CardTitle>
          <CardDescription className="mt-2">
            This study platform is password protected. Please enter the access
            code to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter access code"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-center text-lg tracking-widest"
                autoFocus
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!password.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2" />
                  Verifying...
                </>
              ) : (
                "Access Study Hub"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>Authorized access only</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
