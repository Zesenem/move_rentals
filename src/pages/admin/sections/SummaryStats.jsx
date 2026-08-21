import { FaDatabase, FaMotorcycle, FaTag } from "react-icons/fa";
import StatCard from "../components/StatCard.jsx";

function SummaryStats({ vehicleCount, adminSummary }) {
  return (
    <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={FaMotorcycle}
        label="Fleet Records"
        value={vehicleCount}
        helper="Vehicles currently visible to the app after the Twice + metadata merge."
      />
      <StatCard
        icon={FaDatabase}
        label="Metadata Entries"
        value={adminSummary.metadataEntries}
        helper="Records currently stored in the metadata document."
      />
      <StatCard
        icon={FaTag}
        label="Static-Only"
        value={adminSummary.staticOnlyVehicles}
        helper="Entries that exist locally even if they are not yet present in Twice."
      />
      <StatCard
        icon={FaDatabase}
        label="Shared Defaults"
        value={`${adminSummary.commonIncluded} / ${adminSummary.commonRequirements}`}
        helper="Included items / requirements reused across vehicles."
      />
    </div>
  );
}

export default SummaryStats;
