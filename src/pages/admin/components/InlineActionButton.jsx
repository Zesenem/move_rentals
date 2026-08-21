import { addButtonClassName, removeButtonClassName } from "../constants.js";

function InlineActionButton({ icon, label, onClick, variant = "add" }) {
  const className = variant === "remove" ? removeButtonClassName : addButtonClassName;
  const IconComponent = icon;

  return (
    <button type="button" className={className} onClick={onClick} title={label} aria-label={label}>
      <IconComponent className="text-sm" />
      {variant !== "remove" && <span className="min-w-0 break-words">{label}</span>}
    </button>
  );
}

export default InlineActionButton;
