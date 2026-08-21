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
        title="Create New Vehicle"
        description="Start from a live Twice vehicle when possible. Use static-only only when the vehicle is not available in Twice."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <label className="text-sm font-bold uppercase tracking-[0.18em] text-graphite">
            Live vehicles from Twice
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
              <option value="">No live vehicles without metadata found</option>
            )}
          </select>
        </div>

        <Button
          onClick={onStartNewLiveEntry}
          disabled={!liveVehiclesWithoutMetadata.length}
          className={`w-full justify-center self-end ${adminButtonClassName}`}
        >
          Create From Live Vehicle
        </Button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Button
          variant="ghost"
          onClick={onStartNewStaticEntry}
          className={`w-full ${adminButtonClassName}`}
        >
          Create Static-Only Vehicle
        </Button>
        {isCreatingNew && (
          <Button
            variant="ghost"
            onClick={onCancelNewEntry}
            className={`w-full ${adminButtonClassName}`}
          >
            Cancel New Vehicle
          </Button>
        )}
      </div>

      <p className="mt-4 text-sm text-space">
        A live-linked vehicle stays connected to the existing Twice product. A static-only vehicle
        exists only on the website.
      </p>
    </div>
  );
}

export default CreateNewVehicleCard;
