"use client";

import React from "react";
import { UserProfile } from "../types";

interface ProfileCardProps {
    user: UserProfile;
}

export function ProfileCard({ user }: ProfileCardProps) {
    const formattedDate = user.createdAt
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(user.createdAt))
    : "Data não informada";

    return (
    <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-6 flex items-center space-x-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 font-bold text-white text-xl uppercase">
          {user.username.slice(0, 2)}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {user.username}
          </h2>
          <span className="inline-block text-xs font-medium text-blue-600 dark:text-blue-400">
            Estudante
          </span>
        </div>
      </div>

      <div className="space-y-4 text-sm">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Nome de Usuário
          </label>
          <p className="mt-1 font-medium text-gray-800 dark:text-gray-200">
            {user.username}
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            E-mail
          </label>
          <p className="mt-1 font-medium text-gray-800 dark:text-gray-200">
            {user.email}
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Data de Cadastro
          </label>
          <p className="mt-1 font-medium text-gray-800 dark:text-gray-200">
            {formattedDate}
          </p>
        </div>
      </div>
    </div>
  );
};