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
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium"
        >
          Name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          placeholder="Name"
          required
          autoComplete="name"
          defaultValue={defaultValues?.name}
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium"
        >
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          required
          autoComplete="email"
          defaultValue={defaultValues?.email}
          className="w-full rounded-xl border px-4 py-3"
        />
      </div>

      {mode === "create" && (
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium"
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            required
            autoComplete="new-password"
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>
      )}

      <div>
        <label
          htmlFor="role"
          className="mb-2 block text-sm font-medium"
        >
          Role
        </label>

        <select
          id="role"
          name="role"
          defaultValue={
            defaultValues?.role ?? UserRole.STAFF
          }
          className="w-full rounded-xl border px-4 py-3"
        >
          <option value={UserRole.STAFF}>
            Staff
          </option>

          <option value={UserRole.MANAGER}>
            Manager
          </option>

          <option value={UserRole.ADMIN}>
            Admin
          </option>

          <option value={UserRole.OWNER}>
            Owner
          </option>
        </select>
      </div>
    </>
  );
}