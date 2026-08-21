import { FaSave, FaTrash } from "react-icons/fa";
import Button from "../../../components/Button.jsx";
import { adminButtonClassName } from "../constants.js";

function SaveActionBar({
  title,
  description,
  isSaving,
  isCreatingNew,
  canDelete,
  onSave,
  onReset,
  onDelete,
}) {
  return (
    <div className="rounded-2xl border border-graphite/50 bg-arsenic/95 p-5 shadow-lg backdrop-blur lg:sticky lg:top-24 lg:z-20">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <p className="break-words text-sm font-bold uppercase tracking-[0.18em] text-graphite">
            {title}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-space">{description}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:flex-wrap xl:justify-end">
          <Button
            onClick={onSave}
            icon={FaSave}
            className={`w-full ${adminButtonClassName}`}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : isCreatingNew ? "Create And Save" : "Save Changes"}
          </Button>
          <Button
            variant="ghost"
            onClick={onReset}
            className={`w-full ${adminButtonClassName}`}
            disabled={isSaving}
          >
            Reset
          </Button>
          {canDelete && (
            <Button
              variant="danger"
              icon={FaTrash}
              onClick={onDelete}
              className={`w-full sm:col-span-2 xl:col-auto ${adminButtonClassName}`}
              disabled={isSaving}
            >
              Delete Vehicle
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SaveActionBar;
