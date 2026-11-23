import { useEffect, useId } from "react";
import { FaChevronLeft, FaFilter, FaTimes, FaUndo } from "react-icons/fa";

const formatEuro = (value) => `€${Math.round(value)}`;

const getRangeStep = (range, preferredStep) => {
  if (!range || range.max === range.min) {
    return 1;
  }

  return range.max - range.min <= preferredStep * 8 ? 1 : preferredStep;
};

function FilterChoiceGroup({ label, options, selections, onToggle, getOptionLabel = (option) => option.label }) {
  if (!options.length) {
    return null;
  }

  return (
    <fieldset>
      <legend className="text-xs font-bold uppercase tracking-[0.16em] text-space">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;
          const isSelected = selections.includes(value);

          return (
            <button
              key={value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(value)}
              className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
                isSelected
                  ? "border-cloud bg-cloud text-phantom"
                  : "border-graphite/70 bg-phantom/50 text-steel hover:border-steel hover:text-cloud"
              }`}
            >
              {getOptionLabel(option)}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function RangeControl({ label, range, value, unit, onChange }) {
  const rangeId = useId();

  if (!range || range.min === range.max) {
    return null;
  }

  const step = getRangeStep(range, unit === "€" ? 5 : 25);
  const displayValue = (number) => (unit === "€" ? formatEuro(number) : `${Math.round(number)} cc`);

  return (
    <fieldset>
      <legend className="text-xs font-bold uppercase tracking-[0.16em] text-space">{label}</legend>
      <p className="mt-2 text-sm font-semibold text-cloud">
        {displayValue(value.min)} – {displayValue(value.max)}
      </p>
      <div className="mt-3 grid gap-2">
        <label className="sr-only" htmlFor={`${rangeId}-minimum`}>
          Minimum {label.toLowerCase()}
        </label>
        <input
          id={`${rangeId}-minimum`}
          type="range"
          min={range.min}
          max={range.max}
          step={step}
          value={value.min}
          onChange={(event) => onChange("min", Number(event.target.value))}
          className="h-2 w-full cursor-pointer accent-cloud"
        />
        <label className="sr-only" htmlFor={`${rangeId}-maximum`}>
          Maximum {label.toLowerCase()}
        </label>
        <input
          id={`${rangeId}-maximum`}
          type="range"
          min={range.min}
          max={range.max}
          step={step}
          value={value.max}
          onChange={(event) => onChange("max", Number(event.target.value))}
          className="h-2 w-full cursor-pointer accent-cloud"
        />
      </div>
      <div className="mt-1 flex justify-between text-xs text-space">
        <span>{displayValue(range.min)}</span>
        <span>{displayValue(range.max)}</span>
      </div>
    </fieldset>
  );
}

function FilterControls({ options, filters, onToggle, onRangeChange, onClear, resultCount, onClose }) {
  const priceValue = filters.priceRange || options.priceRange;
  const displacementValue = filters.displacementRange || options.displacementRange;

  return (
    <div className="flex max-h-[calc(100vh-8rem)] flex-col">
      <div className="flex items-start justify-between gap-4 border-b border-graphite/40 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-cloud">Filter fleet</h3>
          <p className="mt-1 text-sm text-space">
            {resultCount} {resultCount === 1 ? "vehicle" : "vehicles"} found
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-graphite/60 px-3 py-2 text-sm font-bold text-steel transition-colors hover:border-cloud hover:text-cloud"
            aria-label="Close filters"
          >
            <span>Close</span>
            <FaTimes />
          </button>
        )}
      </div>

      <div className="mt-5 min-h-0 space-y-6 overflow-y-auto pr-1">
        <FilterChoiceGroup
          label="Vehicle type"
          options={options.types}
          selections={filters.types}
          onToggle={(value) => onToggle("types", value)}
        />
        <RangeControl
          label="Daily price"
          range={options.priceRange}
          value={priceValue}
          unit="€"
          onChange={(bound, value) => onRangeChange("priceRange", bound, value)}
        />
        <FilterChoiceGroup
          label="Licence"
          options={options.licences}
          selections={filters.licences}
          onToggle={(value) => onToggle("licences", value)}
        />
        <RangeControl
          label="Engine size"
          range={options.displacementRange}
          value={displacementValue}
          unit="cc"
          onChange={(bound, value) => onRangeChange("displacementRange", bound, value)}
        />
        <FilterChoiceGroup
          label="Badges"
          options={options.badges}
          selections={filters.badges}
          onToggle={(value) => onToggle("badges", value)}
          getOptionLabel={(badge) => (badge === "Anchor" ? "Summer season" : badge)}
        />
      </div>

      <div className={onClose ? "mt-5 grid grid-cols-2 gap-3" : "mt-5"}>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-graphite/60 px-4 py-2 text-sm font-bold text-steel transition-colors hover:border-cloud hover:text-cloud"
        >
          <FaUndo className="text-xs" />
          Clear filters
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-cloud px-4 py-2 text-sm font-extrabold text-phantom transition-colors hover:bg-cloud/90"
          >
            Show {resultCount} {resultCount === 1 ? "vehicle" : "vehicles"}
          </button>
        )}
      </div>
    </div>
  );
}

function FleetFilters({
  isDesktopVisible,
  isDesktopOpen,
  onDesktopToggle,
  isMobileOpen,
  onMobileOpen,
  onMobileClose,
  activeFilterCount,
  ...filterProps
}) {
  useEffect(() => {
    if (!isMobileOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onMobileClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileOpen, onMobileClose]);

  return (
    <>
      <div
        className={`fixed top-1/2 left-0 z-40 hidden -translate-y-1/2 transition-[transform,opacity] duration-300 ease-out lg:block ${
          isDesktopVisible
            ? "translate-x-0 opacity-100"
            : "pointer-events-none -translate-x-full opacity-0"
        }`}
        aria-hidden={!isDesktopVisible}
        inert={!isDesktopVisible}
      >
        <div
          className={`relative w-[22.5rem] transition-transform duration-300 ease-out ${
            isDesktopOpen ? "translate-x-0" : "-translate-x-[calc(100%-3.5rem)]"
          }`}
        >
          <aside className="mr-14 rounded-r-2xl border border-graphite/60 bg-arsenic/95 p-5 shadow-2xl shadow-phantom/60 backdrop-blur">
            <FilterControls {...filterProps} />
          </aside>
          <button
            type="button"
            onClick={onDesktopToggle}
            className="absolute top-1/2 right-0 flex h-28 w-14 -translate-y-1/2 flex-col items-center justify-center gap-2 rounded-r-2xl border border-l-0 border-graphite/60 bg-arsenic text-cloud shadow-xl transition-colors hover:bg-phantom"
            aria-label={isDesktopOpen ? "Collapse fleet filters" : "Open fleet filters"}
            aria-expanded={isDesktopOpen}
          >
            {isDesktopOpen ? <FaChevronLeft /> : <FaFilter />}
            <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] [writing-mode:vertical-rl]">
              Filters
            </span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cloud px-1 text-[10px] font-extrabold text-phantom">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="mt-6 lg:hidden">
        <button
          type="button"
          onClick={onMobileOpen}
          className="inline-flex min-h-12 items-center gap-2 rounded-full border border-cloud/50 bg-arsenic px-5 py-2.5 text-sm font-extrabold text-cloud shadow-lg shadow-phantom/30 transition-colors hover:border-cloud"
        >
          <FaFilter />
          Find your ride
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-cloud px-2 py-0.5 text-xs text-phantom">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-brand-black/70 lg:hidden" role="dialog" aria-modal="true" aria-label="Fleet filters">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close filters"
            onClick={onMobileClose}
          />
          <aside className="relative max-h-[78dvh] w-full rounded-t-3xl border border-b-0 border-graphite/60 bg-arsenic p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-steel/50" aria-hidden="true" />
            <FilterControls {...filterProps} onClose={onMobileClose} />
          </aside>
        </div>
      )}
    </>
  );
}

export default FleetFilters;
