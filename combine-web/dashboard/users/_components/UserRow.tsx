import {
  User,
  UserRole,
} from "@prisma/client";

import EditUserButton from "./EditUserButton";

type UserRowProps = {
  user: User;

  currentUserRole: UserRole;
};

export default function UserRow({
  user,
  currentUserRole,
}: UserRowProps) {

  // ==========================================================
  // EDIT PERMISSION
  // ==========================================================

  const canEdit =
    currentUserRole === UserRole.OWNER ||
    user.role !== UserRole.OWNER;


  // ==========================================================
  // ROLE LABEL
  // ==========================================================

  const roleLabel =
    user.role === UserRole.OWNER
      ? "Owner"
      : user.role === UserRole.ADMIN
      ? "Admin"
      : user.role === UserRole.MANAGER
      ? "Manager"
      : "Staff";


  // ==========================================================
  // ROLE STYLE
  // ==========================================================

  const roleClass =
    user.role === UserRole.OWNER
      ? "bg-black text-white"
      : user.role === UserRole.ADMIN
      ? "bg-blue-100 text-blue-700"
      : user.role === UserRole.MANAGER
      ? "bg-amber-100 text-amber-700"
      : "bg-neutral-100 text-neutral-700";


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <tr className="border-b">

      {/* ==================================================== */}
      {/* NAME */}
      {/* ==================================================== */}

      <td className="px-6 py-4">
        {user.name}
      </td>


      {/* ==================================================== */}
      {/* EMAIL */}
      {/* ==================================================== */}

      <td className="px-6 py-4">
        {user.email}
      </td>


      {/* ==================================================== */}
      {/* ROLE */}
      {/* ==================================================== */}

      <td className="px-6 py-4">

        <span
          className={`
            inline-flex
            rounded-full
            px-3
            py-1
            text-sm
            font-medium
            ${roleClass}
          `}
        >
          {roleLabel}
        </span>

      </td>


      {/* ==================================================== */}
      {/* CREATED */}
      {/* ==================================================== */}

      <td
        className="
          px-6
          py-4
          text-sm
          text-neutral-500
        "
      >
        {new Intl.DateTimeFormat(
          "en-MY",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          }
        ).format(user.createdAt)}
      </td>


      {/* ==================================================== */}
      {/* ACTIONS */}
      {/* ==================================================== */}

      <td className="px-6 py-4 text-right">

        {canEdit && (
          <EditUserButton
            user={user}
            currentUserRole={
              currentUserRole
            }
          />
        )}

      </td>

    </tr>
  );
}