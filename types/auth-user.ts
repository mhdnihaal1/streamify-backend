// src/types/auth-user.ts
import { Role } from "@prisma/client"; // or your enum

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  orgId?: string;
}
