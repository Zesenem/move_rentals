import FieldGroup from "../components/FieldGroup.jsx";
import StringListEditor from "../components/StringListEditor.jsx";
import { inputClassName, SOURCE_OPTIONS, STATUS_OPTIONS } from "../constants.js";

function AdvancedSettingsSection({
  draft,
  onDraftChange,
  onAddStringListItem,
  onStringListChange,
  onRemoveStringListItem,
}) {
  return (
    <details className="rounded-2xl border border-graphite/50 bg-phantom/20 p-5">
      <summary className="cursor-pointer list-none text-sm font-bold uppercase tracking-[0.18em] text-graphite">
        Definições avançadas
      </summary>
      <div className="mt-6 space-y-6">
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Altere estes campos apenas se souber porque são necessários. A maioria das alterações do
          dia a dia deve ser feita nas secções acima.
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup
            label="ID da Twice"
            hint="Deixe vazio apenas para veículos apenas do site. Liga este registo ao produto em direto da Twice."
          >
            <input
              className={inputClassName}
              value={draft.id}
              placeholder="ID do produto na Twice"
              onChange={onDraftChange("id")}
            />
          </FieldGroup>
          <FieldGroup
            label="Slug"
            hint="Usado no URL público da página de detalhe. Altere apenas se precisar de um link diferente."
          >
            <input
              className={inputClassName}
              value={draft.slug}
              placeholder="Exemplo: tesla-model-3"
              onChange={onDraftChange("slug")}
            />
          </FieldGroup>
          <FieldGroup
            label="Origem"
            hint="Escolha apenas do site se o veículo deve aparecer sem um registo em direto da Twice."
          >
            <select
              className={inputClassName}
              value={draft.source}
              onChange={onDraftChange("source")}
            >
              {SOURCE_OPTIONS.map((option) => (
                <option key={option.value || "empty-source"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FieldGroup>
          <FieldGroup label="Estado" hint="Estado opcional para o cartão e a página de detalhe.">
            <select
              className={inputClassName}
              value={draft.status}
              onChange={onDraftChange("status")}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value || "empty-status"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FieldGroup>
          <FieldGroup
            label="Etiqueta de disponibilidade"
            hint='Texto opcional para a etiqueta, por exemplo "Por pedido".'
          >
            <input
              className={inputClassName}
              value={draft.availabilityLabel}
              placeholder="Exemplo: Por pedido"
              onChange={onDraftChange("availabilityLabel")}
            />
          </FieldGroup>
        </div>

        <FieldGroup
          label="Nomes alternativos para correspondência"
          hint="Use apenas se o nome do produto na Twice for diferente do nome apresentado no site."
        >
          <StringListEditor
            items={draft.matchNames}
            placeholder="Nome alternativo do produto na Twice"
            addLabel="Adicionar nome alternativo"
            onAdd={() => onAddStringListItem("matchNames")}
            onChange={(index, value) => onStringListChange("matchNames", index, value)}
            onRemove={(index) => onRemoveStringListItem("matchNames", index)}
          />
        </FieldGroup>
      </div>
    </details>
  );
}

export default AdvancedSettingsSection;
