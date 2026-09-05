"use client";

import { UserRole } from "@prisma/client";

type UserFormProps = {
  mode: "create" | "edit";

  currentUserRole?: UserRole;

  defaultValues?: {
    name: string;
    email: string;
    role: UserRole;
  };
};

export default function UserForm({
  mode,
  currentUserRole,
  defaultValues,
}: UserFormProps) {

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>

      {/* ==================================================== */}
      {/* NAME */}
      {/* ==================================================== */}

      <div>

        <label
          htmlFor="name"
          className="
            mb-2
            block
            text-sm
            font-medium
          "
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
          defaultValue={
            defaultValues?.name
          }
          className="
            w-full
            rounded-xl
            border
            border-neutral-200
            px-4
            py-3
            outline-none
            transition
            focus:border-black
            focus:ring-1
            focus:ring-black
          "
        />

      </div>


      {/* ==================================================== */}
      {/* EMAIL */}
      {/* ==================================================== */}

      <div>

        <label
          htmlFor="email"
          className="
            mb-2
            block
            text-sm
            font-medium
          "
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
          defaultValue={
            defaultValues?.email
          }
          className="
            w-full
            rounded-xl
            border
            border-neutral-200
            px-4
            py-3
            outline-none
            transition
            focus:border-black
            focus:ring-1
            focus:ring-black
          "
        />

      </div>


      {/* ==================================================== */}
      {/* PASSWORD */}
      {/* ==================================================== */}

      {mode === "create" && (

        <div>

          <label
            htmlFor="password"
            className="
              mb-2
              block
              text-sm
              font-medium
            "
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
            className="
              w-full
              rounded-xl
              border
              border-neutral-200
              px-4
              py-3
              outline-none
              transition
              focus:border-black
              focus:ring-1
              focus:ring-black
            "
          />

        </div>

      )}


      {/* ==================================================== */}
      {/* ROLE */}
      {/* ==================================================== */}

      <div>

        <label
          htmlFor="role"
          className="
            mb-2
            block
            text-sm
            font-medium
          "
        >
          Role
        </label>


        <select
          id="role"
          name="role"
          defaultValue={
            defaultValues?.role ??
            UserRole.CUSTOMER
          }
          className="
            w-full
            rounded-xl
            border
            border-neutral-200
            px-4
            py-3
            outline-none
            transition
            focus:border-black
            focus:ring-1
            focus:ring-black
          "
        >

          {/* ================================================ */}
          {/* CUSTOMER */}
          {/* ================================================ */}

          <option
            value={UserRole.CUSTOMER}
          >
            Customer
          </option>


          {/* ================================================ */}
          {/* STAFF */}
          {/* ================================================ */}

          <option
            value={UserRole.STAFF}
          >
            Staff
          </option>


          {/* ================================================ */}
          {/* MANAGER */}
          {/* ================================================ */}

          <option
            value={UserRole.MANAGER}
          >
            Manager
          </option>


          {/* ================================================ */}
          {/* ADMIN */}
          {/* ================================================ */}

          <option
            value={UserRole.ADMIN}
          >
            Admin
          </option>

        </select>

      </div>

    </>
  );
}