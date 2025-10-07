"use client";

import { ReactNode } from "react";
import { Folder, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
  showAuth?: boolean;
}

export function Layout({ children, showAuth = false }: LayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Folder className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                DevPortfolio Manager
              </h1>
            </div>
            {showAuth && user && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{user.username}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
