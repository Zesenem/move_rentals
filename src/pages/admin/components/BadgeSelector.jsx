import { BADGE_OPTIONS } from "../constants.js";

function BadgeSelector({ value, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {BADGE_OPTIONS.map((badge) => {
        const isSelected = value.includes(badge);

        return (
          <button
            key={badge}
            type="button"
            onClick={() => onToggle(badge)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              isSelected
                ? "border-cloud bg-cloud text-center leading-snug text-phantom"
                : "border-graphite/60 bg-phantom text-center leading-snug text-steel hover:border-cloud/50 hover:text-cloud"
            }`}
          >
            {badge}
          </button>
        );
      })}
    </div>
  );
}

export default BadgeSelector;
