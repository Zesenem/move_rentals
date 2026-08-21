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
        title="Regras gerais de aluguer"
        description="Estas listas são usadas no site quando um veículo não tem itens incluídos ou requisitos próprios."
      />

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
