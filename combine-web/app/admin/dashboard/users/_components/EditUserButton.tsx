"use client";

import { useState } from "react";
import { User } from "@prisma/client";

import { updateUser } from "../_actions/user.actions";
import UserForm from "./UserForm";

type EditUserButtonProps = {
  user: User;
};

export default function EditUserButton({
  user,
}: EditUserButtonProps) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    await updateUser(formData);
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border px-3 py-1 text-sm transition hover:bg-neutral-100"
      >
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-light">
              Edit User
            </h2>

            <form
              action={handleSubmit}
              className="mt-6 space-y-4"
            >
              <input
                type="hidden"
                name="id"
                value={user.id}
              />

              <UserForm
                mode="edit"
                defaultValues={{
                  name: user.name,
                  email: user.email,
                  role: user.role,
                }}
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-black py-3 text-white"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full rounded-xl border py-3"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}