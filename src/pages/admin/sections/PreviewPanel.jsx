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
          title={isCreatingNew ? "Pré-visualização do novo registo" : "Pré-visualização do registo"}
          description="Atualiza enquanto edita para poder confirmar o resultado apresentado ao cliente antes de guardar."
        />

        {!isCreatingNew && !selectedLiveVehicle && selectedMetadataEntry?.source !== "static" && (
          <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            O veículo da Twice não foi encontrado na atualização atual, por isso esta pré-visualização
            baseia-se apenas nos dados guardados.
          </p>
        )}

        {isCreatingNew && !selectedNewLiveVehicle && draft.source !== "static" && (
          <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Este novo registo ainda não está ligado a um veículo da Twice, por isso a pré-visualização
            usa apenas os dados introduzidos.
          </p>
        )}

        <div className="mt-6">
          {selectedVehiclePreview ? (
            <VehicleRecordCard vehicle={selectedVehiclePreview} />
          ) : (
            <p className="text-space">Selecione um veículo para pré-visualizar.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default PreviewPanel;
