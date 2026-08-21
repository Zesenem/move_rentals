import { FaInfoCircle } from "react-icons/fa";
import FieldGroup from "../components/FieldGroup.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { inputClassName, sectionCardClassName, textareaClassName } from "../constants.js";

function BasicDetailsSection({ draft, onDraftChange }) {
  return (
    <div className={sectionCardClassName}>
      <SectionHeading
        icon={FaInfoCircle}
        title="Basic Details"
        description="These are the main public details customers read first on the site."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FieldGroup label="Vehicle Name" hint="Public title shown on the card and detail page.">
          <input
            className={inputClassName}
            value={draft.name}
            placeholder="Example: Tesla Model 3"
            onChange={onDraftChange("name")}
          />
        </FieldGroup>
        <FieldGroup
          label="Security Deposit"
          hint="Shown on the detail page. Use only the number if possible, for example 500."
        >
          <input
            className={inputClassName}
            value={draft.securityDeposit}
            placeholder="Example: 500"
            onChange={onDraftChange("securityDeposit")}
          />
        </FieldGroup>
      </div>

      <div className="mt-6">
        <FieldGroup label="Description" hint="Short public paragraph shown on the detail page.">
          <textarea
            className={textareaClassName}
            value={draft.description}
            placeholder="Write the short description customers should read on the vehicle page."
            onChange={onDraftChange("description")}
          />
        </FieldGroup>
      </div>
    </div>
  );
}

export default BasicDetailsSection;
