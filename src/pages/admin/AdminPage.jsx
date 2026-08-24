import { Helmet } from "react-helmet-async";
import { FaExclamationTriangle } from "react-icons/fa";

import SaveActionBar from "./components/SaveActionBar.jsx";
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
        <title>Área de Administração | Move Rentals</title>
        <meta
          name="description"
          content="Área protegida para gerir os dados da frota da Move Rentals."
        />
      </Helmet>

      <div className="w-full px-4 py-8 sm:px-6 lg:px-8 xl:px-10 2xl:px-14">
        <div className="mx-auto w-full max-w-[1920px]">
          <WorkspaceHeader adminUser={adminUser} onLogout={onLogout} />

          <SummaryStats vehicleCount={vehicles.length} adminSummary={adminSummary} />

          {isLoading && (
            <div className="mt-10 rounded-2xl border border-graphite/50 bg-arsenic p-8 text-space">
              A carregar a área de administração...
            </div>
          )}

          {!isLoading && (isVehiclesError || isMetadataError) && (
            <div className="mt-10 rounded-2xl border border-red-500/40 bg-red-500/10 p-8 text-space">
              <FaExclamationTriangle className="mb-4 text-3xl text-red-400" />
              <h2 className="text-xl font-bold text-cloud">Não foi possível carregar a administração</h2>
              <p className="mt-2">{error?.message || "Erro desconhecido"}</p>
            </div>
          )}

          {!isLoading && !isVehiclesError && !isMetadataError && (
            <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(380px,460px)] 2xl:grid-cols-[minmax(0,1fr)_minmax(420px,500px)]">
              <section className="min-w-0">
                <div className="grid gap-6 2xl:grid-cols-2">
                  <div className="2xl:col-span-2">
                    <SaveActionBar
                      title={
                        isCreatingNew
                          ? newEntryKind === "static"
                            ? "A criar um veículo apenas do site"
                            : "A criar um veículo ligado à Twice"
                          : selectedMetadataEntry
                            ? `A editar ${selectedMetadataEntry.name}`
                            : "A editar regras gerais de aluguer"
                      }
                      description={
                        isCreatingNew
                          ? "Guarde quando o novo veículo estiver pronto. As regras gerais também são guardadas."
                          : "Guarde as alterações quando quiser. Os detalhes do veículo e as regras gerais são guardados juntos."
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

                  <BasicDetailsSection
                    draft={draft}
                    onDraftChange={handleDraftChange}
                    onToggleDraftField={handleToggleDraftField}
                  />

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
