import { FaPlus, FaTrash } from "react-icons/fa";
import { inputClassName, LIST_ICON_OPTIONS } from "../constants.js";
import InlineActionButton from "./InlineActionButton.jsx";
import IconPicker from "./IconPicker.jsx";

function ItemWithIconEditor({
  items,
  onAdd,
  onChange,
  onRemove,
  addLabel = "Adicionar linha",
  emptyMessage = "Ainda não foram adicionadas linhas.",
  placeholder = "Texto do item",
}) {
  return (
    <div className="space-y-3">
      <div className="hidden gap-3 px-1 text-xs font-bold uppercase tracking-[0.16em] text-graphite xl:grid xl:grid-cols-[minmax(0,1fr)_52px_50px]">
        <span>Texto apresentado ao cliente</span>
        <span>Ícone</span>
        <span className="sr-only">Remover linha</span>
      </div>
      {items.length > 0 ? (
        items.map((item, index) => (
          <div
            key={`icon-item-${index}`}
            className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_52px_50px]"
          >
            <input
              className={inputClassName}
              value={item.item}
              placeholder={placeholder}
              onChange={(event) => onChange(index, "item", event.target.value)}
            />
            <IconPicker
              value={item.icon}
              options={LIST_ICON_OPTIONS}
              onChange={(value) => onChange(index, "icon", value)}
              ariaLabel="Escolher ícone do item"
            />
            <InlineActionButton
              icon={FaTrash}
              label="Remover linha"
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
