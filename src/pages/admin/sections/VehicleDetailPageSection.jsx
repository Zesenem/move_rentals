import { FaListUl } from "react-icons/fa";
import FeatureEditor from "../components/FeatureEditor.jsx";
import FieldGroup from "../components/FieldGroup.jsx";
import ItemWithIconEditor from "../components/ItemWithIconEditor.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { EMPTY_FEATURE_ITEM, EMPTY_LIST_ITEM, sectionCardClassName } from "../constants.js";

function VehicleDetailPageSection({
  draft,
  onAddObjectListItem,
  onObjectListChange,
  onRemoveObjectListItem,
}) {
  return (
    <div className={sectionCardClassName}>
      <SectionHeading
        icon={FaListUl}
        title="Vehicle Detail Page"
        description="Use this section for the longer information customers read after opening a vehicle."
      />

      <FieldGroup
        label="Specifications"
        hint="Label and value rows shown in the Specifications section of the detail page."
      >
        <FeatureEditor
          items={draft.technicalFeatures}
          addLabel="Add specification"
          emptyMessage="Add label and value rows such as Engine, Power, or Fuel Type."
          onAdd={() => onAddObjectListItem("technicalFeatures", EMPTY_FEATURE_ITEM)}
          onChange={(index, key, value) =>
            onObjectListChange("technicalFeatures", index, key, value)
          }
          onRemove={(index) => onRemoveObjectListItem("technicalFeatures", index)}
        />
      </FieldGroup>

      <div className="mt-6">
        <FieldGroup
          label="Important Notes"
          hint="Use this for warnings, exceptions, or approval notes that customers must notice."
        >
          <ItemWithIconEditor
            items={draft.importantNotes}
            addLabel="Add important note"
            emptyMessage="Add short notes only when the vehicle needs extra warnings or exceptions."
            placeholder="Example: Reservation subject to approval"
            onAdd={() => onAddObjectListItem("importantNotes", EMPTY_LIST_ITEM)}
            onChange={(index, key, value) =>
              onObjectListChange("importantNotes", index, key, value)
            }
            onRemove={(index) => onRemoveObjectListItem("importantNotes", index)}
          />
        </FieldGroup>
      </div>
    </div>
  );
}

export default VehicleDetailPageSection;
