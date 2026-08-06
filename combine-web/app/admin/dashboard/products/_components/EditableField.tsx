"use client";

import { useEffect, useState } from "react";

type EditableFieldProps = {
  value: string | number;
  onSave: (value: string) => Promise<void>;
  className?: string;
};

export default function EditableField({
  value,
  onSave,
  className = "",
}: EditableFieldProps) {
  const [editing, setEditing] =
    useState(false);

  const [currentValue, setCurrentValue] =
    useState(String(value));

  useEffect(() => {
    setCurrentValue(String(value));
  }, [value]);

  async function save() {
    setEditing(false);

    if (
      currentValue === String(value)
    ) {
      return;
    }

    await onSave(currentValue);
  }

  if (editing) {
    return (
      <input
        autoFocus
        value={currentValue}
        onChange={(e) =>
          setCurrentValue(e.target.value)
        }
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            save();
          }

          if (e.key === "Escape") {
            setCurrentValue(String(value));
            setEditing(false);
          }
        }}
        className={`
          w-full
          rounded-lg
          border
          border-neutral-300
          px-2
          py-1
          text-sm
          outline-none
          focus:border-black
          ${className}
        `}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={`
        text-left
        transition
        hover:text-black
        hover:underline
        ${className}
      `}
    >
      {currentValue}
    </button>
  );
}