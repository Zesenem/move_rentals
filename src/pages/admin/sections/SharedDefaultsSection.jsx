import { FaDatabase } from "react-icons/fa";
import FieldGroup from "../components/FieldGroup.jsx";
import ItemWithIconEditor from "../components/ItemWithIconEditor.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { EMPTY_LIST_ITEM, sectionCardClassName } from "../constants.js";

function SharedDefaultsSection({
  commonDataDraft,
  onAddCommonDataObjectListItem,
  onCommonDataObjectListChange,
  onRemoveCommonDataObjectListItem,
}) {
  return (
    <div className={sectionCardClassName}>
      <SectionHeading
        icon={FaDatabase}
        title="Shared Rental Defaults"
        description="These lists are used across the website whenever a vehicle does not have its own Included or Requirements rows."
      />

      <FieldGroup
        label="Default Included In Rental"
        hint="These items are reused on vehicles where the Included switch stays off."
      >
        <ItemWithIconEditor
          items={commonDataDraft.included}
          addLabel="Add shared included item"
          emptyMessage="Add the default included items that apply to most vehicles."
          placeholder="Example: Road assistance"
          onAdd={() => onAddCommonDataObjectListItem("included", EMPTY_LIST_ITEM)}
          onChange={(index, key, value) =>
            onCommonDataObjectListChange("included", index, key, value)
          }
          onRemove={(index) => onRemoveCommonDataObjectListItem("included", index)}
        />
      </FieldGroup>

      <div className="mt-8">
        <FieldGroup
          label="Default Requirements"
          hint="These requirements are reused on vehicles where the Requirements switch stays off."
        >
          <ItemWithIconEditor
            items={commonDataDraft.requirements}
            addLabel="Add shared requirement"
            emptyMessage="Add the default driver requirements that apply to most vehicles."
            placeholder="Example: Identity card or valid passport"
            onAdd={() => onAddCommonDataObjectListItem("requirements", EMPTY_LIST_ITEM)}
            onChange={(index, key, value) =>
              onCommonDataObjectListChange("requirements", index, key, value)
            }
            onRemove={(index) => onRemoveCommonDataObjectListItem("requirements", index)}
          />
        </FieldGroup>
      </div>
    </div>
  );
}

export default SharedDefaultsSection;
