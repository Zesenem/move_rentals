import { FaFileImport } from "react-icons/fa";
import Button from "../../../components/Button.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { adminButtonClassName, sectionCardClassName } from "../constants.js";

function SeedVehicleImportCard({
  pendingVehicles,
  isLoading,
  hasError,
  isSaving,
  onImport,
}) {
  if (isLoading || hasError || pendingVehicles.length === 0) {
    return null;
  }

  return (
    <section className={sectionCardClassName}>
      <SectionHeading
        icon={FaFileImport}
        title="Importar novos veículos preparados"
        description="Esta importação única adiciona os novos veículos do ficheiro de preparação sem alterar os registos já editados na administração."
        pills={[`${pendingVehicles.length} por importar`]}
      />

      <p className="mb-5 text-sm text-steel">
        {pendingVehicles.map((vehicle) => vehicle.name).join(" · ")}
      </p>

      <Button
        onClick={onImport}
        disabled={isSaving}
        icon={FaFileImport}
        className={`w-full ${adminButtonClassName}`}
      >
        {isSaving ? "A importar veículos..." : "Importar veículos preparados"}
      </Button>
    </section>
  );
}

export default SeedVehicleImportCard;
