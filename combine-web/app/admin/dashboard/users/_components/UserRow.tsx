import { User } from "@prisma/client";

import EditUserButton from "./EditUserButton";

type UserRowProps = {
  user: User;
};

export default function UserRow({
  user,
}: UserRowProps) {
  return (
    <tr className="border-b">
      <td className="px-6 py-4">
        {user.name}
      </td>

      <td className="px-6 py-4">
        {user.email}
      </td>

      <td className="px-6 py-4">
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm">
          {user.role}
        </span>
      </td>

      <td className="px-6 py-4 text-sm text-neutral-500">
        {user.createdAt.toLocaleDateString()}
      </td>

      <td className="px-6 py-4 text-right">
        <EditUserButton
          user={user}
        />
      </td>
    </tr>
  );
}