import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { iconMap } from "../../../utils/iconMap.jsx";

function IconPicker({ value, options, onChange, ariaLabel = "Escolher ícone" }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value) || options[0];

  return (
    <div className="relative min-w-0">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex min-h-[52px] w-full items-center justify-between gap-3 rounded-xl border border-graphite/60 bg-phantom px-4 py-3 text-left text-sm text-steel outline-none transition-colors hover:border-cloud/50 focus:border-cloud sm:text-base"
      >
        <span className="flex min-w-0 items-center gap-3">
          {iconMap[selectedOption?.value]}
          <span className="truncate">{selectedOption?.label}</span>
        </span>
        <FaChevronDown
          className={`shrink-0 text-xs transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-30 mt-2 grid max-h-72 w-full grid-cols-1 gap-1 overflow-y-auto rounded-xl border border-graphite/60 bg-arsenic p-2 shadow-xl sm:grid-cols-2">
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  isSelected
                    ? "bg-cloud text-phantom"
                    : "text-steel hover:bg-phantom hover:text-cloud"
                }`}
              >
                {iconMap[option.value]}
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default IconPicker;
