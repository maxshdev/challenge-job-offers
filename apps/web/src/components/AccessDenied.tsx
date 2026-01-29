"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/src/components/ToastContext";

type Props = {
  message: string;
};

export function AccessDenied({ message }: Props) {
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    showToast(message, "error");
    // Redirigir después de 1 segundo
    const timeout = setTimeout(() => router.push("/"), 1000);
    return () => clearTimeout(timeout);
  }, [message, router, showToast]);

  return (
    <p className="text-error p-10">
      {message}. Redirigiendo al home...
    </p>
  );
}
