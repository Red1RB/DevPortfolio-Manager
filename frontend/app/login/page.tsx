"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForm, AuthFormData } from "@/components/AuthForm";

export default function LoginPage() {
  const router = useRouter();
  const { user, login, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  const handleLogin = async (data: AuthFormData) => {
    await login(data.email, data.password);
    router.push("/dashboard");
  };

  if (isLoading || user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <AuthForm mode="login" onSubmit={handleLogin} />
    </div>
  );
}
