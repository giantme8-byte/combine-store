"use client";

import { useState } from "react";

import { UserRole } from "@prisma/client";

import { createUser } from "../_actions/user.actions";
import UserForm from "./UserForm";

type CreateUserButtonProps = {
  currentUserRole: UserRole;
};

export default function CreateUserButton({
  currentUserRole,
}: CreateUserButtonProps) {

  const [
    open,
    setOpen,
  ] = useState(false);


  // ==========================================================
  // SUBMIT
  // ==========================================================

  async function handleSubmit(
    formData: FormData
  ) {
    await createUser(formData);

    setOpen(false);
  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>

      {/* ==================================================== */}
      {/* ADD USER */}
      {/* ==================================================== */}

      <button
        type="button"
        onClick={() =>
          setOpen(true)
        }
        className="
          rounded-xl
          bg-black
          px-5
          py-3
          text-sm
          font-medium
          text-white
          transition
          hover:bg-neutral-800
        "
      >
        + Add User
      </button>


      {/* ==================================================== */}
      {/* MODAL */}
      {/* ==================================================== */}

      {open && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            px-4

            sm:px-6
          "
        >

          <div
            className="
              w-full
              max-w-md
              rounded-3xl
              bg-white
              p-6
              shadow-xl

              sm:p-8
            "
          >

            {/* ============================================== */}
            {/* TITLE */}
            {/* ============================================== */}

            <h2 className="text-2xl font-light">
              Create User
            </h2>


            {/* ============================================== */}
            {/* FORM */}
            {/* ============================================== */}

            <form
              action={handleSubmit}
              className="
                mt-6
                space-y-4
              "
            >

              <UserForm
                mode="create"
                currentUserRole={
                  currentUserRole
                }
              />


              {/* ========================================== */}
              {/* CREATE */}
              {/* ========================================== */}

              <button
                type="submit"
                className="
                  w-full
                  rounded-xl
                  bg-black
                  py-3
                  text-white
                  transition
                  hover:bg-neutral-800
                "
              >
                Create
              </button>


              {/* ========================================== */}
              {/* CANCEL */}
              {/* ========================================== */}

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-neutral-200
                  py-3
                  transition
                  hover:bg-neutral-50
                "
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