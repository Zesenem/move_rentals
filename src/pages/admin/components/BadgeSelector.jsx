import { BADGE_OPTIONS } from "../constants.js";
import { FaAnchor } from "react-icons/fa";

function BadgeSelector({ value, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {BADGE_OPTIONS.map((badge) => {
        const isSelected = value.includes(badge.value);

        return (
          <button
            key={badge.value}
            type="button"
            onClick={() => onToggle(badge.value)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              isSelected
                ? "border-cloud bg-cloud text-center leading-snug text-phantom"
                : "border-graphite/60 bg-phantom text-center leading-snug text-steel hover:border-cloud/50 hover:text-cloud"
            }`}
          >
            {badge.value === "Anchor" && <FaAnchor aria-hidden="true" />}
            {badge.label}
          </button>
        );
      })}
    </div>
  );
}

export default BadgeSelector;
