"use client";

import { useState } from "react";

import {
  User,
  UserRole,
} from "@prisma/client";

import { updateUser } from "../_actions/user.actions";
import UserForm from "./UserForm";

type EditUserButtonProps = {
  user: User;

  currentUserRole: UserRole;
};

export default function EditUserButton({
  user,
  currentUserRole,
}: EditUserButtonProps) {

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
    await updateUser(formData);

    setOpen(false);
  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>

      {/* ==================================================== */}
      {/* EDIT BUTTON */}
      {/* ==================================================== */}

      <button
        type="button"
        onClick={() =>
          setOpen(true)
        }
        className="
          rounded-lg
          border
          border-neutral-200
          px-3
          py-1
          text-sm
          transition
          hover:bg-neutral-100
        "
      >
        Edit
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

            <h2
              className="
                text-2xl
                font-light
              "
            >
              Edit User
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

              <input
                type="hidden"
                name="id"
                value={user.id}
              />


              <UserForm
                mode="edit"
                currentUserRole={
                  currentUserRole
                }
                defaultValues={{
                  name:
                    user.name,

                  email:
                    user.email,

                  role:
                    user.role,
                }}
              />


              {/* ========================================== */}
              {/* SAVE */}
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
                Save Changes
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