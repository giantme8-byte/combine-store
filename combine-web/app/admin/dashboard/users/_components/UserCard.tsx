import {
  User,
  UserRole,
} from "@prisma/client";

import EditUserButton from "./EditUserButton";
import DeleteUserButton from "./DeleteUserButton";


type UserCardProps = {
  user: User;

  currentUserRole: UserRole;
};


export default function UserCard({
  user,
  currentUserRole,
}: UserCardProps) {

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
      : user.role === UserRole.STAFF
      ? "Staff"
      : "Customer";


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
      : user.role === UserRole.STAFF
      ? "bg-neutral-100 text-neutral-700"
      : "bg-green-100 text-green-700";


  // ==========================================================
  // CREATED DATE
  // ==========================================================

  const createdDate =
    new Intl.DateTimeFormat(
      "en-MY",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    ).format(user.createdAt);


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className="
        p-4
        sm:p-5
      "
    >

      {/* ==================================================== */}
      {/* TOP */}
      {/* ==================================================== */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >

        {/* USER INFO */}

        <div
          className="
            min-w-0
            flex-1
          "
        >

          <p
            className="
              truncate
              text-sm
              font-semibold
              text-neutral-900
            "
          >
            {user.name}
          </p>

          <p
            className="
              mt-1
              break-all
              text-sm
              text-neutral-500
            "
          >
            {user.email}
          </p>

        </div>


        {/* ROLE */}

        <span
          className={`
            inline-flex
            shrink-0
            rounded-full
            px-3
            py-1
            text-xs
            font-medium
            ${roleClass}
          `}
        >
          {roleLabel}
        </span>

      </div>


      {/* ==================================================== */}
      {/* BOTTOM */}
      {/* ==================================================== */}

      <div
        className="
          mt-4
          flex
          items-end
          justify-between
          gap-4
          border-t
          pt-4
        "
      >

        {/* CREATED */}

        <div
          className="
            min-w-0
          "
        >

          <p
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.18em]
              text-neutral-400
            "
          >
            Created
          </p>

          <p
            className="
              mt-1
              text-sm
              text-neutral-600
            "
          >
            {createdDate}
          </p>

        </div>


        {/* ACTIONS */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-2
          "
        >

          {/* EDIT */}

          {canEdit && (
            <EditUserButton
              user={user}
              currentUserRole={
                currentUserRole
              }
            />
          )}


          {/* DELETE */}

          <DeleteUserButton
            user={user}
            currentUserRole={
              currentUserRole
            }
          />

        </div>

      </div>

    </div>
  );
}