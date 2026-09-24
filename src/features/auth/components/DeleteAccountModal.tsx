"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteAccountAction } from "../actions";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const response = await deleteAccountAction({ password });

      if (!response.success) {
        setError(response.error);
        return;
      }

      router.push("/?deleted=true");
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 shadow-xl dark:border-red-900/50 dark:bg-gray-900">
        <h3 className="text-lg font-bold text-red-600 dark:text-red-400">
          Excluir Conta Permanentemente
        </h3>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Esta ação é <strong>irreversível</strong>. Todos os seus dados serão anonimizados e sua sessão será encerrada de acordo com as diretrizes da LGPD.
        </p>

        {error && (
          <div className="mt-3 rounded-md bg-red-50 p-2.5 text-xs font-medium text-red-800 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleDelete} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Digite sua senha atual para confirmar
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
              className="mt-1.5 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-md border border-gray-300 px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isPending ? "Excluindo..." : "Confirmar Exclusão"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};