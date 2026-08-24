import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { matchesVehicleMetadata } from "../../services/fleetMatching.js";
import { fetchProducts } from "../../services/twice.js";
import { fetchFleetMetadata, saveFleetMetadata } from "../../services/fleetMetadata.js";
import { PREVIEW_EDITABLE_KEYS } from "./constants.js";
import {
  buildUpdatedCommonData,
  buildUpdatedVehicleEntry,
  createCommonDataDraft,
  createLiveVehicleMetadataTemplate,
  createStaticVehicleMetadataTemplate,
  createVehicleDraft,
  getEntryKey,
  hasVehicleEntryConflict,
} from "./metadataHelpers.js";

// Encapsulates all fleet metadata editor state so AdminPage only handles layout.
function useFleetMetadataEditor() {
  const queryClient = useQueryClient();
  const [selectedEntryKey, setSelectedEntryKey] = useState("");
  const [draft, setDraft] = useState(() => createVehicleDraft());
  const [commonDataDraft, setCommonDataDraft] = useState(() => createCommonDataDraft());
  const [formError, setFormError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newEntryKind, setNewEntryKind] = useState(null);
  const [newLiveVehicleId, setNewLiveVehicleId] = useState("");

  const {
    data: vehicles = [],
    isLoading: isLoadingVehicles,
    isError: isVehiclesError,
    error: vehiclesError,
  } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: fetchProducts,
  });

  const {
    data: metadata,
    isLoading: isLoadingMetadata,
    isError: isMetadataError,
    error: metadataError,
  } = useQuery({
    queryKey: ["admin", "fleet-metadata"],
    queryFn: fetchFleetMetadata,
  });

  const metadataEntries = useMemo(() => metadata?.motorcycles_static_data || [], [metadata]);
  const isLoading = isLoadingVehicles || isLoadingMetadata;
  const error = vehiclesError || metadataError;

  const liveVehiclesWithoutMetadata = useMemo(
    () =>
      vehicles.filter(
        (vehicle) =>
          !String(vehicle.id).startsWith("static-") &&
          !metadataEntries.some((entry) => matchesVehicleMetadata(entry, vehicle)),
      ),
    [metadataEntries, vehicles],
  );

  useEffect(() => {
    if (isCreatingNew) {
      return;
    }

    if (!metadataEntries.length) {
      setSelectedEntryKey("");
      setDraft(createVehicleDraft());
      return;
    }

    const hasSelectedEntry = metadataEntries.some(
      (entry, index) => getEntryKey(entry, index) === selectedEntryKey,
    );

    if (!hasSelectedEntry) {
      setSelectedEntryKey(getEntryKey(metadataEntries[0], 0));
    }
  }, [isCreatingNew, metadataEntries, selectedEntryKey]);

  const selectedMetadataIndex = useMemo(
    () =>
      metadataEntries.findIndex((entry, index) => getEntryKey(entry, index) === selectedEntryKey),
    [metadataEntries, selectedEntryKey],
  );

  const selectedMetadataEntry =
    selectedMetadataIndex >= 0 ? metadataEntries[selectedMetadataIndex] : null;

  useEffect(() => {
    if (!liveVehiclesWithoutMetadata.length) {
      setNewLiveVehicleId("");
      return;
    }

    const hasSelectedLiveVehicle = liveVehiclesWithoutMetadata.some(
      (vehicle) => vehicle.id === newLiveVehicleId,
    );

    if (!hasSelectedLiveVehicle) {
      setNewLiveVehicleId(liveVehiclesWithoutMetadata[0].id);
    }
  }, [liveVehiclesWithoutMetadata, newLiveVehicleId]);

  const selectedNewLiveVehicle = useMemo(
    () => liveVehiclesWithoutMetadata.find((vehicle) => vehicle.id === newLiveVehicleId) || null,
    [liveVehiclesWithoutMetadata, newLiveVehicleId],
  );

  const activeMetadataBase = useMemo(() => {
    if (isCreatingNew) {
      if (newEntryKind === "live" && selectedNewLiveVehicle) {
        return createLiveVehicleMetadataTemplate(selectedNewLiveVehicle);
      }

      return createStaticVehicleMetadataTemplate();
    }

    return selectedMetadataEntry;
  }, [isCreatingNew, newEntryKind, selectedMetadataEntry, selectedNewLiveVehicle]);

  const selectedLiveVehicle = useMemo(() => {
    if (!selectedMetadataEntry) {
      return null;
    }

    return (
      vehicles.find((vehicle) => vehicle.id === selectedMetadataEntry.id) ||
      vehicles.find((vehicle) => vehicle.slug === selectedMetadataEntry.slug) ||
      null
    );
  }, [selectedMetadataEntry, vehicles]);

  const selectedVehiclePreview = useMemo(() => {
    if (!activeMetadataBase) {
      return null;
    }

    try {
      const updatedEntry = buildUpdatedVehicleEntry(activeMetadataBase, draft);
      const previewSourceVehicle = isCreatingNew ? selectedNewLiveVehicle : selectedLiveVehicle;
      const previewBase = { ...(previewSourceVehicle || activeMetadataBase) };

      PREVIEW_EDITABLE_KEYS.forEach((key) => {
        delete previewBase[key];
      });

      return {
        ...previewBase,
        ...updatedEntry,
      };
    } catch {
      return (isCreatingNew ? selectedNewLiveVehicle : selectedLiveVehicle) || activeMetadataBase;
    }
  }, [activeMetadataBase, draft, isCreatingNew, selectedLiveVehicle, selectedNewLiveVehicle]);

  useEffect(() => {
    if (isCreatingNew) {
      return;
    }

    if (!selectedMetadataEntry) {
      setDraft(createVehicleDraft());
      return;
    }

    setDraft(createVehicleDraft(selectedMetadataEntry));
    setFormError("");
    setSaveMessage("");
  }, [isCreatingNew, selectedMetadataEntry]);

  useEffect(() => {
    setCommonDataDraft(createCommonDataDraft(metadata?.common_data));
  }, [metadata]);

  const adminSummary = useMemo(() => {
    return {
      metadataEntries: metadataEntries.length,
      liveVehicles: vehicles.filter((vehicle) => !String(vehicle.id).startsWith("static-")).length,
      staticOnlyVehicles: metadataEntries.filter((vehicle) => vehicle.source === "static").length,
      commonIncluded: metadata?.common_data?.included?.length || 0,
      commonRequirements: metadata?.common_data?.requirements?.length || 0,
    };
  }, [metadata, metadataEntries, vehicles]);

  const saveMutation = useMutation({
    mutationFn: async (nextMetadata) => {
      return await saveFleetMetadata(nextMetadata);
    },
    onSuccess: (savedMetadata) => {
      queryClient.setQueryData(["admin", "fleet-metadata"], savedMetadata);
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });

  const updateDraft = (updater) => {
    setDraft((currentDraft) => updater(currentDraft));
    setFormError("");
    setSaveMessage("");
  };

  const updateCommonDataDraft = (updater) => {
    setCommonDataDraft((currentDraft) => updater(currentDraft));
    setFormError("");
    setSaveMessage("");
  };

  const handleDraftChange = (field) => (event) => {
    const { value } = event.target;

    updateDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
  };

  const handleToggleDraftField = (field) => (event) => {
    const { checked } = event.target;

    updateDraft((currentDraft) => ({
      ...currentDraft,
      [field]: checked,
    }));
  };

  const handleBadgeToggle = (badge) => {
    updateDraft((currentDraft) => ({
      ...currentDraft,
      badges: currentDraft.badges.includes(badge)
        ? currentDraft.badges.filter((currentBadge) => currentBadge !== badge)
        : [...currentDraft.badges, badge],
    }));
  };

  const handleStringListChange = (field, index, value) => {
    updateDraft((currentDraft) => ({
      ...currentDraft,
      [field]: currentDraft[field].map((item, itemIndex) => (itemIndex === index ? value : item)),
    }));
  };

  const handleAddStringListItem = (field) => {
    updateDraft((currentDraft) => ({
      ...currentDraft,
      [field]: [...currentDraft[field], ""],
    }));
  };

  const handleRemoveStringListItem = (field, index) => {
    updateDraft((currentDraft) => ({
      ...currentDraft,
      [field]: currentDraft[field].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleObjectListChange = (field, index, key, value) => {
    updateDraft((currentDraft) => ({
      ...currentDraft,
      [field]: currentDraft[field].map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [key]: value,
            }
          : item,
      ),
    }));
  };

  const handleAddObjectListItem = (field, template) => {
    updateDraft((currentDraft) => ({
      ...currentDraft,
      [field]: [...currentDraft[field], { ...template }],
    }));
  };

  const handleRemoveObjectListItem = (field, index) => {
    updateDraft((currentDraft) => ({
      ...currentDraft,
      [field]: currentDraft[field].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleCommonDataObjectListChange = (field, index, key, value) => {
    updateCommonDataDraft((currentDraft) => ({
      ...currentDraft,
      [field]: currentDraft[field].map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [key]: value,
            }
          : item,
      ),
    }));
  };

  const handleAddCommonDataObjectListItem = (field, template) => {
    updateCommonDataDraft((currentDraft) => ({
      ...currentDraft,
      [field]: [...currentDraft[field], { ...template }],
    }));
  };

  const handleRemoveCommonDataObjectListItem = (field, index) => {
    updateCommonDataDraft((currentDraft) => ({
      ...currentDraft,
      [field]: currentDraft[field].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleStartNewLiveEntry = () => {
    if (!selectedNewLiveVehicle) {
      return;
    }

    setIsCreatingNew(true);
    setNewEntryKind("live");
    setDraft(createVehicleDraft(createLiveVehicleMetadataTemplate(selectedNewLiveVehicle)));
    setFormError("");
    setSaveMessage("");
  };

  const handleStartNewStaticEntry = () => {
    setIsCreatingNew(true);
    setNewEntryKind("static");
    setDraft(createVehicleDraft(createStaticVehicleMetadataTemplate()));
    setFormError("");
    setSaveMessage("");
  };

  const handleCancelNewEntry = () => {
    setIsCreatingNew(false);
    setNewEntryKind(null);
    setFormError("");
    setSaveMessage("");

    if (selectedMetadataEntry) {
      setDraft(createVehicleDraft(selectedMetadataEntry));
      return;
    }

    setDraft(createVehicleDraft());
  };

  const handleResetChanges = () => {
    setCommonDataDraft(createCommonDataDraft(metadata?.common_data));

    if (isCreatingNew) {
      setDraft(
        createVehicleDraft(
          newEntryKind === "live" && selectedNewLiveVehicle
            ? createLiveVehicleMetadataTemplate(selectedNewLiveVehicle)
            : createStaticVehicleMetadataTemplate(),
        ),
      );
      setFormError("");
      setSaveMessage("");
      return;
    }

    if (!selectedMetadataEntry) {
      return;
    }

    setDraft(createVehicleDraft(selectedMetadataEntry));
    setFormError("");
    setSaveMessage("");
  };

  const handleSaveChanges = async () => {
    if (!metadata) {
      return;
    }

    setFormError("");
    setSaveMessage("");

    try {
      const nextCommonData = buildUpdatedCommonData(commonDataDraft);
      let nextEntries = metadataEntries;
      let updatedEntry = null;

      if (activeMetadataBase) {
        updatedEntry = buildUpdatedVehicleEntry(activeMetadataBase, draft);
        const conflictingEntryIndex = metadataEntries.findIndex((entry, index) => {
          if (!isCreatingNew && index === selectedMetadataIndex) {
            return false;
          }

          return hasVehicleEntryConflict(entry, updatedEntry);
        });

        if (conflictingEntryIndex >= 0) {
          throw new Error(
            "Já existe outro registo com o mesmo ID, slug ou nome de veículo.",
          );
        }

        nextEntries = isCreatingNew
          ? [...metadataEntries, updatedEntry]
          : metadataEntries.map((entry, index) =>
              index === selectedMetadataIndex ? updatedEntry : entry,
            );
      }

      const nextMetadata = {
        ...metadata,
        common_data: nextCommonData,
        motorcycles_static_data: nextEntries,
      };

      await saveMutation.mutateAsync(nextMetadata);

      if (updatedEntry) {
        setIsCreatingNew(false);
        setNewEntryKind(null);
        setSelectedEntryKey(
          getEntryKey(updatedEntry, isCreatingNew ? nextEntries.length - 1 : selectedMetadataIndex),
        );
      }

      setSaveMessage(
        updatedEntry && isCreatingNew
          ? "Novo veículo e regras gerais de aluguer guardados."
          : updatedEntry
            ? "Detalhes do veículo e regras gerais de aluguer guardados."
            : "Regras gerais de aluguer guardadas.",
      );
    } catch (saveError) {
      setFormError(saveError.message || "Não foi possível guardar as alterações.");
    }
  };

  const handleDeleteSelectedEntry = async () => {
    if (!metadata || isCreatingNew || !selectedMetadataEntry || selectedMetadataIndex < 0) {
      return;
    }

    const confirmed = window.confirm(
      `Eliminar "${selectedMetadataEntry.name || "este veículo"}" dos dados da frota? Esta ação não pode ser anulada.`,
    );

    if (!confirmed) {
      return;
    }

    setFormError("");
    setSaveMessage("");

    try {
      const nextEntries = metadataEntries.filter((_, index) => index !== selectedMetadataIndex);
      const nextMetadata = {
        ...metadata,
        common_data: buildUpdatedCommonData(commonDataDraft),
        motorcycles_static_data: nextEntries,
      };

      await saveMutation.mutateAsync(nextMetadata);

      if (nextEntries.length > 0) {
        const nextSelectedIndex = Math.min(selectedMetadataIndex, nextEntries.length - 1);
        setSelectedEntryKey(getEntryKey(nextEntries[nextSelectedIndex], nextSelectedIndex));
      } else {
        setSelectedEntryKey("");
        setDraft(createVehicleDraft());
      }

      setSaveMessage("Registo do veículo eliminado.");
    } catch (deleteError) {
      setFormError(deleteError.message || "Não foi possível eliminar o veículo selecionado.");
    }
  };

  return {
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
  };
}

export default useFleetMetadataEditor;
