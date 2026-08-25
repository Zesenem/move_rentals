import { FaInfoCircle } from "react-icons/fa";
import FieldGroup from "../components/FieldGroup.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import {
  inputClassName,
  LICENCE_CATEGORY_OPTIONS,
  sectionCardClassName,
  textareaClassName,
  VEHICLE_TYPE_OPTIONS,
} from "../constants.js";

function BasicDetailsSection({ draft, onDraftChange, onToggleDraftField, onLicenceCategoryToggle }) {
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

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <FieldGroup
          label="Tipo de veículo"
          hint="Permite aos clientes filtrar rapidamente a frota."
        >
          <select
            className={inputClassName}
            value={draft.vehicleType}
            onChange={onDraftChange("vehicleType")}
          >
            {VEHICLE_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FieldGroup>
        <FieldGroup
          label="Cilindrada (cc)"
          hint="Usada no filtro da frota. Use apenas o número, por exemplo 125 ou 1630."
        >
          <input
            className={inputClassName}
            inputMode="numeric"
            value={draft.displacementCc}
            placeholder="Exemplo: 125"
            onChange={onDraftChange("displacementCc")}
          />
        </FieldGroup>
        <FieldGroup
          label="Capacidade de bagagem (L)"
          hint="Mostrada no cartão com o ícone de mala. Use 0 quando não existir espaço de bagagem."
        >
          <input
            className={inputClassName}
            inputMode="decimal"
            value={draft.luggageCapacity}
            placeholder="Exemplo: 50"
            onChange={onDraftChange("luggageCapacity")}
          />
        </FieldGroup>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-bold text-steel">Carta necessária</legend>
        <p className="mt-1 text-sm text-space">Selecione todas as cartas que permitem conduzir este veículo.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {LICENCE_CATEGORY_OPTIONS.map((option) => {
            const isSelected = draft.licenceCategories.includes(option.value);

            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onLicenceCategoryToggle(option.value)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  isSelected
                    ? "border-cloud bg-cloud text-phantom"
                    : "border-graphite/60 bg-phantom text-steel hover:border-cloud hover:text-cloud"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6">
        <FieldGroup
          label="Aluguer diário"
          hint="Use para esclarecer a duração e condições associadas ao preço diário apresentado no site."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <input
              className={inputClassName}
              inputMode="numeric"
              value={draft.dailyRentalHours}
              placeholder="Duração em horas, ex.: 7"
              onChange={onDraftChange("dailyRentalHours")}
            />
            <input
              className={inputClassName}
              value={draft.dailyRentalTimeRange}
              placeholder="Horário, ex.: 10:00–17:00"
              onChange={onDraftChange("dailyRentalTimeRange")}
            />
          </div>
          <label className="mt-4 flex items-center gap-3 text-sm text-steel">
            <input
              type="checkbox"
              className="h-5 w-5 accent-cloud"
              checked={draft.dailyFuelNotIncluded}
              onChange={onToggleDraftField("dailyFuelNotIncluded")}
            />
            Combustível não incluído no aluguer diário
          </label>
        </FieldGroup>
      </div>

      <div className="mt-6">
        <FieldGroup
          label="Aluguer à hora"
          hint="Preencha apenas quando existir uma opção de aluguer à hora, como nos jet skis."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <input
              className={inputClassName}
              inputMode="numeric"
              value={draft.hourlyRentalMinimumHours}
              placeholder="Mínimo em horas, ex.: 3"
              onChange={onDraftChange("hourlyRentalMinimumHours")}
            />
            <input
              className={inputClassName}
              inputMode="decimal"
              value={draft.hourlyRentalPriceFrom}
              placeholder="Preço desde EUR, ex.: 120"
              onChange={onDraftChange("hourlyRentalPriceFrom")}
            />
            <input
              className={inputClassName}
              inputMode="decimal"
              value={draft.hourlyRentalPriceTo}
              placeholder="Preço até EUR, ex.: 180"
              onChange={onDraftChange("hourlyRentalPriceTo")}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm text-steel">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 accent-cloud"
                checked={draft.hourlyFuelIncluded}
                onChange={onToggleDraftField("hourlyFuelIncluded")}
              />
              Combustível incluído
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 accent-cloud"
                checked={draft.hourlyNoSecurityDeposit}
                onChange={onToggleDraftField("hourlyNoSecurityDeposit")}
              />
              Sem caução
            </label>
          </div>
          <input
            className={`${inputClassName} mt-4`}
            value={draft.hourlyAvailabilityNote}
            placeholder="Nota pública, ex.: Subject to availability and season."
            onChange={onDraftChange("hourlyAvailabilityNote")}
          />
        </FieldGroup>
      </div>
    </div>
  );
}

export default BasicDetailsSection;
