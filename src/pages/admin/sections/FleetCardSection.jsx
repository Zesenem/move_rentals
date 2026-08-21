import { FaTag } from "react-icons/fa";
import BadgeSelector from "../components/BadgeSelector.jsx";
import FieldGroup from "../components/FieldGroup.jsx";
import QuickGlanceEditor from "../components/QuickGlanceEditor.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { EMPTY_QUICK_GLANCE_ITEM, sectionCardClassName } from "../constants.js";

function FleetCardSection({
  draft,
  onBadgeToggle,
  onAddObjectListItem,
  onObjectListChange,
  onRemoveObjectListItem,
}) {
  return (
    <div className={sectionCardClassName}>
      <SectionHeading
        icon={FaTag}
        title="Fleet Card"
        description="These fields control the listing card that customers see before opening the vehicle page."
      />

      <FieldGroup
        label="Badges"
        hint="Optional labels shown on the card. Use only the ones you want customers to notice instantly."
      >
        <BadgeSelector value={draft.badges} onToggle={onBadgeToggle} />
      </FieldGroup>

      <div className="mt-6">
        <FieldGroup
          label="Quick Glance"
          hint="Keep this to three short facts. Example: 283 cv, Category B, 534 km WLTP."
        >
          <QuickGlanceEditor
            items={draft.quickGlance}
            addLabel="Add quick fact"
            emptyMessage="Add up to three short facts for the vehicle card."
            onAdd={() => onAddObjectListItem("quickGlance", EMPTY_QUICK_GLANCE_ITEM)}
            onChange={(index, key, value) => onObjectListChange("quickGlance", index, key, value)}
            onRemove={(index) => onRemoveObjectListItem("quickGlance", index)}
          />
        </FieldGroup>
      </div>
    </div>
  );
}

export default FleetCardSection;
