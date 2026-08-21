import { FaPlus, FaTrash } from "react-icons/fa";
import { inputClassName } from "../constants.js";
import InlineActionButton from "./InlineActionButton.jsx";

function FeatureEditor({
  items,
  onAdd,
  onChange,
  onRemove,
  addLabel = "Add specification",
  emptyMessage = "No specifications added yet.",
}) {
  return (
    <div className="space-y-3">
      <div className="hidden gap-3 px-1 text-xs font-bold uppercase tracking-[0.16em] text-graphite xl:grid xl:grid-cols-[minmax(180px,220px)_minmax(0,1fr)_50px]">
        <span>Label</span>
        <span>Value shown to customer</span>
        <span className="sr-only">Remove row</span>
      </div>
      {items.length > 0 ? (
        items.map((item, index) => (
          <div
            key={`feature-${index}`}
            className="grid gap-3 xl:grid-cols-[minmax(180px,220px)_minmax(0,1fr)_50px]"
          >
            <input
              className={inputClassName}
              value={item.label}
              placeholder="Label"
              onChange={(event) => onChange(index, "label", event.target.value)}
            />
            <input
              className={inputClassName}
              value={item.value}
              placeholder="Value"
              onChange={(event) => onChange(index, "value", event.target.value)}
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
          {emptyMessage}
        </p>
      )}

      <InlineActionButton icon={FaPlus} label={addLabel} onClick={onAdd} />
    </div>
  );
}

export default FeatureEditor;
