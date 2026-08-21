import { FaPlus } from "react-icons/fa";
import Button from "../../../components/Button.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { adminButtonClassName, sectionCardClassName } from "../constants.js";

function CreateNewVehicleCard({
  liveVehiclesWithoutMetadata,
  newLiveVehicleId,
  onNewLiveVehicleIdChange,
  onStartNewLiveEntry,
  onStartNewStaticEntry,
  isCreatingNew,
  onCancelNewEntry,
}) {
  return (
    <div className={sectionCardClassName}>
      <SectionHeading
        icon={FaPlus}
        title="Criar novo veículo"
        description="Sempre que possível, comece com um veículo da Twice. Use apenas do site quando o veículo não existir na Twice."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <label className="text-sm font-bold uppercase tracking-[0.18em] text-graphite">
            Veículos em direto da Twice
          </label>
          <select
            className="mt-3 w-full rounded-xl border border-graphite/60 bg-phantom px-4 py-3 text-steel outline-none transition-colors focus:border-cloud"
            value={newLiveVehicleId}
            onChange={(event) => onNewLiveVehicleIdChange(event.target.value)}
            disabled={!liveVehiclesWithoutMetadata.length}
          >
            {liveVehiclesWithoutMetadata.length > 0 ? (
              liveVehiclesWithoutMetadata.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name} ({vehicle.id})
                </option>
              ))
            ) : (
              <option value="">Não foram encontrados veículos da Twice sem dados do site</option>
            )}
          </select>
        </div>

        <Button
          onClick={onStartNewLiveEntry}
          disabled={!liveVehiclesWithoutMetadata.length}
          className={`w-full justify-center self-end ${adminButtonClassName}`}
        >
          Criar a partir de veículo da Twice
        </Button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Button
          variant="ghost"
          onClick={onStartNewStaticEntry}
          className={`w-full ${adminButtonClassName}`}
        >
          Criar veículo apenas do site
        </Button>
        {isCreatingNew && (
          <Button
            variant="ghost"
            onClick={onCancelNewEntry}
            className={`w-full ${adminButtonClassName}`}
          >
            Cancelar novo veículo
          </Button>
        )}
      </div>

      <p className="mt-4 text-sm text-space">
        Um veículo ligado à Twice mantém-se associado ao produto existente. Um veículo apenas do
        site existe apenas no website.
      </p>
    </div>
  );
}

export default CreateNewVehicleCard;
