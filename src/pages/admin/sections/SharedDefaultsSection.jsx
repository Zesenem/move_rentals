import { FaDatabase } from "react-icons/fa";
import FieldGroup from "../components/FieldGroup.jsx";
import ItemWithIconEditor from "../components/ItemWithIconEditor.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { EMPTY_LIST_ITEM, inputClassName, sectionCardClassName } from "../constants.js";

function SharedDefaultsSection({
  commonDataDraft,
  onAddCommonDataObjectListItem,
  onCommonDataObjectListChange,
  onRemoveCommonDataObjectListItem,
  onCommonDataFieldChange,
  onAddWeeklyKilometres,
}) {
  return (
    <div className={sectionCardClassName}>
      <SectionHeading
        icon={FaDatabase}
        title="Regras gerais de aluguer"
        description="Estas listas são usadas no site quando um veículo não tem itens incluídos ou requisitos próprios."
      />

      <FieldGroup
        label="Quilómetros percorridos"
        hint="O site parte do total verificado e adiciona uma estimativa gradual. No fim de cada semana, introduza os quilómetros reais para corrigir o total e reiniciar a estimativa."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-steel">Total real acumulado</span>
            <input
              type="number"
              min="0"
              step="1"
              value={commonDataDraft.kilometresDriven}
              onChange={onCommonDataFieldChange("kilometresDriven")}
              className={inputClassName}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-steel">Estimativa semanal</span>
            <input
              type="number"
              min="0"
              step="1"
              value={commonDataDraft.weeklyEstimate}
              onChange={onCommonDataFieldChange("weeklyEstimate")}
              className={inputClassName}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-steel">Quilómetros reais da semana</span>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                step="1"
                value={commonDataDraft.weeklyKilometres}
                onChange={onCommonDataFieldChange("weeklyKilometres")}
                placeholder="Ex.: 850"
                className={inputClassName}
              />
              <button
                type="button"
                onClick={onAddWeeklyKilometres}
                className="shrink-0 rounded-xl bg-cloud px-4 text-sm font-extrabold text-phantom transition-colors hover:bg-cloud/90"
              >
                Corrigir
              </button>
            </div>
          </label>
        </div>
      </FieldGroup>

      <div className="my-8 h-px bg-graphite/40" />

      <FieldGroup
        label="Itens gerais incluídos no aluguer"
        hint="Estes itens são usados nos veículos onde a opção de itens específicos está desligada."
      >
        <ItemWithIconEditor
          items={commonDataDraft.included}
          addLabel="Adicionar item geral incluído"
          emptyMessage="Adicione os itens incluídos que se aplicam à maioria dos veículos."
          placeholder="Exemplo: Assistência em viagem"
          onAdd={() => onAddCommonDataObjectListItem("included", EMPTY_LIST_ITEM)}
          onChange={(index, key, value) =>
            onCommonDataObjectListChange("included", index, key, value)
          }
          onRemove={(index) => onRemoveCommonDataObjectListItem("included", index)}
        />
      </FieldGroup>

      <div className="mt-8">
        <FieldGroup
          label="Requisitos gerais"
          hint="Estes requisitos são usados nos veículos onde os requisitos específicos estão desligados."
        >
          <ItemWithIconEditor
            items={commonDataDraft.requirements}
            addLabel="Adicionar requisito geral"
            emptyMessage="Adicione os requisitos do condutor que se aplicam à maioria dos veículos."
            placeholder="Exemplo: Documento de identificação ou passaporte válido"
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
