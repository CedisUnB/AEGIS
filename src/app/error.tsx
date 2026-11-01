"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string; statusCode?: number };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro capturado:", error);
  }, [error]);

  const isForbidden = error.message.includes("403") || error.name === "ForbiddenError";
  const isUnauthorized = error.message.includes("401");

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 bg-surface min-h-screen">
      <div className="max-w-md rounded-xl bg-surface-alt p-8 shadow-sm">
        <span className="text-4xl font-extrabold text-cancel">
          {isForbidden ? "401" : isUnauthorized ? "401" : "Erro"}
        </span>

        <h2 className="mt-4 text-xl font-bold text-foreground">
          {isForbidden
            ? "Acesso Proibido"
            : isUnauthorized
            ? "Sessão Expirada ou Não Autorizada"
            : "Ocorreu um problema inesperado"}
        </h2>

        <p className="mt-2 text-sm text-foreground-muted">
          {isForbidden
            ? "Você não possui permissão de administrador para acessar este recurso."
            : isUnauthorized
            ? "Por favor, autentique-se para continuar navegando."
            : error.message || "Não foi possível carregar a página solicitada."}
        </p>

        <div className="mt-6 flex justify-center gap-3">
          {/* Botão para tentar novamente se for erro transitório */}
          {!isForbidden && !isUnauthorized && (
            <button
              onClick={() => reset()}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-hover transition"
            >
              Tentar novamente
            </button>
          )}

          <Link
            href={"/tracks"}
            className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
          >
            {"Voltar para o Início"}
          </Link>
        </div>
      </div>
    </div>
  );
}