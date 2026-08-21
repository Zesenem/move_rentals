import { FaEye } from "react-icons/fa";
import SectionHeading from "../components/SectionHeading.jsx";
import VehicleRecordCard from "../components/VehicleRecordCard.jsx";

function PreviewPanel({
  isCreatingNew,
  selectedLiveVehicle,
  selectedMetadataEntry,
  selectedNewLiveVehicle,
  draft,
  selectedVehiclePreview,
}) {
  return (
    <div className="min-w-0 xl:sticky xl:top-24 xl:self-start">
      <section className="min-w-0 rounded-2xl border border-graphite/50 bg-arsenic p-5 shadow-lg lg:p-6">
        <SectionHeading
          icon={FaEye}
          title={isCreatingNew ? "New Record Preview" : "Selected Record Preview"}
          description="This updates while you edit so you can check the customer-facing result before saving."
        />

        {!isCreatingNew && !selectedLiveVehicle && selectedMetadataEntry?.source !== "static" && (
          <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            The live Twice vehicle was not found in the current fetch, so this preview is based only
            on the saved metadata fields.
          </p>
        )}

        {isCreatingNew && !selectedNewLiveVehicle && draft.source !== "static" && (
          <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            This new entry is not linked to a live Twice vehicle yet, so the preview uses metadata
            values only.
          </p>
        )}

        <div className="mt-6">
          {selectedVehiclePreview ? (
            <VehicleRecordCard vehicle={selectedVehiclePreview} />
          ) : (
            <p className="text-space">Select a vehicle to preview it.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default PreviewPanel;
