"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function DeletedAccountToast() {
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      router.replace("/", { scroll: false });
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  if (!isVisible) return null;

  return (
    <div className="mx-auto mb-6 max-w-md rounded-md border border-green-200 bg-green-50 p-4 text-center text-sm font-medium text-green-800 shadow-sm transition-opacity duration-300 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
      Sua conta foi excluída com sucesso.
    </div>
  );
}