"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserProfile, UpdateProfileInput } from "../types/auth.types";
import { updateProfileUserAction } from "../actions";
import { FormatDate } from "@/utils/dateFormatter";

interface ProfileCardProps {
  initialUser: UserProfile;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ initialUser }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<UpdateProfileInput>({
    username: initialUser.username,
    email: initialUser.email,
    password: "",
    confirmPassword: "",
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof UpdateProfileInput, string>>>({});

  const formattedDate = FormatDate(user);

  const handleCancel = () => {
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      confirmPassword: "",
    });
    setFieldErrors({});
    setErrorMessage(null);
    setIsEditing(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    startTransition(async () => {
      const response = await updateProfileUserAction(formData);

      if (!response.success) {
        setErrorMessage(response.error);
        if (response.fieldErrors) {
          setFieldErrors(response.fieldErrors);
        }
        return;
      }

      if (response.requiresReauth) {
        router.push("/auth/login?reauth=1");
        return;
      }

      setUser(response.data);
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      setIsEditing(false);
      setToastMessage("Perfil atualizado com sucesso");
      router.refresh();

      setTimeout(() => setToastMessage(null), 4000);
  });
};

  return (
    <div className="relative w-full max-w-lg rounded-xl p-6 shadow-sm bg-surface-alt">
      {toastMessage && (
        <div className="mb-4 rounded-md bg-confirm p-3 text-sm font-medium text-green-800 border border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800 transition">
          {toastMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm font-medium text-red-800 border border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800">
          {errorMessage}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 font-bold text-white text-xl uppercase">
            {user.username.slice(0, 2)}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {user.username}
            </h2>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Estudante
            </span>
          </div>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-md bg-blue-600 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            Editar Perfil
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Nome de Utilizador
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
      ) : (
        <form onSubmit={handleSave} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Nome de Utilizador
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              required
            />
            {fieldErrors.username && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              E-mail
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              required
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Nova Senha (opcional)
            </label>
            <input
              type="password"
              placeholder="Deixe em branco para manter a atual"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
            )}
          </div>

          {formData.password && (
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.confirmPassword}</p>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isPending}
              className="rounded-md border border-gray-300 px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? "A salvar..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};