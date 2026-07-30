import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { requireUser } from "./auth";


export async function requireRole(
  allowedRoles: UserRole[]
) {
  const user = await requireUser();


  if (
    !allowedRoles.includes(
      user.role
    )
  ) {
    redirect("/unauthorized");
  }


  return user;
}