import { BADGE_OPTIONS } from "../constants.js";
import {
  FaAnchor,
  FaBolt,
  FaGem,
  FaLeaf,
  FaMapMarkerAlt,
  FaStar,
  FaSuitcase,
} from "react-icons/fa";
import { GiCaptainHatProfile } from "react-icons/gi";

const badgeIconMap = {
  ECO: FaLeaf,
  Premium: FaGem,
  GPS: FaMapMarkerAlt,
  Electric: FaBolt,
  Anchor: FaAnchor,
  "Nautical Licence": GiCaptainHatProfile,
  "Luggage Space": FaSuitcase,
  "Best Seller": FaStar,
  "Best Value": FaStar,
};

function BadgeSelector({ value, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {BADGE_OPTIONS.map((badge) => {
        const isSelected = value.includes(badge.value);
        const Icon = badgeIconMap[badge.value];

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
            {Icon && <Icon aria-hidden="true" />}
            {badge.label}
          </button>
        );
      })}
    </div>
  );
}

export default BadgeSelector;
