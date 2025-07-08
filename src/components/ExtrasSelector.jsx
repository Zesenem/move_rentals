import React from "react";

function ExtrasSelector({ extras, selectedExtras, onExtrasChange }) {
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
    <div className="border border-graphite/50 rounded-lg p-4">
      <h3 className="text-lg font-bold text-cloud mb-4">Select Your Extras</h3>
      <ul className="space-y-3">
        {extras.map((extra) => (
          <li key={extra.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <label htmlFor={extra.id} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id={extra.id}
                  checked={!!selectedExtras[extra.id]}
                  onChange={(e) => handleCheckboxChange(extra, e.target.checked)}
                  className="h-5 w-5 rounded bg-arsenic border-graphite text-emerald-500 focus:ring-emerald-500/50"
                />
                <span className="ml-3 flex items-center gap-2">
                  <span className="font-semibold text-cloud">{extra.name}</span>
                </span>
              </label>
            </div>
            <span className="text-space text-sm font-medium">
              €{extra.price_per_day.toFixed(2)} / day
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExtrasSelector;
