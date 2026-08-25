import { FaTag } from "react-icons/fa";
import BadgeSelector from "../components/BadgeSelector.jsx";
import FieldGroup from "../components/FieldGroup.jsx";
import QuickGlanceEditor from "../components/QuickGlanceEditor.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { EMPTY_QUICK_GLANCE_ITEM, sectionCardClassName } from "../constants.js";

function FleetCardSection({
  draft,
  onBadgeToggle,
  onAddObjectListItem,
  onObjectListChange,
  onRemoveObjectListItem,
}) {
  return (
    <div className={sectionCardClassName}>
      <SectionHeading
        icon={FaTag}
        title="Cartão da frota"
        description="Estes campos controlam o cartão que os clientes veem antes de abrir a página do veículo."
      />

      <FieldGroup
        label="Destaques"
        hint="Etiquetas opcionais apresentadas no cartão. Use apenas as que devem ser vistas de imediato."
      >
        <BadgeSelector value={draft.badges} onToggle={onBadgeToggle} />
      </FieldGroup>

      <div className="mt-6">
        <FieldGroup
          label="Informações rápidas"
          hint="Mantenha até quatro factos curtos. Exemplo: 125 cc, 12 cv, categoria B, 7.1 L."
        >
          <QuickGlanceEditor
            items={draft.quickGlance}
            addLabel="Adicionar informação rápida"
            emptyMessage="Adicione até quatro informações curtas para o cartão do veículo."
            onAdd={() => onAddObjectListItem("quickGlance", EMPTY_QUICK_GLANCE_ITEM)}
            onChange={(index, key, value) => onObjectListChange("quickGlance", index, key, value)}
            onRemove={(index) => onRemoveObjectListItem("quickGlance", index)}
          />
        </FieldGroup>
      </div>
    </div>
  );
}

export default FleetCardSection;
