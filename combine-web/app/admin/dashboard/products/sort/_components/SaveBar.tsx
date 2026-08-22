"use client";

type SaveBarProps = {
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
};

export default function SaveBar({
  saving,
  onSave,
  onCancel,
}: SaveBarProps) {
  return (
    <div
      className="
        fixed
        bottom-3
        left-3
        right-3
        z-50
        flex
        items-center
        gap-2
        rounded-2xl
        border
        border-neutral-200
        bg-white/95
        p-2
        shadow-[0_12px_40px_rgba(0,0,0,0.12)]
        backdrop-blur-md

        sm:bottom-6
        sm:left-1/2
        sm:right-auto
        sm:-translate-x-1/2
        sm:gap-3
        sm:rounded-2xl
        sm:px-6
        sm:py-4
      "
    >
      {/* ================================================== */}
      {/* CANCEL */}
      {/* ================================================== */}

      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        className="
          flex
          h-11
          min-w-0
          flex-1
          items-center
          justify-center
          rounded-xl
          border
          border-neutral-300
          px-4
          text-sm
          font-medium
          text-neutral-700
          transition
          hover:bg-neutral-100
          disabled:cursor-not-allowed
          disabled:opacity-50

          sm:h-auto
          sm:flex-none
          sm:px-5
          sm:py-2
        "
      >
        Cancel
      </button>

      {/* ================================================== */}
      {/* SAVE */}
      {/* ================================================== */}

      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="
          flex
          h-11
          min-w-0
          flex-1
          items-center
          justify-center
          rounded-xl
          bg-black
          px-4
          text-sm
          font-medium
          text-white
          transition
          hover:bg-neutral-800
          disabled:cursor-not-allowed
          disabled:opacity-50

          sm:h-auto
          sm:flex-none
          sm:px-5
          sm:py-2
        "
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}