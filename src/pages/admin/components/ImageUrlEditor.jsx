import { FaArrowDown, FaArrowUp, FaPlus, FaTrash } from "react-icons/fa";
import { inputClassName } from "../constants.js";
import InlineActionButton from "./InlineActionButton.jsx";

function ImageUrlEditor({ items, onAdd, onChange, onRemove, onMove }) {
  return (
    <div className="space-y-3">
      {items.length ? (
        items.map((url, index) => (
          <div
            key={`image-${index}`}
            className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_48px_48px_48px]"
          >
            <input
              type="url"
              className={inputClassName}
              value={url}
              placeholder="https://images.example.com/vehicle.jpg"
              aria-label={`Vehicle image URL ${index + 1}`}
              onChange={(event) => onChange(index, event.target.value)}
            />
            <InlineActionButton
              icon={FaArrowUp}
              label="Mover imagem para cima"
              onClick={() => onMove(index, -1)}
              disabled={index === 0}
            />
            <InlineActionButton
              icon={FaArrowDown}
              label="Mover imagem para baixo"
              onClick={() => onMove(index, 1)}
              disabled={index === items.length - 1}
            />
            <InlineActionButton
              icon={FaTrash}
              label="Remover imagem"
              onClick={() => onRemove(index)}
              variant="remove"
            />
          </div>
        ))
      ) : (
        <p className="rounded-xl border border-dashed border-graphite/60 px-4 py-3 text-sm text-space">
          Sem substituição de imagens. O site usará as imagens atuais da Twice.
        </p>
      )}
      <InlineActionButton icon={FaPlus} label="Adicionar imagem HTTPS" onClick={onAdd} />
    </div>
  );
}

export default ImageUrlEditor;
