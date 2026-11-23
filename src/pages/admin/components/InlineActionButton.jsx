import { addButtonClassName, removeButtonClassName } from "../constants.js";

function InlineActionButton({ icon, label, onClick, variant = "add", disabled = false }) {
  const className = variant === "remove" ? removeButtonClassName : addButtonClassName;
  const IconComponent = icon;

  return (
    <button
      type="button"
      className={`${className} disabled:cursor-not-allowed disabled:opacity-40`}
      onClick={onClick}
      title={label}
      aria-label={label}
      disabled={disabled}
    >
      <IconComponent className="text-sm" />
      {variant !== "remove" && <span className="min-w-0 break-words">{label}</span>}
    </button>
  );
}

export default InlineActionButton;
