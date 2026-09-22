import bcrypt from "bcryptjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { signToken } from "@/core/security";
import { createUser, findByEmail } from "../auth/repositories/auth.repository";
import {
  EmailAlreadyExistsError,
  registerUser,
} from "./auth";

jest.mock("bcryptjs", () => ({
  __esModule: true,
  default: {
    hash: jest.fn(),
  },
}));

jest.mock("@/core/security", () => ({
  signToken: jest.fn(),
}));

jest.mock("../auth/repositories/auth.repository", () => ({
  findByEmail: jest.fn(),
  createUser: jest.fn(),
}));

type HashFunction = (
  password: string,
  salt: number,
) => Promise<string>;

const mockedHash = bcrypt.hash as jest.MockedFunction<HashFunction>;
const mockedFindByEmail = findByEmail as jest.MockedFunction<typeof findByEmail>;
const mockedCreateUser = createUser as jest.MockedFunction<typeof createUser>;
const mockedSignToken = signToken as jest.MockedFunction<typeof signToken>;

const input = {
  username: "student",
  email: "student@example.com",
  password: "Senha@123",
};

describe("registerUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("verifica duplicidade, criptografa a senha e cria o usuário", async () => {
    const user = {
      email: input.email,
      username: input.username,
      password: "hashed-password",
      role: "student" as const,
    };

    mockedFindByEmail.mockResolvedValue(null);
    mockedHash.mockResolvedValue(user.password);
    mockedCreateUser.mockResolvedValue(user as never);
    mockedSignToken.mockResolvedValue("signed-token");

    const result = await registerUser(input);

    expect(mockedFindByEmail).toHaveBeenCalledWith(input.email);
    expect(mockedHash).toHaveBeenCalledWith(input.password, 10);
    expect(mockedCreateUser).toHaveBeenCalledWith({
      email: input.email,
      username: input.username,
      password: user.password,
    });
    expect(mockedSignToken).toHaveBeenCalledWith({
      sub: user.email,
      role: user.role,
    });
    expect(result).toEqual({ user, token: "signed-token" });
  });

  it("recusa um e-mail já cadastrado antes de criptografar ou criar", async () => {
    mockedFindByEmail.mockResolvedValue({ email: input.email } as never);

    await expect(registerUser(input)).rejects.toBeInstanceOf(
      EmailAlreadyExistsError,
    );

    expect(mockedHash).not.toHaveBeenCalled();
    expect(mockedCreateUser).not.toHaveBeenCalled();
    expect(mockedSignToken).not.toHaveBeenCalled();
  });

  it("converte uma violação de unicidade do banco em erro de e-mail duplicado", async () => {
    mockedFindByEmail.mockResolvedValue(null);
    mockedHash.mockResolvedValue("hashed-password");
    mockedCreateUser.mockRejectedValue(
      new PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "7.10.0",
      }),
    );

    await expect(registerUser(input)).rejects.toBeInstanceOf(
      EmailAlreadyExistsError,
    );

    expect(mockedSignToken).not.toHaveBeenCalled();
  });
});