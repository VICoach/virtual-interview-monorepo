"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import VerificationAlert from "@/components/auth/VerificationAlert";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("access_token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      router.replace("/");
    } else {
      router.replace("/login");
    }
  }, [token, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <VerificationAlert type="oauth-success" />
    </div>
  );
}
