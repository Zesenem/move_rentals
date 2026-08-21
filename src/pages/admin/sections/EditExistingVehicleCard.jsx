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
        title="Editar veículo existente"
        description="Abra um dos registos guardados no site e atualize o seu conteúdo público."
      />

      <FieldGroup
        label="Veículo selecionado"
        hint={
          isCreatingNew
            ? "Conclua ou cancele primeiro o novo veículo se quiser voltar a um existente."
            : "Escolha o registo guardado que pretende editar."
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
                  {entry.name || "Registo sem nome"} ({entry.id || entry.slug || "sem ID"})
                </option>
              );
            })}
          </select>
        ) : (
          <p className="rounded-xl border border-dashed border-graphite/60 px-4 py-3 text-sm text-space">
            Ainda não existem registos guardados. Crie o primeiro veículo à direita.
          </p>
        )}
      </FieldGroup>
    </div>
  );
}

export default EditExistingVehicleCard;
