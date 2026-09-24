import { UserProfile } from "@/features/auth";

  
export function FormatDate(user: UserProfile) {
  const formattedDate = user.createdAt
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(user.createdAt))
    : "Data não informada";
    return formattedDate;
}