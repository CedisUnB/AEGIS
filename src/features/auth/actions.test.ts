import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  loginUser,
  registerUser,
} from "../services/auth";
import { signInAction, signUpAction, type SignInState, type SignUpState } from "./actions";

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

  class MockInvalidCredentialsError extends Error {
    constructor() {
      super("E-mail ou senha inválidos.");
      this.name = "InvalidCredentialsError";
    }
  }

  return {
    EmailAlreadyExistsError: MockEmailAlreadyExistsError,
    InvalidCredentialsError: MockInvalidCredentialsError,
    loginUser: jest.fn(),
    registerUser: jest.fn(),
  };
});

const mockedCookies = cookies as jest.MockedFunction<typeof cookies>;
const mockedRedirect = redirect as jest.MockedFunction<typeof redirect>;
const mockedLoginUser = loginUser as jest.MockedFunction<typeof loginUser>;
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

function createFormData(
  fields: Partial<typeof validFields> & Pick<typeof validFields, "email" | "password"> = validFields,
) {
  const formData = new FormData();

  if (fields.username !== undefined) {
    formData.set("username", fields.username);
  }

  formData.set("email", fields.email);
  formData.set("password", fields.password);
  return formData;
}

describe("signInAction", () => {
  const initialSignInState: SignInState = { error: null, fieldErrors: {} };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedCookies.mockResolvedValue(
      mockCookieStore as unknown as Awaited<ReturnType<typeof cookies>>,
    );
  });

  it("returns validation errors without calling the service", async () => {
    const result = await signInAction(initialSignInState, createFormData({
      email: "invalid-email",
      password: "Senha@123",
    }));

    expect(result).toEqual({
      error: null,
      fieldErrors: { email: "E-mail inválido" },
    });
    expect(mockedLoginUser).not.toHaveBeenCalled();
    expect(mockedCookies).not.toHaveBeenCalled();
  });

  it("returns an auth error when the credentials are invalid", async () => {
    mockedLoginUser.mockRejectedValue(new InvalidCredentialsError());

    const result = await signInAction(initialSignInState, createFormData());

    expect(result).toEqual({
      error: "E-mail ou senha inválidos.",
      fieldErrors: {},
    });
    expect(mockedCookies).not.toHaveBeenCalled();
    expect(mockedRedirect).not.toHaveBeenCalled();
  });

  it("sets the session cookie and redirects after successful sign-in", async () => {
    mockedLoginUser.mockResolvedValue({ user: {} as never, token: "signed-token" });

    await signInAction(initialSignInState, createFormData());

    expect(mockedLoginUser).toHaveBeenCalledWith({
      email: "student@example.com",
      password: "Senha@123",
    });
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
      error: "Este e-mail já foi cadastrado.",
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
