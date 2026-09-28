import bcrypt from "bcryptjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { signToken } from "@/core/security";
import { authRepository } from "../repositories/auth.repository";
import {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  ForbiddenError,
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  getAdminProfile,
} from "./auth";

jest.mock("bcryptjs", () => ({
  __esModule: true,
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

jest.mock("@/core/security", () => ({
  signToken: jest.fn(),
}));

jest.mock("../repositories/auth.repository", () => ({
  authRepository: {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    findPasswordHashById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    softDeleteAndAnonymize: jest.fn(),
  },
}));

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedAuthRepo = authRepository as jest.Mocked<typeof authRepository>;
const mockedSignToken = signToken as jest.MockedFunction<typeof signToken>;

// UUIDs v4 válidos para o Zod
const VALID_USER_ID = "98c70071-3cdb-4fcf-b167-c7ff54644d49";
const ANOTHER_USER_ID = "123e4567-e89b-12d3-a456-426614174000";

describe("Custom Error Classes", () => {
  it("instancia os erros com nomes e mensagens esperadas", () => {
    const emailErr = new EmailAlreadyExistsError();
    expect(emailErr.name).toBe("EmailAlreadyExistsError");
    expect(emailErr.message).toBe("Este e-mail já foi cadastrado.");

    const credsErr = new InvalidCredentialsError();
    expect(credsErr.name).toBe("InvalidCredentialsError");
    expect(credsErr.message).toBe("E-mail ou senha inválidos.");

    const defaultForbidden = new ForbiddenError();
    expect(defaultForbidden.name).toBe("ForbiddenError");
    expect(defaultForbidden.message).toBe("Acesso restrito a administradores.");

    const customForbidden = new ForbiddenError("Acesso negado customizado");
    expect(customForbidden.message).toBe("Acesso negado customizado");
  });
});

describe("loginUser", () => {
  const loginInput = {
    email: "user@example.com",
    password: "Password123",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("efetua login com sucesso e retorna username e token", async () => {
    mockedAuthRepo.findByEmail.mockResolvedValue({
      id: VALID_USER_ID,
      email: loginInput.email,
      username: "user1",
      password: "hashedPassword",
      role: "student",
    } as never);

    mockedBcrypt.compare.mockResolvedValue(true as never);
    mockedSignToken.mockResolvedValue("jwt-token");

    const result = await loginUser(loginInput);

    expect(mockedAuthRepo.findByEmail).toHaveBeenCalledWith(loginInput.email);
    expect(mockedBcrypt.compare).toHaveBeenCalledWith(loginInput.password, "hashedPassword");
    expect(mockedSignToken).toHaveBeenCalledWith({ sub: VALID_USER_ID, role: "student" });
    expect(result).toEqual({ user: "user1", token: "jwt-token" });
  });

  it("lança InvalidCredentialsError se usuário não existir", async () => {
    mockedAuthRepo.findByEmail.mockResolvedValue(null);

    await expect(loginUser(loginInput)).rejects.toBeInstanceOf(InvalidCredentialsError);
    expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    expect(mockedSignToken).not.toHaveBeenCalled();
  });

  it("lança InvalidCredentialsError se senha estiver incorreta", async () => {
    mockedAuthRepo.findByEmail.mockResolvedValue({
      id: VALID_USER_ID,
      password: "hashedPassword",
    } as never);
    mockedBcrypt.compare.mockResolvedValue(false as never);

    await expect(loginUser(loginInput)).rejects.toBeInstanceOf(InvalidCredentialsError);
    expect(mockedSignToken).not.toHaveBeenCalled();
  });
});

describe("registerUser", () => {
  const registerInput = {
    username: "student",
    email: "student@example.com",
    password: "Senha@123",
    confirmPassword: "Senha@123",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("verifica duplicidade, criptografa a senha e cria o usuário", async () => {
    const createdUser = {
      id: VALID_USER_ID,
      email: registerInput.email,
      username: registerInput.username,
      password: "hashed-password",
      role: "student" as const,
    };

    mockedAuthRepo.findByEmail.mockResolvedValue(null);
    mockedBcrypt.hash.mockResolvedValue(createdUser.password as never);
    mockedAuthRepo.createUser.mockResolvedValue(createdUser as never);
    mockedSignToken.mockResolvedValue("signed-token");

    const result = await registerUser(registerInput);

    expect(mockedAuthRepo.findByEmail).toHaveBeenCalledWith(registerInput.email);
    expect(mockedBcrypt.hash).toHaveBeenCalledWith(registerInput.password, 10);
    expect(mockedAuthRepo.createUser).toHaveBeenCalledWith({
      email: registerInput.email,
      username: registerInput.username,
      password: createdUser.password,
    });
    expect(mockedSignToken).toHaveBeenCalledWith({
      sub: createdUser.id,
      role: createdUser.role,
    });
    expect(result).toEqual({ user: createdUser.username, token: "signed-token" });
  });

  it("recusa um e-mail já cadastrado antes de criptografar ou criar", async () => {
    mockedAuthRepo.findByEmail.mockResolvedValue({ email: registerInput.email } as never);

    await expect(registerUser(registerInput)).rejects.toBeInstanceOf(EmailAlreadyExistsError);

    expect(mockedBcrypt.hash).not.toHaveBeenCalled();
    expect(mockedAuthRepo.createUser).not.toHaveBeenCalled();
    expect(mockedSignToken).not.toHaveBeenCalled();
  });

  it("converte erro P2002 do Prisma em EmailAlreadyExistsError", async () => {
    mockedAuthRepo.findByEmail.mockResolvedValue(null);
    mockedBcrypt.hash.mockResolvedValue("hashed-password" as never);
    mockedAuthRepo.createUser.mockRejectedValue(
      new PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "7.10.0",
      })
    );

    await expect(registerUser(registerInput)).rejects.toBeInstanceOf(EmailAlreadyExistsError);
    expect(mockedSignToken).not.toHaveBeenCalled();
  });

  it("repassa qualquer outro erro desconhecido ocorrido na criação", async () => {
    mockedAuthRepo.findByEmail.mockResolvedValue(null);
    mockedBcrypt.hash.mockResolvedValue("hashed-password" as never);
    mockedAuthRepo.createUser.mockRejectedValue(new Error("Database connection dropped"));

    await expect(registerUser(registerInput)).rejects.toThrow("Database connection dropped");
  });
});

describe("getUserProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lança erro se o id não for informado", async () => {
    await expect(getUserProfile("")).rejects.toThrow("Identificador do usuário é obrigatório.");
  });

  it("lança erro se o usuário não for encontrado", async () => {
    mockedAuthRepo.findById.mockResolvedValue(null);

    await expect(getUserProfile(VALID_USER_ID)).rejects.toThrow("Usuário não encontrado.");
  });

  it("retorna o perfil parseado com sucesso", async () => {
    const mockUser = {
      id: VALID_USER_ID,
      email: "user@example.com",
      username: "user1",
      role: "student",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockedAuthRepo.findById.mockResolvedValue(mockUser as never);

    const result = await getUserProfile(VALID_USER_ID);

    expect(mockedAuthRepo.findById).toHaveBeenCalledWith(VALID_USER_ID);
    expect(result).toMatchObject({
      id: VALID_USER_ID,
      email: "user@example.com",
      username: "user1",
    });
  });
});

describe("updateUserProfile", () => {
  const currentUser = {
    id: VALID_USER_ID,
    email: "old@example.com",
    username: "oldname",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lança erro se o usuário não existir", async () => {
    mockedAuthRepo.findById.mockResolvedValue(null);

    await expect(
      updateUserProfile(VALID_USER_ID, { username: "new", email: "new@example.com" })
    ).rejects.toThrow("Utilizador não encontrado");
  });

  it("lança EmailAlreadyExistsError se novo e-mail já pertencer a outro usuário", async () => {
    mockedAuthRepo.findById.mockResolvedValue(currentUser as never);
    mockedAuthRepo.findByEmail.mockResolvedValue({ id: ANOTHER_USER_ID } as never);

    await expect(
      updateUserProfile(VALID_USER_ID, { username: "new", email: "new@example.com" })
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError);

    expect(mockedAuthRepo.updateUser).not.toHaveBeenCalled();
  });

  it("permite manter o mesmo e-mail sem verificar duplicidade externa", async () => {
    mockedAuthRepo.findById.mockResolvedValue(currentUser as never);
    mockedAuthRepo.updateUser.mockResolvedValue({ ...currentUser, username: "newname" } as never);

    const result = await updateUserProfile(VALID_USER_ID, {
      username: "newname",
      email: currentUser.email,
    });

    expect(mockedAuthRepo.findByEmail).not.toHaveBeenCalled();
    expect(mockedAuthRepo.updateUser).toHaveBeenCalledWith(VALID_USER_ID, {
      username: "newname",
      email: currentUser.email,
    });
    expect(result.username).toBe("newname");
  });

  it("permite atualizar e-mail se o e-mail encontrado no banco for do próprio usuário", async () => {
    mockedAuthRepo.findById.mockResolvedValue(currentUser as never);
    mockedAuthRepo.findByEmail.mockResolvedValue({ id: VALID_USER_ID } as never);
    mockedAuthRepo.updateUser.mockResolvedValue({ ...currentUser, email: "same@example.com" } as never);

    await updateUserProfile(VALID_USER_ID, {
      username: "oldname",
      email: "same@example.com",
    });

    expect(mockedAuthRepo.updateUser).toHaveBeenCalled();
  });

  it("atualiza com nova senha criptografada quando senha válida é fornecida", async () => {
    mockedAuthRepo.findById.mockResolvedValue(currentUser as never);
    mockedBcrypt.hash.mockResolvedValue("new-hashed-password" as never);
    mockedAuthRepo.updateUser.mockResolvedValue({} as never);

    await updateUserProfile(VALID_USER_ID, {
      username: "newname",
      email: currentUser.email,
      password: "newPassword123",
    });

    expect(mockedBcrypt.hash).toHaveBeenCalledWith("newPassword123", 10);
    expect(mockedAuthRepo.updateUser).toHaveBeenCalledWith(VALID_USER_ID, {
      username: "newname",
      email: currentUser.email,
      password: "new-hashed-password",
    });
  });

  it("ignora senha se for vazia ou contiver apenas espaços", async () => {
    mockedAuthRepo.findById.mockResolvedValue(currentUser as never);
    mockedAuthRepo.updateUser.mockResolvedValue({} as never);

    await updateUserProfile(VALID_USER_ID, {
      username: "newname",
      email: currentUser.email,
      password: "   ",
    });

    expect(mockedBcrypt.hash).not.toHaveBeenCalled();
    expect(mockedAuthRepo.updateUser).toHaveBeenCalledWith(VALID_USER_ID, {
      username: "newname",
      email: currentUser.email,
    });
  });

  it("captura erro P2002 na atualização e lança EmailAlreadyExistsError", async () => {
    mockedAuthRepo.findById.mockResolvedValue(currentUser as never);
    mockedAuthRepo.updateUser.mockRejectedValue(
      new PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "7.10.0",
      })
    );

    await expect(
      updateUserProfile(VALID_USER_ID, { username: "new", email: currentUser.email })
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError);
  });

  it("repassa outros erros ocorridos durante updateUser", async () => {
    mockedAuthRepo.findById.mockResolvedValue(currentUser as never);
    mockedAuthRepo.updateUser.mockRejectedValue(new Error("Unexpected DB failure"));

    await expect(
      updateUserProfile(VALID_USER_ID, { username: "new", email: currentUser.email })
    ).rejects.toThrow("Unexpected DB failure");
  });
});

describe("deleteUserAccount", () => {
  const deleteInput = { password: "UserPassword@123" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lança erro se o usuário não for encontrado", async () => {
    mockedAuthRepo.findPasswordHashById.mockResolvedValue(null);

    await expect(deleteUserAccount(VALID_USER_ID, deleteInput)).rejects.toThrow(
      "Usuário não encontrado."
    );
    expect(mockedAuthRepo.softDeleteAndAnonymize).not.toHaveBeenCalled();
  });

  it("lança InvalidCredentialsError se a senha estiver incorreta", async () => {
    mockedAuthRepo.findPasswordHashById.mockResolvedValue({ password: "hashedPassword" } as never);
    mockedBcrypt.compare.mockResolvedValue(false as never);

    await expect(deleteUserAccount(VALID_USER_ID, deleteInput)).rejects.toBeInstanceOf(
      InvalidCredentialsError
    );
    expect(mockedAuthRepo.softDeleteAndAnonymize).not.toHaveBeenCalled();
  });

  it("executa soft delete e anonimização com sucesso se a senha estiver correta", async () => {
    mockedAuthRepo.findPasswordHashById.mockResolvedValue({ password: "hashedPassword" } as never);
    mockedBcrypt.compare.mockResolvedValue(true as never);
    mockedAuthRepo.softDeleteAndAnonymize.mockResolvedValue(undefined as never);

    await deleteUserAccount(VALID_USER_ID, deleteInput);

    expect(mockedAuthRepo.findPasswordHashById).toHaveBeenCalledWith(VALID_USER_ID);
    expect(mockedBcrypt.compare).toHaveBeenCalledWith(deleteInput.password, "hashedPassword");
    expect(mockedAuthRepo.softDeleteAndAnonymize).toHaveBeenCalledWith(VALID_USER_ID);
  });
});

describe("getAdminProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lança erro se o userId estiver vazio", async () => {
    await expect(getAdminProfile("")).rejects.toThrow("Identificador do usuário é obrigatório.");
  });

  it("lança erro se o usuário não for encontrado", async () => {
    mockedAuthRepo.findById.mockResolvedValue(null);

    await expect(getAdminProfile(VALID_USER_ID)).rejects.toThrow("Usuário não encontrado.");
  });

  it("lança ForbiddenError se o perfil não tiver role 'admin'", async () => {
    mockedAuthRepo.findById.mockResolvedValue({
      id: VALID_USER_ID,
      role: "student",
    } as never);

    await expect(getAdminProfile(VALID_USER_ID)).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("retorna o perfil se o usuário tiver role 'admin'", async () => {
    const adminUser = {
      id: VALID_USER_ID,
      email: "admin@example.com",
      username: "adminUser",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockedAuthRepo.findById.mockResolvedValue(adminUser as never);

    const result = await getAdminProfile(VALID_USER_ID);

    expect(mockedAuthRepo.findById).toHaveBeenCalledWith(VALID_USER_ID);
    expect(result).toMatchObject({
      id: VALID_USER_ID,
      email: "admin@example.com",
      username: "adminUser",
      role: "admin",
    });
  });
});