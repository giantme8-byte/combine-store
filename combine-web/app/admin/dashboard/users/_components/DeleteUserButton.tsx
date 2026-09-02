"use client";

import {
  useState,
} from "react";

import {
  User,
  UserRole,
} from "@prisma/client";

import {
  deleteUser,
} from "../_actions/user.actions";


type DeleteUserButtonProps = {
  user: User;

  currentUserRole: UserRole;
};


export default function DeleteUserButton({
  user,
  currentUserRole,
}: DeleteUserButtonProps) {

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);


  // ==========================================================
  // DELETE
  // ==========================================================

  async function handleDelete() {

    if (
      loading
    ) {
      return;
    }


    try {

      setLoading(
        true
      );


      const formData =
        new FormData();

      formData.set(
        "id",
        String(user.id)
      );


      await deleteUser(
        formData
      );


      setOpen(
        false
      );


    } catch (
      error
    ) {

      console.error(
        "Delete user failed:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to delete user."
      );


    } finally {

      setLoading(
        false
      );

    }

  }


  // ==========================================================
  // PERMISSION
  // ==========================================================

  const canDelete =
    currentUserRole ===
      UserRole.OWNER ||
    (
      currentUserRole ===
        UserRole.ADMIN &&
      user.role !==
        UserRole.OWNER
    );


  if (
    !canDelete
  ) {

    return null;

  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>

      {/* ==================================================== */}
      {/* DELETE BUTTON */}
      {/* ==================================================== */}

      <button
        type="button"
        onClick={() =>
          setOpen(true)
        }
        className="
          rounded-lg
          border
          border-red-200
          px-3
          py-1
          text-sm
          text-red-600
          transition
          hover:bg-red-50
        "
      >
        Delete
      </button>


      {/* ==================================================== */}
      {/* CONFIRM MODAL */}
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
              Delete User
            </h2>


            {/* ============================================== */}
            {/* MESSAGE */}
            {/* ============================================== */}

            <p
              className="
                mt-4
                text-sm
                leading-6
                text-neutral-500
              "
            >
              Are you sure you want to delete{" "}
              <span
                className="
                  font-medium
                  text-neutral-900
                "
              >
                {user.name}
              </span>
              ?
            </p>


            <p
              className="
                mt-3
                text-xs
                leading-5
                text-neutral-400
              "
            >
              This action cannot be undone.
              Existing order history will be
              preserved.
            </p>


            {/* ============================================== */}
            {/* ACTIONS */}
            {/* ============================================== */}

            <div
              className="
                mt-8
                flex
                gap-3
              "
            >

              {/* ========================================== */}
              {/* CANCEL */}
              {/* ========================================== */}

              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  setOpen(false)
                }
                className="
                  flex-1
                  rounded-xl
                  border
                  border-neutral-200
                  py-3
                  text-sm
                  transition
                  hover:bg-neutral-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>


              {/* ========================================== */}
              {/* CONFIRM */}
              {/* ========================================== */}

              <button
                type="button"
                disabled={loading}
                onClick={
                  handleDelete
                }
                className="
                  flex-1
                  rounded-xl
                  bg-red-600
                  py-3
                  text-sm
                  text-white
                  transition
                  hover:bg-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading
                  ? "Deleting..."
                  : "Delete User"}
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}