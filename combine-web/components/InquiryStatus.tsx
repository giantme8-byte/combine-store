"use client";

import { useRouter } from "next/navigation";

type Props = {
  id: number;
  status: string;
};

const STATUS = [
  "Pending",
  "Replied",
  "Completed",
];

export default function InquiryStatus({
  id,
  status,
}: Props) {
  const router = useRouter();

  async function changeStatus() {
    const current = STATUS.indexOf(status);

    const next =
      STATUS[(current + 1) % STATUS.length];

    await fetch("/api/admin/inquiries/status", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        status: next,
      }),
    });

    router.refresh();
  }

  return (
    <button
      onClick={changeStatus}
      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
        status === "Pending"
          ? "bg-yellow-100 text-yellow-700"
          : status === "Replied"
          ? "bg-blue-100 text-blue-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      {status}
    </button>
  );
}