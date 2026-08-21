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
        title="Regras de aluguer"
        description="Ative estas secções apenas quando um veículo precisa de inclusões ou requisitos diferentes das regras gerais."
      />

      <FieldGroup
        label="Incluído no aluguer"
        hint="Deixe desligado para usar a lista geral de itens incluídos no site."
      >
        <label className="mb-4 flex items-start gap-4 rounded-xl border border-graphite/60 bg-arsenic/70 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="break-words font-semibold text-cloud">
              Usar itens incluídos específicos deste veículo
            </p>
            <p className="text-sm text-space">
              Desligue para usar a lista geral de itens incluídos.
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
            addLabel="Adicionar item incluído"
            emptyMessage="Adicione cada item incluído especificamente neste veículo."
            placeholder="Exemplo: 300 km incluídos"
            onAdd={() => onAddObjectListItem("included", EMPTY_LIST_ITEM)}
            onChange={(index, key, value) => onObjectListChange("included", index, key, value)}
            onRemove={(index) => onRemoveObjectListItem("included", index)}
          />
        ) : (
          <p className="rounded-xl border border-dashed border-graphite/60 px-4 py-3 text-sm text-space">
            Este veículo usará a lista geral de itens incluídos.
          </p>
        )}
      </FieldGroup>

      <div className="mt-8">
        <FieldGroup
          label="Requisitos"
          hint="Deixe desligado para usar os requisitos gerais dos condutores."
        >
          <label className="mb-4 flex items-start gap-4 rounded-xl border border-graphite/60 bg-arsenic/70 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="break-words font-semibold text-cloud">
                Usar requisitos específicos deste veículo
              </p>
              <p className="text-sm text-space">
                Desligue para usar a lista geral de requisitos.
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
            addLabel="Adicionar requisito"
            emptyMessage="Adicione apenas os requisitos especiais aplicáveis a este veículo."
            placeholder="Exemplo: Idade mínima: 25 anos"
              onAdd={() => onAddObjectListItem("requirements", EMPTY_LIST_ITEM)}
              onChange={(index, key, value) =>
                onObjectListChange("requirements", index, key, value)
              }
              onRemove={(index) => onRemoveObjectListItem("requirements", index)}
            />
          ) : (
            <p className="rounded-xl border border-dashed border-graphite/60 px-4 py-3 text-sm text-space">
              Este veículo usará a lista geral de requisitos.
            </p>
          )}
        </FieldGroup>
      </div>
    </div>
  );
}

export default RentalRulesSection;
