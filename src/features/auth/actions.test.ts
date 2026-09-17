import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { EmailAlreadyExistsError, registerUser } from "../services/auth";
import { signUpAction, type SignUpState } from "./actions";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("../services/auth", () => {
  class MockEmailAlreadyExistsError extends Error {
    constructor() {
      super("Este e-mail já foi cadastrado.");
      this.name = "EmailAlreadyExistsError";
    }
  }

  return {
    EmailAlreadyExistsError: MockEmailAlreadyExistsError,
    registerUser: jest.fn(),
  };
});

const mockedCookies = cookies as jest.MockedFunction<typeof cookies>;
const mockedRedirect = redirect as jest.MockedFunction<typeof redirect>;
const mockedRegisterUser = registerUser as jest.MockedFunction<typeof registerUser>;
const mockCookieStore = {
  set: jest.fn(),
  delete: jest.fn(),
};

const initialState: SignUpState = { error: null, fieldErrors: {} };
const validFields = {
  username: "student",
  email: "student@example.com",
  password: "Senha@123",
};

function createFormData(fields = validFields) {
  const formData = new FormData();
  formData.set("username", fields.username);
  formData.set("email", fields.email);
  formData.set("password", fields.password);
  return formData;
}

describe("signUpAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedCookies.mockResolvedValue(
      mockCookieStore as unknown as Awaited<ReturnType<typeof cookies>>,
    );
  });

  it("returns the validation error without calling the service", async () => {
    const formData = createFormData({
      ...validFields,
      email: "invalid-email",
    });

    const result = await signUpAction(initialState, formData);

    expect(result).toEqual({
      error: null,
      fieldErrors: { email: "E-mail inválido" },
    });
    expect(mockedRegisterUser).not.toHaveBeenCalled();
    expect(mockedCookies).not.toHaveBeenCalled();
  });

  it("returns the duplicate email error", async () => {
    mockedRegisterUser.mockRejectedValue(new EmailAlreadyExistsError());

    const result = await signUpAction(initialState, createFormData());

    expect(result).toEqual({
      error: null,
      fieldErrors: { email: "Este e-mail já foi cadastrado." },
    });
    expect(mockedCookies).not.toHaveBeenCalled();
    expect(mockedRedirect).not.toHaveBeenCalled();
  });

  it("returns a generic error when the service fails unexpectedly", async () => {
    mockedRegisterUser.mockRejectedValue(new Error("database unavailable"));

    const result = await signUpAction(initialState, createFormData());

    expect(result).toEqual({
      error: "Não foi possível criar a conta. Tente novamente.",
      fieldErrors: {},
    });
    expect(mockedCookies).not.toHaveBeenCalled();
    expect(mockedRedirect).not.toHaveBeenCalled();
  });

  it("sets the session cookie and redirects after successful registration", async () => {
    mockedRegisterUser.mockResolvedValue({
      user: {} as never,
      token: "signed-token",
    });

    await signUpAction(initialState, createFormData());

    expect(mockedRegisterUser).toHaveBeenCalledWith(validFields);
    expect(mockCookieStore.set).toHaveBeenCalledWith("token", "signed-token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 2,
    });
    expect(mockedRedirect).toHaveBeenCalledWith("/trails");
  });
});
