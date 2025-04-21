"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      const to = encodeURIComponent(window.location.pathname);
      router.replace(`/login?next=${to}`);
    }
  }, [router]);
  return <>{children}</>;
}
