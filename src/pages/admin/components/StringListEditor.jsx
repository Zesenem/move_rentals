import { FaPlus, FaTrash } from "react-icons/fa";
import { inputClassName } from "../constants.js";
import InlineActionButton from "./InlineActionButton.jsx";

function StringListEditor({ items, placeholder, addLabel, onAdd, onChange, onRemove }) {
  return (
    <div className="space-y-3">
      {items.length > 0 ? (
        items.map((item, index) => (
          <div key={`text-item-${index}`} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_48px]">
            <input
              className={inputClassName}
              value={item}
              placeholder={placeholder}
              onChange={(event) => onChange(index, event.target.value)}
            />
            <InlineActionButton
              icon={FaTrash}
              label="Remove row"
              onClick={() => onRemove(index)}
              variant="remove"
            />
          </div>
        ))
      ) : (
        <p className="rounded-xl border border-dashed border-graphite/60 px-4 py-3 text-sm text-space">
          No rows added yet.
        </p>
      )}

      <InlineActionButton icon={FaPlus} label={addLabel} onClick={onAdd} />
    </div>
  );
}

export default StringListEditor;
