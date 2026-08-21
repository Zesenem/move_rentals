import { FaCheckCircle } from "react-icons/fa";
import FieldGroup from "../components/FieldGroup.jsx";
import ItemWithIconEditor from "../components/ItemWithIconEditor.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { EMPTY_LIST_ITEM, sectionCardClassName } from "../constants.js";

function RentalRulesSection({
  draft,
  onToggleDraftField,
  onAddObjectListItem,
  onObjectListChange,
  onRemoveObjectListItem,
}) {
  return (
    <div className={sectionCardClassName}>
      <SectionHeading
        icon={FaCheckCircle}
        title="Rental Rules"
        description="Only switch these sections on when a vehicle needs different rental inclusions or requirements from the default shared rules."
      />

      <FieldGroup
        label="Included In Rental"
        hint="Leave this off to use the default included list shared across the website."
      >
        <label className="mb-4 flex items-start gap-4 rounded-xl border border-graphite/60 bg-arsenic/70 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="break-words font-semibold text-cloud">
              Use vehicle-specific included items
            </p>
            <p className="text-sm text-space">
              Turn this off to use the shared included list from the main metadata file.
            </p>
          </div>
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 shrink-0 accent-cloud"
            checked={draft.hasIncludedOverride}
            onChange={onToggleDraftField("hasIncludedOverride")}
          />
        </label>

        {draft.hasIncludedOverride ? (
          <ItemWithIconEditor
            items={draft.included}
            addLabel="Add included item"
            emptyMessage="Add each item that is included specifically for this vehicle."
            placeholder="Example: 300 km included"
            onAdd={() => onAddObjectListItem("included", EMPTY_LIST_ITEM)}
            onChange={(index, key, value) => onObjectListChange("included", index, key, value)}
            onRemove={(index) => onRemoveObjectListItem("included", index)}
          />
        ) : (
          <p className="rounded-xl border border-dashed border-graphite/60 px-4 py-3 text-sm text-space">
            This vehicle will use the shared included list.
          </p>
        )}
      </FieldGroup>

      <div className="mt-8">
        <FieldGroup
          label="Requirements"
          hint="Leave this off to use the default driver requirements shared across the website."
        >
          <label className="mb-4 flex items-start gap-4 rounded-xl border border-graphite/60 bg-arsenic/70 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="break-words font-semibold text-cloud">
                Use vehicle-specific requirements
              </p>
              <p className="text-sm text-space">
                Turn this off to use the shared requirements list from the main metadata file.
              </p>
            </div>
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 shrink-0 accent-cloud"
              checked={draft.hasRequirementsOverride}
              onChange={onToggleDraftField("hasRequirementsOverride")}
            />
          </label>

          {draft.hasRequirementsOverride ? (
            <ItemWithIconEditor
              items={draft.requirements}
              addLabel="Add requirement"
              emptyMessage="Add only the special requirements that apply to this vehicle."
              placeholder="Example: Minimum age: 25 years"
              onAdd={() => onAddObjectListItem("requirements", EMPTY_LIST_ITEM)}
              onChange={(index, key, value) =>
                onObjectListChange("requirements", index, key, value)
              }
              onRemove={(index) => onRemoveObjectListItem("requirements", index)}
            />
          ) : (
            <p className="rounded-xl border border-dashed border-graphite/60 px-4 py-3 text-sm text-space">
              This vehicle will use the shared requirements list.
            </p>
          )}
        </FieldGroup>
      </div>
    </div>
  );
}

export default RentalRulesSection;
