// lib/auth.ts
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function getCurrentUser() {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  const payload: any = verifyJwt(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  return user;
}
