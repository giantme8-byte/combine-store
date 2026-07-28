"use client";

import { ReactNode } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  children?: ReactNode;
  onCancel: () => void;
  onConfirm?: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  children,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="text-2xl font-semibold text-neutral-900">
          {title}
        </h2>

        <div className="mt-4 text-sm leading-7 text-neutral-600">
          {description}
        </div>

        {children ? (
          children
        ) : (
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-medium transition hover:bg-neutral-100"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Deleting..." : confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}