import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { Role, type Role as RoleValue } from "@generated/prisma/client";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must contain at least 32 characters");
}

const secret = new TextEncoder().encode(jwtSecret);

export interface SessionPayload extends JWTPayload {
  sub: string;
  role: RoleValue;
}

export async function signToken(
  payload: Pick<SessionPayload, "sub" | "role">,
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);
}

export async function verifyToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, secret, {
      algorithms: ["HS256"],
    });

    const validRoles = Object.values(Role);
    
    if (typeof payload.sub !== "string" || !validRoles.includes(payload.role as Role)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}