"use client";

import { useState } from "react";

import { createUser } from "../_actions/user.actions";
import UserForm from "./UserForm";

export default function CreateUserButton() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    await createUser(formData);
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
      >
        + Add User
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-light">
              Create User
            </h2>

            <form
              action={handleSubmit}
              className="mt-6 space-y-4"
            >
              <UserForm mode="create" />

              <button
                type="submit"
                className="w-full rounded-xl bg-black py-3 text-white transition hover:bg-neutral-800"
              >
                Create
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full rounded-xl border py-3 transition hover:bg-neutral-50"
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