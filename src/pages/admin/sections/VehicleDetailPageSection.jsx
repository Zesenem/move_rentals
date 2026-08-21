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
        title="Página de detalhe do veículo"
        description="Use esta secção para a informação mais detalhada que os clientes leem depois de abrir um veículo."
      />

      <FieldGroup
        label="Especificações"
        hint="Linhas de título e valor apresentadas na secção de especificações da página de detalhe."
      >
        <FeatureEditor
          items={draft.technicalFeatures}
          addLabel="Adicionar especificação"
          emptyMessage="Adicione linhas como Motor, Potência ou Tipo de combustível."
          onAdd={() => onAddObjectListItem("technicalFeatures", EMPTY_FEATURE_ITEM)}
          onChange={(index, key, value) =>
            onObjectListChange("technicalFeatures", index, key, value)
          }
          onRemove={(index) => onRemoveObjectListItem("technicalFeatures", index)}
        />
      </FieldGroup>

      <div className="mt-6">
        <FieldGroup
          label="Notas importantes"
          hint="Use para avisos, exceções ou notas de aprovação que os clientes devem ver."
        >
          <ItemWithIconEditor
            items={draft.importantNotes}
            addLabel="Adicionar nota importante"
            emptyMessage="Adicione notas curtas apenas quando o veículo precisa de avisos ou exceções."
            placeholder="Exemplo: Reserva sujeita a aprovação"
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
