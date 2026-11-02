import { renderToStaticMarkup } from "react-dom/server";
import type { UserProfile } from "../types/auth.types";
import { ProfileCard } from "./ProfileCard";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));
jest.mock("../actions", () => ({ updateProfileUserAction: jest.fn() }));
jest.mock("./DeleteAccountModal", () => ({ DeleteAccountModal: () => null }));
jest.mock("@/utils/dateFormatter", () => ({ FormatDate: () => "01/01/2026" }));

const user = {
  username: "aluno",
  email: "aluno@example.com",
  role: "student",
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
} as unknown as UserProfile;

describe("ProfileCard - password strength indicator", () => {
  it("does not render the indicator or the password form while the profile is not being edited", () => {
    const markup = renderToStaticMarkup(<ProfileCard initialUser={user} />);

    expect(markup).toContain("Editar Perfil");
    expect(markup).not.toContain("profile-password");
    expect(markup).not.toContain("Requisitos da senha");
    expect(markup).not.toContain("profile-password-strength");
  });
});