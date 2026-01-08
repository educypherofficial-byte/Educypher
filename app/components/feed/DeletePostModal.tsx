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
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
      onClick={onCancel} // click outside closes
    >
      <div
        className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl space-y-4 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()} // prevent bubble
      >
        <h2 className="text-red-400 font-semibold text-lg">
          Delete post?
        </h2>

        <p className="text-sm text-gray-400">
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="text-sm text-gray-300 hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="bg-red-600 px-4 py-2 rounded text-sm font-semibold hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
