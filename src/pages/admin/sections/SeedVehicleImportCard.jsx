import { FaFileImport } from "react-icons/fa";
import Button from "../../../components/Button.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { adminButtonClassName, sectionCardClassName } from "../constants.js";

function SeedVehicleImportCard({
  importPlans,
  isLoading,
  hasError,
  isSaving,
  onImport,
}) {
  if (isLoading || hasError || importPlans.length === 0) {
    return null;
  }

  return (
    <section className={sectionCardClassName}>
      <SectionHeading
        icon={FaFileImport}
        title="Completar importação de veículos preparados"
        description="Preenche os detalhes em falta nos veículos ligados à Twice e remove eventuais duplicados da importação anterior. Os campos já preenchidos não são substituídos."
        pills={[`${importPlans.length} por atualizar`]}
      />

      <p className="mb-5 text-sm text-steel">
        {importPlans.map((plan) => plan.seedVehicle.name).join(" · ")}
      </p>

      <Button
        onClick={onImport}
        disabled={isSaving}
        icon={FaFileImport}
        className={`w-full ${adminButtonClassName}`}
      >
        {isSaving ? "A concluir importação..." : "Concluir importação preparada"}
      </Button>
    </section>
  );
}

export default SeedVehicleImportCard;
