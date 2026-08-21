import { FaInfoCircle } from "react-icons/fa";
import FieldGroup from "../components/FieldGroup.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { inputClassName, sectionCardClassName, textareaClassName } from "../constants.js";

function BasicDetailsSection({ draft, onDraftChange }) {
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
    </div>
  );
}

export default BasicDetailsSection;
