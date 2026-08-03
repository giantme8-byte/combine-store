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
}: SaveBarProps){
  return (
    <div
      className="
        fixed
        bottom-6
        left-1/2
        z-50
        flex
        -translate-x-1/2
        items-center
        gap-3
        rounded-2xl
        border
        border-neutral-200
        bg-white
        px-6
        py-4
        shadow-xl
      "
    >
      <button
        onClick={onCancel}
        className="
          rounded-xl
          border
          border-neutral-300
          px-5
          py-2
          transition
          hover:bg-neutral-100
        "
      >
        Cancel
      </button>

<button
  onClick={onSave}
  disabled={saving}
        className="
          rounded-xl
          bg-black
          px-5
          py-2
          text-white
          transition
          hover:bg-neutral-800
        "
      >
        {saving
  ? "Saving..."
  : "Save Changes"}
      </button>
    </div>
  );
}