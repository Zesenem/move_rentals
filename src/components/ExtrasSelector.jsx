import { FaCheck } from "react-icons/fa";

function ExtrasSelector({ extras, selectedExtras, onExtrasChange }) {
  // This handler logic is clean and correct, no changes needed here.
  const handleCheckboxChange = (extraItem, isChecked) => {
    onExtrasChange((prev) => {
      const newExtras = { ...prev };
      if (isChecked) {
        newExtras[extraItem.id] = { ...extraItem, quantity: 1 };
      } else {
        delete newExtras[extraItem.id];
      }
      return newExtras;
    });
  };

  if (!extras || extras.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-cloud">Select Your Extras</h3>
      <div className="space-y-3">
        {extras.map((extra) => (
          <div key={extra.id}>
            <label
              htmlFor={extra.id}
              className={`
                flex cursor-pointer items-center justify-between rounded-lg border-2 bg-arsenic p-4 
                transition-all duration-200
                ${
                  selectedExtras[extra.id]
                    ? "border-emerald-500 ring-2 ring-emerald-500/30"
                    : "border-graphite/50 hover:border-graphite"
                }
              `}
            >
              <input
                type="checkbox"
                id={extra.id}
                checked={!!selectedExtras[extra.id]}
                onChange={(e) => handleCheckboxChange(extra, e.target.checked)}
                className="sr-only"
              />

              <div className="flex items-center gap-3">
                <div
                  className={`
                    grid h-6 w-6 flex-shrink-0 place-items-center rounded-md border-2 
                    transition-colors duration-200
                    ${
                      selectedExtras[extra.id]
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-graphite"
                    }
                  `}
                >
                  <FaCheck
                    className={`
                      text-xs text-white transition-opacity duration-200
                      ${selectedExtras[extra.id] ? "opacity-100" : "opacity-0"}
                    `}
                  />
                </div>
                <span className="font-semibold text-cloud">{extra.name}</span>
              </div>

              <span className="text-sm font-medium text-space">
                + €{extra.price_per_day.toFixed(2)} / day
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExtrasSelector;
