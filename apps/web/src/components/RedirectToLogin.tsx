// src/components/RedirectToLogin.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RedirectToLogin() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.push("/login");
    }, 2000);

    return () => clearTimeout(t);
  }, [router]);

  return (
    <p className="text-error p-10">
      No estás logeado. Redirigiendo al login...
    </p>
  );
}
