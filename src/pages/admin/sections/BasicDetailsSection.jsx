import { FaInfoCircle } from "react-icons/fa";
import FieldGroup from "../components/FieldGroup.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { inputClassName, sectionCardClassName, textareaClassName } from "../constants.js";

function BasicDetailsSection({ draft, onDraftChange, onToggleDraftField }) {
  return (
    <div className={sectionCardClassName}>
      <SectionHeading
        icon={FaInfoCircle}
        title="Informações principais"
        description="Estes são os dados públicos que os clientes veem primeiro no site."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FieldGroup label="Nome do veículo" hint="Título público apresentado no cartão e na página de detalhe.">
          <input
            className={inputClassName}
            value={draft.name}
            placeholder="Exemplo: Tesla Model 3"
            onChange={onDraftChange("name")}
          />
        </FieldGroup>
        <FieldGroup
          label="Caução"
          hint="Apresentada na página de detalhe. Use apenas o número, por exemplo 500."
        >
          <input
            className={inputClassName}
            value={draft.securityDeposit}
            placeholder="Exemplo: 500"
            onChange={onDraftChange("securityDeposit")}
          />
        </FieldGroup>
      </div>

      <div className="mt-6">
        <FieldGroup label="Descrição" hint="Pequeno texto público apresentado na página de detalhe.">
          <textarea
            className={textareaClassName}
            value={draft.description}
            placeholder="Escreva a pequena descrição que os clientes devem ler na página do veículo."
            onChange={onDraftChange("description")}
          />
        </FieldGroup>
      </div>

      <div className="mt-6">
        <FieldGroup
          label="Aluguer mínimo opcional"
          hint="Use apenas quando existir uma opção de curta duração, por exemplo 3 horas para jet skis."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <input
              className={inputClassName}
              inputMode="numeric"
              value={draft.minimumRentalHours}
              placeholder="Duração em horas, ex.: 3"
              onChange={onDraftChange("minimumRentalHours")}
            />
            <input
              className={inputClassName}
              inputMode="decimal"
              value={draft.minimumRentalPrice}
              placeholder="Preço em EUR, ex.: 300"
              onChange={onDraftChange("minimumRentalPrice")}
            />
          </div>
          <label className="mt-4 flex items-center gap-3 text-sm text-steel">
            <input
              type="checkbox"
              className="h-5 w-5 accent-cloud"
              checked={draft.fuelNotIncluded}
              onChange={onToggleDraftField("fuelNotIncluded")}
            />
            Combustível não incluído nestes preços
          </label>
        </FieldGroup>
      </div>
    </div>
  );
}

export default BasicDetailsSection;
