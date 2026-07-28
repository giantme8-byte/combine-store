"use client";

import { UserRole } from "@prisma/client";

type UserFormProps = {
  mode: "create" | "edit";
  defaultValues?: {
    name: string;
    email: string;
    role: UserRole;
  };
};

export default function UserForm({
  mode,
  defaultValues,
}: UserFormProps) {
  return (
    <>
      <input
        name="name"
        placeholder="Name"
        required
        defaultValue={defaultValues?.name}
        className="w-full rounded-xl border px-4 py-3"
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        defaultValue={defaultValues?.email}
        className="w-full rounded-xl border px-4 py-3"
      />

      {mode === "create" && (
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full rounded-xl border px-4 py-3"
        />
      )}

      <select
        name="role"
        defaultValue={defaultValues?.role ?? UserRole.STAFF}
        className="w-full rounded-xl border px-4 py-3"
      >
        <option value={UserRole.STAFF}>Staff</option>
        <option value={UserRole.MANAGER}>Manager</option>
        <option value={UserRole.ADMIN}>Admin</option>
        <option value={UserRole.OWNER}>Owner</option>
      </select>
    </>
  );
}