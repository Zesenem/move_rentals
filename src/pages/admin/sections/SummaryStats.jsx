import { FaDatabase, FaMotorcycle, FaTag } from "react-icons/fa";
import StatCard from "../components/StatCard.jsx";

function SummaryStats({ vehicleCount, adminSummary }) {
  return (
    <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={FaMotorcycle}
        label="Registos da frota"
        value={vehicleCount}
        helper="Veículos atualmente visíveis no site depois de combinar Twice e dados do site."
      />
      <StatCard
        icon={FaDatabase}
        label="Registos de dados"
        value={adminSummary.metadataEntries}
        helper="Registos atualmente guardados no documento de dados."
      />
      <StatCard
        icon={FaTag}
        label="Apenas do site"
        value={adminSummary.staticOnlyVehicles}
        helper="Registos que existem no site mesmo que ainda não estejam presentes na Twice."
      />
      <StatCard
        icon={FaDatabase}
        label="Regras gerais"
        value={`${adminSummary.commonIncluded} / ${adminSummary.commonRequirements}`}
        helper="Itens incluídos / requisitos reutilizados nos veículos."
      />
    </div>
  );
}

export default SummaryStats;
