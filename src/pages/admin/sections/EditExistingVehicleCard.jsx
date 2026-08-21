import { FaMotorcycle } from "react-icons/fa";
import FieldGroup from "../components/FieldGroup.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { inputClassName, sectionCardClassName } from "../constants.js";
import { getEntryKey } from "../metadataHelpers.js";

function EditExistingVehicleCard({
  metadataEntries,
  selectedEntryKey,
  onSelectEntry,
  isCreatingNew,
}) {
  return (
    <div className={sectionCardClassName}>
      <SectionHeading
        icon={FaMotorcycle}
        title="Edit Existing Vehicle"
        description="Open one of the saved website records and update its public content."
      />

      <FieldGroup
        label="Selected Vehicle"
        hint={
          isCreatingNew
            ? "Finish or cancel the new vehicle first if you want to switch back to an existing one."
            : "Choose which saved metadata record you want to edit."
        }
      >
        {metadataEntries.length > 0 ? (
          <select
            className={inputClassName}
            value={selectedEntryKey}
            onChange={(event) => onSelectEntry(event.target.value)}
            disabled={isCreatingNew}
          >
            {metadataEntries.map((entry, index) => {
              const key = getEntryKey(entry, index);

              return (
                <option key={key} value={key}>
                  {entry.name || "Unnamed entry"} ({entry.id || entry.slug || "no id"})
                </option>
              );
            })}
          </select>
        ) : (
          <p className="rounded-xl border border-dashed border-graphite/60 px-4 py-3 text-sm text-space">
            No saved metadata entries yet. Create the first vehicle on the right.
          </p>
        )}
      </FieldGroup>
    </div>
  );
}

export default EditExistingVehicleCard;
