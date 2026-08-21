import { FaPlus, FaTrash } from "react-icons/fa";
import { inputClassName, LIST_ICON_OPTIONS } from "../constants.js";
import InlineActionButton from "./InlineActionButton.jsx";

function ItemWithIconEditor({
  items,
  onAdd,
  onChange,
  onRemove,
  addLabel = "Add row",
  emptyMessage = "No rows added yet.",
  placeholder = "Item text",
}) {
  return (
    <div className="space-y-3">
      <div className="hidden gap-3 px-1 text-xs font-bold uppercase tracking-[0.16em] text-graphite xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(180px,220px)_50px]">
        <span>Text shown to customer</span>
        <span>Icon style</span>
        <span className="sr-only">Remove row</span>
      </div>
      {items.length > 0 ? (
        items.map((item, index) => (
          <div
            key={`icon-item-${index}`}
            className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(180px,220px)_50px]"
          >
            <input
              className={inputClassName}
              value={item.item}
              placeholder={placeholder}
              onChange={(event) => onChange(index, "item", event.target.value)}
            />
            <select
              className={inputClassName}
              value={item.icon}
              onChange={(event) => onChange(index, "icon", event.target.value)}
            >
              {LIST_ICON_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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

export default ItemWithIconEditor;
