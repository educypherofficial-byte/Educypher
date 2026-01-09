"use client";

export default function DeletePostModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="
        fixed inset-0 z-50
        bg-black/80 backdrop-blur-sm
        flex items-center justify-center
        px-4
      "
      onClick={onCancel} // click outside closes
    >
      <div
        className="
          w-full max-w-sm
          rounded-2xl
          border border-neutral-800
          bg-neutral-900/90
          backdrop-blur
          p-6
          space-y-5
          animate-cardPop
        "
        onClick={(e) => e.stopPropagation()} // prevent bubble
      >
        {/* HEADER */}
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-red-400">
            Delete post?
          </h2>
          <p className="text-sm text-gray-400">
            This action cannot be undone.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end items-center gap-4 pt-3">
          <button
            onClick={onCancel}
            className="
              text-sm text-gray-400
              hover:text-white transition
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="
              px-5 py-2 rounded-full
              bg-red-600 text-white
              text-sm font-semibold
              hover:bg-red-700
              transition
            "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
