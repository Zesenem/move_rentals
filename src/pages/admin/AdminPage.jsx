import { Helmet } from "react-helmet-async";
import { FaExclamationTriangle } from "react-icons/fa";

import SaveActionBar from "./components/SaveActionBar.jsx";
import AdvancedSettingsSection from "./sections/AdvancedSettingsSection.jsx";
import BasicDetailsSection from "./sections/BasicDetailsSection.jsx";
import CreateNewVehicleCard from "./sections/CreateNewVehicleCard.jsx";
import EditExistingVehicleCard from "./sections/EditExistingVehicleCard.jsx";
import FleetCardSection from "./sections/FleetCardSection.jsx";
import PreviewPanel from "./sections/PreviewPanel.jsx";
import RentalRulesSection from "./sections/RentalRulesSection.jsx";
import SharedDefaultsSection from "./sections/SharedDefaultsSection.jsx";
import SummaryStats from "./sections/SummaryStats.jsx";
import VehicleDetailPageSection from "./sections/VehicleDetailPageSection.jsx";
import WorkspaceHeader from "./sections/WorkspaceHeader.jsx";
import useFleetMetadataEditor from "./useFleetMetadataEditor.js";

function AdminPage({ adminUser, onLogout }) {
  const {
    vehicles,
    isLoading,
    isVehiclesError,
    isMetadataError,
    error,
    adminSummary,
    metadataEntries,
    liveVehiclesWithoutMetadata,
    selectedEntryKey,
    setSelectedEntryKey,
    selectedMetadataEntry,
    isCreatingNew,
    newEntryKind,
    newLiveVehicleId,
    setNewLiveVehicleId,
    draft,
    commonDataDraft,
    formError,
    saveMessage,
    saveMutation,
    selectedLiveVehicle,
    selectedNewLiveVehicle,
    selectedVehiclePreview,
    handleDraftChange,
    handleToggleDraftField,
    handleBadgeToggle,
    handleStringListChange,
    handleAddStringListItem,
    handleRemoveStringListItem,
    handleObjectListChange,
    handleAddObjectListItem,
    handleRemoveObjectListItem,
    handleCommonDataObjectListChange,
    handleAddCommonDataObjectListItem,
    handleRemoveCommonDataObjectListItem,
    handleStartNewLiveEntry,
    handleStartNewStaticEntry,
    handleCancelNewEntry,
    handleResetChanges,
    handleSaveChanges,
    handleDeleteSelectedEntry,
  } = useFleetMetadataEditor();

  return (
    <>
      <Helmet>
        <title>Admin Workspace | Move Rentals</title>
        <meta
          name="description"
          content="Edit the fleet metadata document that powers the Move Rentals admin tools."
        />
      </Helmet>

      <div className="w-full px-4 py-8 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="mx-auto w-full max-w-[1800px]">
          <WorkspaceHeader adminUser={adminUser} onLogout={onLogout} />

          <SummaryStats vehicleCount={vehicles.length} adminSummary={adminSummary} />

          {isLoading && (
            <div className="mt-10 rounded-2xl border border-graphite/50 bg-arsenic p-8 text-space">
              Loading admin workspace...
            </div>
          )}

          {!isLoading && (isVehiclesError || isMetadataError) && (
            <div className="mt-10 rounded-2xl border border-red-500/40 bg-red-500/10 p-8 text-space">
              <FaExclamationTriangle className="mb-4 text-3xl text-red-400" />
              <h2 className="text-xl font-bold text-cloud">Could Not Load Admin Workspace</h2>
              <p className="mt-2">{error?.message || "Unknown error"}</p>
            </div>
          )}

          {!isLoading && !isVehiclesError && !isMetadataError && (
            <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.95fr)] 2xl:grid-cols-[minmax(0,1.55fr)_minmax(400px,0.9fr)]">
              <section className="min-w-0 rounded-2xl border border-graphite/50 bg-arsenic p-5 shadow-lg lg:p-6">
                <div className="grid gap-6 2xl:grid-cols-2">
                  <div className="2xl:col-span-2">
                    <SaveActionBar
                      title={
                        isCreatingNew
                          ? newEntryKind === "static"
                            ? "Creating a static-only vehicle"
                            : "Creating a live-linked vehicle"
                          : selectedMetadataEntry
                            ? `Editing ${selectedMetadataEntry.name}`
                            : "Editing shared rental defaults"
                      }
                      description={
                        isCreatingNew
                          ? "Save when the new vehicle is ready. Shared rental defaults are saved at the same time."
                          : "Use Save Changes at any time. Vehicle details and shared rental defaults are saved together."
                      }
                      isSaving={saveMutation.isPending}
                      isCreatingNew={isCreatingNew}
                      canDelete={!isCreatingNew && Boolean(selectedMetadataEntry)}
                      onSave={handleSaveChanges}
                      onReset={handleResetChanges}
                      onDelete={handleDeleteSelectedEntry}
                    />
                  </div>

                  {(formError || saveMessage) && (
                    <div
                      className={`2xl:col-span-2 rounded-xl border p-4 text-sm ${
                        formError
                          ? "border-red-500/40 bg-red-500/10 text-red-200"
                          : "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                      }`}
                    >
                      {formError ? formError : saveMessage}
                    </div>
                  )}

                  <div className="grid gap-6 xl:grid-cols-2 2xl:col-span-2">
                    <EditExistingVehicleCard
                      metadataEntries={metadataEntries}
                      selectedEntryKey={selectedEntryKey}
                      onSelectEntry={setSelectedEntryKey}
                      isCreatingNew={isCreatingNew}
                    />

                    <CreateNewVehicleCard
                      liveVehiclesWithoutMetadata={liveVehiclesWithoutMetadata}
                      newLiveVehicleId={newLiveVehicleId}
                      onNewLiveVehicleIdChange={setNewLiveVehicleId}
                      onStartNewLiveEntry={handleStartNewLiveEntry}
                      onStartNewStaticEntry={handleStartNewStaticEntry}
                      isCreatingNew={isCreatingNew}
                      onCancelNewEntry={handleCancelNewEntry}
                    />
                  </div>

                  <BasicDetailsSection draft={draft} onDraftChange={handleDraftChange} />

                  <FleetCardSection
                    draft={draft}
                    onBadgeToggle={handleBadgeToggle}
                    onAddObjectListItem={handleAddObjectListItem}
                    onObjectListChange={handleObjectListChange}
                    onRemoveObjectListItem={handleRemoveObjectListItem}
                  />

                  <VehicleDetailPageSection
                    draft={draft}
                    onAddObjectListItem={handleAddObjectListItem}
                    onObjectListChange={handleObjectListChange}
                    onRemoveObjectListItem={handleRemoveObjectListItem}
                  />

                  <RentalRulesSection
                    draft={draft}
                    onToggleDraftField={handleToggleDraftField}
                    onAddObjectListItem={handleAddObjectListItem}
                    onObjectListChange={handleObjectListChange}
                    onRemoveObjectListItem={handleRemoveObjectListItem}
                  />

                  <SharedDefaultsSection
                    commonDataDraft={commonDataDraft}
                    onAddCommonDataObjectListItem={handleAddCommonDataObjectListItem}
                    onCommonDataObjectListChange={handleCommonDataObjectListChange}
                    onRemoveCommonDataObjectListItem={handleRemoveCommonDataObjectListItem}
                  />

                  <AdvancedSettingsSection
                    draft={draft}
                    onDraftChange={handleDraftChange}
                    onAddStringListItem={handleAddStringListItem}
                    onStringListChange={handleStringListChange}
                    onRemoveStringListItem={handleRemoveStringListItem}
                  />
                </div>
              </section>

              <PreviewPanel
                isCreatingNew={isCreatingNew}
                selectedLiveVehicle={selectedLiveVehicle}
                selectedMetadataEntry={selectedMetadataEntry}
                selectedNewLiveVehicle={selectedNewLiveVehicle}
                draft={draft}
                selectedVehiclePreview={selectedVehiclePreview}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminPage;
