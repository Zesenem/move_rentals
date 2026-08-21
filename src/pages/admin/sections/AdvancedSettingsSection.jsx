import FieldGroup from "../components/FieldGroup.jsx";
import StringListEditor from "../components/StringListEditor.jsx";
import { inputClassName, SOURCE_OPTIONS, STATUS_OPTIONS } from "../constants.js";

function AdvancedSettingsSection({
  draft,
  onDraftChange,
  onAddStringListItem,
  onStringListChange,
  onRemoveStringListItem,
}) {
  return (
    <details className="rounded-2xl border border-graphite/50 bg-phantom/20 p-5">
      <summary className="cursor-pointer list-none text-sm font-bold uppercase tracking-[0.18em] text-graphite">
        Advanced Settings
      </summary>
      <div className="mt-6 space-y-6">
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Only change these fields if you understand why the website needs them. Most day-to-day
          edits should be done in the sections above.
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup
            label="Twice ID"
            hint="Leave blank only for static-only vehicles. This links the website entry to the live Twice product."
          >
            <input
              className={inputClassName}
              value={draft.id}
              placeholder="Live Twice product ID"
              onChange={onDraftChange("id")}
            />
          </FieldGroup>
          <FieldGroup
            label="Slug"
            hint="Used for the public detail page URL. Change this only if you need a different public link."
          >
            <input
              className={inputClassName}
              value={draft.slug}
              placeholder="Example: tesla-model-3"
              onChange={onDraftChange("slug")}
            />
          </FieldGroup>
          <FieldGroup
            label="Source"
            hint="Choose static only if the vehicle should appear without a live Twice record."
          >
            <select
              className={inputClassName}
              value={draft.source}
              onChange={onDraftChange("source")}
            >
              {SOURCE_OPTIONS.map((option) => (
                <option key={option.value || "empty-source"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FieldGroup>
          <FieldGroup label="Status" hint="Optional status override for the card and details page.">
            <select
              className={inputClassName}
              value={draft.status}
              onChange={onDraftChange("status")}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value || "empty-status"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FieldGroup>
          <FieldGroup
            label="Availability Label"
            hint='Optional custom badge text such as "On Demand".'
          >
            <input
              className={inputClassName}
              value={draft.availabilityLabel}
              placeholder="Example: On Demand"
              onChange={onDraftChange("availabilityLabel")}
            />
          </FieldGroup>
        </div>

        <FieldGroup
          label="Alternative Match Names"
          hint="Only use these if the live Twice product name is different from the name shown on the website."
        >
          <StringListEditor
            items={draft.matchNames}
            placeholder="Alternative live product name"
            addLabel="Add alternative name"
            onAdd={() => onAddStringListItem("matchNames")}
            onChange={(index, value) => onStringListChange("matchNames", index, value)}
            onRemove={(index) => onRemoveStringListItem("matchNames", index)}
          />
        </FieldGroup>
      </div>
    </details>
  );
}

export default AdvancedSettingsSection;
