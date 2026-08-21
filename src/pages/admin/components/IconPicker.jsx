import { useState } from "react";
import { iconMap } from "../../../utils/iconMap.jsx";

function IconPicker({ value, options, onChange, ariaLabel = "Escolher ícone" }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value) || options[0];

  return (
    <div className="relative min-w-0">
      <button
        type="button"
        aria-label={`${ariaLabel}: ${selectedOption?.label || ""}`}
        title={selectedOption?.label}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-[52px] w-[52px] items-center justify-center rounded-xl border border-graphite/60 bg-phantom text-lg text-steel outline-none transition-colors hover:border-cloud/50 hover:text-cloud focus:border-cloud"
      >
        {iconMap[selectedOption?.value]}
      </button>

      {isOpen && (
        <div className="absolute left-0 z-30 mt-2 grid max-h-72 w-56 grid-cols-4 gap-2 overflow-y-auto rounded-xl border border-graphite/60 bg-arsenic p-2 shadow-xl">
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
                aria-label={option.label}
                title={option.label}
                className={`flex h-11 w-full items-center justify-center rounded-lg text-base transition-colors ${
                  isSelected
                    ? "bg-cloud text-phantom"
                    : "text-steel hover:bg-phantom hover:text-cloud"
                }`}
              >
                {iconMap[option.value]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default IconPicker;
