import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import {
  FaCheckCircle,
  FaDatabase,
  FaEye,
  FaExclamationTriangle,
  FaInfoCircle,
  FaListUl,
  FaMotorcycle,
  FaPlus,
  FaSave,
  FaSlidersH,
  FaTag,
  FaTrash,
} from "react-icons/fa";

import Button from "../components/Button";
import {
  matchesVehicleMetadata,
  normalizeString,
  slugify,
} from "../services/fleetMatching.js";
import { fetchProducts } from "../services/twice.js";
import { fetchFleetMetadata, saveFleetMetadata } from "../services/fleetMetadata.js";

const inputClassName =
  "w-full rounded-xl border border-graphite/60 bg-phantom px-4 py-3 text-steel outline-none transition-colors focus:border-cloud";
const textareaClassName = `${inputClassName} min-h-[120px]`;
const sectionCardClassName = "rounded-2xl border border-graphite/50 bg-phantom/40 p-5";
const addButtonClassName =
  "inline-flex items-center gap-2 rounded-xl border border-cloud/40 bg-cloud/10 px-4 py-2 text-sm font-semibold text-cloud transition-colors hover:bg-cloud/20";
const removeButtonClassName =
  "inline-flex h-[50px] w-[50px] items-center justify-center rounded-xl border border-red-500/40 bg-red-500/10 text-red-200 transition-colors hover:bg-red-500/20";
const hintPillClassName =
  "inline-flex items-center rounded-full border border-graphite/60 bg-phantom px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-space";

const STATUS_OPTIONS = [
  { value: "", label: "Use live/default status" },
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
  { value: "on-demand", label: "On Demand" },
];

const SOURCE_OPTIONS = [
  { value: "", label: "Live product from Twice" },
  { value: "static", label: "Static-only vehicle" },
];

const BADGE_OPTIONS = ["ECO", "Premium", "GPS", "Electric", "Best Seller", "Best Value"];

const QUICK_GLANCE_ICON_OPTIONS = [
  { value: "engine", label: "Engine / CC" },
  { value: "power", label: "Power" },
  { value: "license", label: "License" },
  { value: "gas", label: "Fuel / Tank" },
  { value: "mileage", label: "Mileage / Range" },
  { value: "transmission", label: "Transmission" },
  { value: "drivetrain", label: "Drivetrain" },
  { value: "speed", label: "Speed" },
  { value: "track", label: "Track use" },
];

const LIST_ICON_OPTIONS = [
  { value: "default-check", label: "Check" },
  { value: "id-card", label: "Identity card" },
  { value: "license", label: "Driving license" },
  { value: "credit-card", label: "Card / Deposit" },
  { value: "experience", label: "Experience" },
  { value: "helmet", label: "Helmet" },
  { value: "gloves", label: "Gloves" },
  { value: "jacket", label: "Jacket" },
  { value: "trousers", label: "Trousers" },
  { value: "boots", label: "Boots" },
  { value: "lock", label: "Locker / Lock" },
  { value: "tax", label: "Tax" },
  { value: "shield", label: "Insurance" },
  { value: "users", label: "Third-party" },
  { value: "road", label: "Road / Mileage" },
  { value: "infinity", label: "Unlimited" },
  { value: "airport", label: "Airport" },
  { value: "delivery", label: "Delivery" },
  { value: "toll", label: "Toll" },
];

const EMPTY_QUICK_GLANCE_ITEM = { label: "", icon: "engine" };
const EMPTY_FEATURE_ITEM = { label: "", value: "" };
const EMPTY_LIST_ITEM = { item: "", icon: "default-check" };
const PREVIEW_EDITABLE_KEYS = [
  "id",
  "slug",
  "source",
  "name",
  "status",
  "availability_label",
  "description",
  "security_deposit",
  "badges",
  "match_names",
  "quick_glance",
  "technical_features",
  "included",
  "requirements",
  "important_notes",
];

const getEntryKey = (vehicle, index = 0) =>
  vehicle.id || vehicle.slug || vehicle.name || `metadata-entry-${index}`;

const hasOwnKey = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const cloneStringList = (items) => (Array.isArray(items) ? [...items] : []);
const cloneObjectList = (items, template) =>
  Array.isArray(items) ? items.map((item) => ({ ...template, ...item })) : [];

const createVehicleDraft = (vehicle = {}) => ({
  id: vehicle.id || "",
  slug: vehicle.slug || "",
  source: vehicle.source || "",
  name: vehicle.name || "",
  status: vehicle.status || "",
  availabilityLabel: vehicle.availability_label || "",
  description: vehicle.description || "",
  securityDeposit:
    vehicle.security_deposit === undefined || vehicle.security_deposit === null
      ? ""
      : String(vehicle.security_deposit),
  badges: cloneStringList(vehicle.badges),
  matchNames: cloneStringList(vehicle.match_names),
  quickGlance: cloneObjectList(vehicle.quick_glance, EMPTY_QUICK_GLANCE_ITEM),
  technicalFeatures: cloneObjectList(vehicle.technical_features, EMPTY_FEATURE_ITEM),
  hasIncludedOverride: hasOwnKey(vehicle, "included"),
  included: cloneObjectList(vehicle.included, EMPTY_LIST_ITEM),
  hasRequirementsOverride: hasOwnKey(vehicle, "requirements"),
  requirements: cloneObjectList(vehicle.requirements, EMPTY_LIST_ITEM),
  importantNotes: cloneObjectList(vehicle.important_notes, EMPTY_LIST_ITEM),
});

const createLiveVehicleMetadataTemplate = (vehicle = {}) => ({
  id: vehicle.id || "",
  slug: vehicle.slug || slugify(vehicle.name || ""),
  name: vehicle.name || "",
  description: vehicle.description || "",
  badges: [],
  quick_glance: [],
  technical_features: [],
  important_notes: [],
});

const createStaticVehicleMetadataTemplate = () => ({
  source: "static",
  status: "available",
  name: "",
  slug: "",
  description: "",
  badges: [],
  quick_glance: [],
  technical_features: [],
  important_notes: [],
});

const sanitizeStringList = (items) =>
  items
    .map((item) => item.trim())
    .filter(Boolean);

const sanitizeQuickGlance = (items) =>
  items
    .map((item) => ({
      label: item.label.trim(),
      icon: item.icon || "engine",
    }))
    .filter((item) => item.label);

const sanitizeTechnicalFeatures = (items) =>
  items
    .map((item) => ({
      label: item.label.trim(),
      value: item.value.trim(),
    }))
    .filter((item) => item.label && item.value);

const sanitizeIconListItems = (items) =>
  items
    .map((item) => ({
      item: item.item.trim(),
      icon: item.icon || "default-check",
    }))
    .filter((item) => item.item);

const parseSecurityDeposit = (value) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return undefined;
  }

  const normalizedNumber = Number(trimmedValue);

  if (!Number.isNaN(normalizedNumber) && trimmedValue === String(normalizedNumber)) {
    return normalizedNumber;
  }

  return trimmedValue;
};

const setOptionalString = (target, key, value) => {
  const trimmedValue = value.trim();

  if (trimmedValue) {
    target[key] = trimmedValue;
    return;
  }

  delete target[key];
};

const hasVehicleEntryConflict = (entryA, entryB) => {
  if (entryA.id && entryB.id && entryA.id === entryB.id) {
    return true;
  }

  if (entryA.slug && entryB.slug && entryA.slug === entryB.slug) {
    return true;
  }

  return (
    Boolean(entryA.name) &&
    Boolean(entryB.name) &&
    normalizeString(entryA.name) === normalizeString(entryB.name)
  );
};

const buildUpdatedVehicleEntry = (currentVehicle, draft) => {
  const name = draft.name.trim();

  if (!name) {
    throw new Error("Vehicle name is required.");
  }

  const nextVehicle = {
    ...currentVehicle,
    name,
  };

  setOptionalString(nextVehicle, "id", draft.id);
  setOptionalString(nextVehicle, "slug", draft.slug);
  setOptionalString(nextVehicle, "source", draft.source);
  setOptionalString(nextVehicle, "status", draft.status);
  setOptionalString(nextVehicle, "availability_label", draft.availabilityLabel);
  setOptionalString(nextVehicle, "description", draft.description);

  const badges = sanitizeStringList(draft.badges);
  const matchNames = sanitizeStringList(draft.matchNames);

  nextVehicle.badges = badges;

  if (matchNames.length > 0) {
    nextVehicle.match_names = matchNames;
  } else {
    delete nextVehicle.match_names;
  }

  const securityDeposit = parseSecurityDeposit(draft.securityDeposit);

  if (securityDeposit === undefined) {
    delete nextVehicle.security_deposit;
  } else {
    nextVehicle.security_deposit = securityDeposit;
  }

  nextVehicle.quick_glance = sanitizeQuickGlance(draft.quickGlance);
  nextVehicle.technical_features = sanitizeTechnicalFeatures(draft.technicalFeatures);
  nextVehicle.important_notes = sanitizeIconListItems(draft.importantNotes);

  if (draft.hasIncludedOverride) {
    nextVehicle.included = sanitizeIconListItems(draft.included);
  } else {
    delete nextVehicle.included;
  }

  if (draft.hasRequirementsOverride) {
    nextVehicle.requirements = sanitizeIconListItems(draft.requirements);
  } else {
    delete nextVehicle.requirements;
  }

  return nextVehicle;
};

const StatCard = ({ icon, label, value, helper }) => {
  const Icon = icon;

  return (
    <div className="rounded-2xl border border-graphite/50 bg-arsenic p-5 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-phantom p-3 text-cloud">
          <Icon className="text-lg" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-graphite">{label}</p>
          <p className="text-2xl font-extrabold text-cloud">{value}</p>
        </div>
      </div>
      {helper && <p className="mt-4 text-sm text-space">{helper}</p>}
    </div>
  );
};

const FieldGroup = ({ label, hint, children }) => (
  <div>
    <label className="text-sm font-bold uppercase tracking-[0.18em] text-graphite">{label}</label>
    {hint && <p className="mt-1 text-sm text-space">{hint}</p>}
    <div className="mt-3">{children}</div>
  </div>
);

const HelperPill = ({ children }) => <span className={hintPillClassName}>{children}</span>;

const SectionHeading = ({ icon, title, description, pills = [] }) => {
  const Icon = icon;

  return (
    <div className="mb-5">
      <div className="flex flex-wrap items-start gap-3">
        {Icon && (
          <div className="rounded-xl bg-arsenic p-3 text-cloud">
            <Icon className="text-base" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-cloud">{title}</h2>
            {pills.map((pill) => (
              <HelperPill key={pill}>{pill}</HelperPill>
            ))}
          </div>
          {description && <p className="mt-2 text-sm text-space">{description}</p>}
        </div>
      </div>
    </div>
  );
};

const GuidanceCard = ({ icon, title, description }) => {
  const Icon = icon;

  return (
    <div className="rounded-2xl border border-graphite/50 bg-phantom/30 p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-arsenic p-3 text-cloud">
          <Icon className="text-base" />
        </div>
        <div>
          <h3 className="font-bold text-cloud">{title}</h3>
          <p className="mt-2 text-sm text-space">{description}</p>
        </div>
      </div>
    </div>
  );
};

const InlineActionButton = ({ icon, label, onClick, variant = "add" }) => {
  const className = variant === "remove" ? removeButtonClassName : addButtonClassName;
  const IconComponent = icon;

  return (
    <button type="button" className={className} onClick={onClick} title={label} aria-label={label}>
      <IconComponent className="text-sm" />
      {variant !== "remove" && <span>{label}</span>}
    </button>
  );
};

const MetaList = ({ items, emptyLabel }) => {
  if (!items?.length) {
    return <span className="text-graphite">{emptyLabel}</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="rounded-full border border-graphite/60 bg-phantom px-3 py-1 text-sm text-steel"
        >
          {item}
        </span>
      ))}
    </div>
  );
};

const QuickGlanceList = ({ items }) => {
  if (!items?.length) {
    return <span className="text-graphite">No quick glance items</span>;
  }

  return (
    <ul className="space-y-1 text-sm text-space">
      {items.map((item, index) => (
        <li key={`${item.icon}-${item.label}-${index}`}>
          <span className="font-semibold text-cloud">{item.label}</span>
          <span className="text-graphite"> / </span>
          <span>{item.icon}</span>
        </li>
      ))}
    </ul>
  );
};

const BadgeSelector = ({ value, onToggle }) => (
  <div className="flex flex-wrap gap-2">
    {BADGE_OPTIONS.map((badge) => {
      const isSelected = value.includes(badge);

      return (
        <button
          key={badge}
          type="button"
          onClick={() => onToggle(badge)}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
            isSelected
              ? "border-cloud bg-cloud text-phantom"
              : "border-graphite/60 bg-phantom text-steel hover:border-cloud/50 hover:text-cloud"
          }`}
        >
          {badge}
        </button>
      );
    })}
  </div>
);

const StringListEditor = ({ items, placeholder, addLabel, onAdd, onChange, onRemove }) => (
  <div className="space-y-3">
    {items.length > 0 ? (
      items.map((item, index) => (
        <div key={`text-item-${index}`} className="flex gap-3">
          <input
            className={inputClassName}
            value={item}
            placeholder={placeholder}
            onChange={(event) => onChange(index, event.target.value)}
          />
          <InlineActionButton
            icon={FaTrash}
            label="Remove row"
            onClick={() => onRemove(index)}
            variant="remove"
          />
        </div>
      ))
    ) : (
      <p className="rounded-xl border border-dashed border-graphite/60 px-4 py-3 text-sm text-space">
        No rows added yet.
      </p>
    )}

    <InlineActionButton icon={FaPlus} label={addLabel} onClick={onAdd} />
  </div>
);

const QuickGlanceEditor = ({
  items,
  onAdd,
  onChange,
  onRemove,
  addLabel = "Add quick fact",
  emptyMessage = "Add the three short facts shown on the vehicle card.",
}) => (
  <div className="space-y-3">
    <div className="hidden gap-3 px-1 text-xs font-bold uppercase tracking-[0.16em] text-graphite lg:grid lg:grid-cols-[1fr_220px_50px]">
      <span>Text shown to customer</span>
      <span>Icon style</span>
      <span className="sr-only">Remove row</span>
    </div>
    {items.length > 0 ? (
      items.map((item, index) => (
        <div key={`quick-glance-${index}`} className="grid gap-3 lg:grid-cols-[1fr_220px_50px]">
          <input
            className={inputClassName}
            value={item.label}
            placeholder="Example: 125 cc"
            onChange={(event) => onChange(index, "label", event.target.value)}
          />
          <select
            className={inputClassName}
            value={item.icon}
            onChange={(event) => onChange(index, "icon", event.target.value)}
          >
            {QUICK_GLANCE_ICON_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <InlineActionButton
            icon={FaTrash}
            label="Remove row"
            onClick={() => onRemove(index)}
            variant="remove"
          />
        </div>
      ))
    ) : (
      <p className="rounded-xl border border-dashed border-graphite/60 px-4 py-3 text-sm text-space">
        {emptyMessage}
      </p>
    )}

    <InlineActionButton icon={FaPlus} label={addLabel} onClick={onAdd} />
  </div>
);

const FeatureEditor = ({
  items,
  onAdd,
  onChange,
  onRemove,
  addLabel = "Add specification",
  emptyMessage = "No specifications added yet.",
}) => (
  <div className="space-y-3">
    <div className="hidden gap-3 px-1 text-xs font-bold uppercase tracking-[0.16em] text-graphite lg:grid lg:grid-cols-[220px_1fr_50px]">
      <span>Label</span>
      <span>Value shown to customer</span>
      <span className="sr-only">Remove row</span>
    </div>
    {items.length > 0 ? (
      items.map((item, index) => (
        <div key={`feature-${index}`} className="grid gap-3 lg:grid-cols-[220px_1fr_50px]">
          <input
            className={inputClassName}
            value={item.label}
            placeholder="Label"
            onChange={(event) => onChange(index, "label", event.target.value)}
          />
          <input
            className={inputClassName}
            value={item.value}
            placeholder="Value"
            onChange={(event) => onChange(index, "value", event.target.value)}
          />
          <InlineActionButton
            icon={FaTrash}
            label="Remove row"
            onClick={() => onRemove(index)}
            variant="remove"
          />
        </div>
      ))
    ) : (
      <p className="rounded-xl border border-dashed border-graphite/60 px-4 py-3 text-sm text-space">
        {emptyMessage}
      </p>
    )}

    <InlineActionButton icon={FaPlus} label={addLabel} onClick={onAdd} />
  </div>
);

const ItemWithIconEditor = ({
  items,
  onAdd,
  onChange,
  onRemove,
  addLabel = "Add row",
  emptyMessage = "No rows added yet.",
  placeholder = "Item text",
}) => (
  <div className="space-y-3">
    <div className="hidden gap-3 px-1 text-xs font-bold uppercase tracking-[0.16em] text-graphite lg:grid lg:grid-cols-[1fr_220px_50px]">
      <span>Text shown to customer</span>
      <span>Icon style</span>
      <span className="sr-only">Remove row</span>
    </div>
    {items.length > 0 ? (
      items.map((item, index) => (
        <div key={`icon-item-${index}`} className="grid gap-3 lg:grid-cols-[1fr_220px_50px]">
          <input
            className={inputClassName}
            value={item.item}
            placeholder={placeholder}
            onChange={(event) => onChange(index, "item", event.target.value)}
          />
          <select
            className={inputClassName}
            value={item.icon}
            onChange={(event) => onChange(index, "icon", event.target.value)}
          >
            {LIST_ICON_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <InlineActionButton
            icon={FaTrash}
            label="Remove row"
            onClick={() => onRemove(index)}
            variant="remove"
          />
        </div>
      ))
    ) : (
      <p className="rounded-xl border border-dashed border-graphite/60 px-4 py-3 text-sm text-space">
        {emptyMessage}
      </p>
    )}

    <InlineActionButton icon={FaPlus} label={addLabel} onClick={onAdd} />
  </div>
);

const describeCustomList = (items, usesSharedFallback = false) => {
  if (usesSharedFallback) {
    return "Shared list";
  }

  const itemCount = items?.length || 0;
  return `${itemCount} custom ${itemCount === 1 ? "item" : "items"}`;
};

const VehicleRecordCard = ({ vehicle }) => (
  <article className="rounded-2xl border border-graphite/50 bg-arsenic p-6 shadow-lg">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-graphite">{vehicle.id}</p>
        <h2 className="mt-2 text-2xl font-extrabold text-cloud">{vehicle.name}</h2>
        <p className="mt-1 text-sm text-space">Slug: {vehicle.slug}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-phantom px-3 py-1 text-xs font-semibold text-steel">
          Status: {vehicle.availability_label || vehicle.status || "available"}
        </span>
        <span className="rounded-full bg-phantom px-3 py-1 text-xs font-semibold text-steel">
          Deposit:{" "}
          {typeof vehicle.security_deposit === "number"
            ? `EUR ${vehicle.security_deposit}`
            : vehicle.security_deposit || "Not set"}
        </span>
      </div>
    </div>

    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-graphite">Badges</h3>
        <div className="mt-3">
          <MetaList items={vehicle.badges} emptyLabel="No badges" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-graphite">
          Quick Glance
        </h3>
        <div className="mt-3">
          <QuickGlanceList items={vehicle.quick_glance} />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-graphite">Overrides</h3>
        <ul className="mt-3 space-y-1 text-sm text-space">
          <li>Included: {describeCustomList(vehicle.included, !Array.isArray(vehicle.included))}</li>
          <li>
            Requirements: {describeCustomList(vehicle.requirements, !Array.isArray(vehicle.requirements))}
          </li>
          <li>Important notes: {vehicle.important_notes?.length || 0}</li>
          <li>Specifications: {vehicle.technical_features?.length || 0}</li>
        </ul>
      </div>
    </div>
  </article>
);

function AdminPage({ adminUser, getAuthToken, onLogout }) {
  const queryClient = useQueryClient();
  const [selectedEntryKey, setSelectedEntryKey] = useState("");
  const [draft, setDraft] = useState(() => createVehicleDraft());
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
          !metadataEntries.some((entry) => matchesVehicleMetadata(entry, vehicle))
      ),
    [metadataEntries, vehicles]
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
      (entry, index) => getEntryKey(entry, index) === selectedEntryKey
    );

    if (!hasSelectedEntry) {
      setSelectedEntryKey(getEntryKey(metadataEntries[0], 0));
    }
  }, [isCreatingNew, metadataEntries, selectedEntryKey]);

  const selectedMetadataIndex = useMemo(
    () =>
      metadataEntries.findIndex(
        (entry, index) => getEntryKey(entry, index) === selectedEntryKey
      ),
    [metadataEntries, selectedEntryKey]
  );

  const selectedMetadataEntry =
    selectedMetadataIndex >= 0 ? metadataEntries[selectedMetadataIndex] : null;

  useEffect(() => {
    if (!liveVehiclesWithoutMetadata.length) {
      setNewLiveVehicleId("");
      return;
    }

    const hasSelectedLiveVehicle = liveVehiclesWithoutMetadata.some(
      (vehicle) => vehicle.id === newLiveVehicleId
    );

    if (!hasSelectedLiveVehicle) {
      setNewLiveVehicleId(liveVehiclesWithoutMetadata[0].id);
    }
  }, [liveVehiclesWithoutMetadata, newLiveVehicleId]);

  const selectedNewLiveVehicle = useMemo(
    () => liveVehiclesWithoutMetadata.find((vehicle) => vehicle.id === newLiveVehicleId) || null,
    [liveVehiclesWithoutMetadata, newLiveVehicleId]
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

  const adminSummary = useMemo(() => {
    return {
      metadataEntries: metadataEntries.length,
      liveVehicles: vehicles.filter((vehicle) => !String(vehicle.id).startsWith("static-")).length,
      staticOnlyVehicles: metadataEntries.filter((vehicle) => vehicle.source === "static").length,
      commonIncluded: metadata?.common_data?.included?.length || 0,
    };
  }, [metadata, metadataEntries, vehicles]);

  const saveMutation = useMutation({
    mutationFn: async (nextMetadata) => {
      const authToken = getAuthToken ? await getAuthToken() : null;

      if (!authToken) {
        throw new Error("Your admin session has expired. Please log in again.");
      }

      return await saveFleetMetadata(nextMetadata, { authToken });
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
      [field]: currentDraft[field].map((item, itemIndex) =>
        itemIndex === index ? value : item
      ),
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
          : item
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

  const handleResetSelectedEntry = () => {
    if (isCreatingNew) {
      setDraft(
        createVehicleDraft(
          newEntryKind === "live" && selectedNewLiveVehicle
            ? createLiveVehicleMetadataTemplate(selectedNewLiveVehicle)
            : createStaticVehicleMetadataTemplate()
        )
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

  const handleSaveSelectedEntry = async () => {
    if (!metadata || !activeMetadataBase) {
      return;
    }

    setFormError("");
    setSaveMessage("");

    try {
      const updatedEntry = buildUpdatedVehicleEntry(activeMetadataBase, draft);
      const conflictingEntryIndex = metadataEntries.findIndex((entry, index) => {
        if (!isCreatingNew && index === selectedMetadataIndex) {
          return false;
        }

        return hasVehicleEntryConflict(entry, updatedEntry);
      });

      if (conflictingEntryIndex >= 0) {
        throw new Error(
          "Another metadata entry already uses the same vehicle ID, slug, or name."
        );
      }

      const nextEntries = isCreatingNew
        ? [...metadataEntries, updatedEntry]
        : metadataEntries.map((entry, index) =>
            index === selectedMetadataIndex ? updatedEntry : entry
          );
      const nextMetadata = {
        ...metadata,
        motorcycles_static_data: nextEntries,
      };

      await saveMutation.mutateAsync(nextMetadata);
      setIsCreatingNew(false);
      setNewEntryKind(null);
      setSelectedEntryKey(
        getEntryKey(updatedEntry, isCreatingNew ? nextEntries.length - 1 : selectedMetadataIndex)
      );
      setSaveMessage(
        isCreatingNew
          ? "New vehicle metadata entry saved to Netlify Blobs."
          : "Vehicle metadata saved to Netlify Blobs."
      );
    } catch (saveError) {
      setFormError(saveError.message || "Could not save the selected vehicle.");
    }
  };

  const handleDeleteSelectedEntry = async () => {
    if (!metadata || isCreatingNew || !selectedMetadataEntry || selectedMetadataIndex < 0) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${selectedMetadataEntry.name || "this vehicle"}" from the fleet metadata? This cannot be undone.`
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

      setSaveMessage("Vehicle metadata entry deleted.");
    } catch (deleteError) {
      setFormError(deleteError.message || "Could not delete the selected vehicle.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Workspace | Move Rentals</title>
        <meta
          name="description"
          content="Edit the fleet metadata document that powers the Move Rentals admin tools."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cloud">
                Admin Workspace
              </p>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-cloud sm:text-5xl">
                Fleet Metadata Editor
              </h1>
              <p className="mt-4 text-lg text-space">
                Edit the customer-facing website details for one vehicle at a time. Use this page
                to adjust cards, descriptions, rental rules, and notes without touching code.
              </p>
            </div>

            <div className="rounded-2xl border border-graphite/50 bg-arsenic p-5 shadow-lg lg:min-w-[280px]">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-graphite">
                Signed In
              </p>
              <p className="mt-2 text-lg font-semibold text-cloud">
                {adminUser?.email || "Admin user"}
              </p>
              <p className="mt-2 text-sm text-space">
                This account can create and update vehicle metadata entries.
              </p>
              <Button variant="ghost" onClick={onLogout} className="mt-5 w-full justify-center">
                Log Out
              </Button>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={FaMotorcycle}
              label="Fleet Records"
              value={vehicles.length}
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
              label="Common Included"
              value={adminSummary.commonIncluded}
              helper="Shared included-in-rental items reused across vehicles."
            />
          </div>

          <div className="mt-10 rounded-2xl border border-graphite/50 bg-arsenic p-6 shadow-lg">
            <SectionHeading
              icon={FaInfoCircle}
              title="Start Here"
              description="The form below edits only the website presentation layer. Vehicles should still be created in Twice first whenever possible."
              pills={["Guided workflow", "Non-technical"]}
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <GuidanceCard
                icon={FaMotorcycle}
                title="1. Pick a vehicle"
                description="Open an existing record or create a new one from a live Twice vehicle."
              />
              <GuidanceCard
                icon={FaSlidersH}
                title="2. Edit the public details"
                description="Most changes happen in the basic details, fleet card, and rental rules sections."
              />
              <GuidanceCard
                icon={FaEye}
                title="3. Check the preview"
                description="The preview updates instantly so you can confirm what customers will see."
              />
              <GuidanceCard
                icon={FaSave}
                title="4. Save once"
                description="Saving stores the current metadata document so the changes persist after refresh."
              />
            </div>

            <div className="mt-5 rounded-xl border border-cloud/30 bg-cloud/10 px-4 py-3 text-sm text-space">
              Most edits do not need Advanced Settings. Leave that section alone unless you are
              matching a live Twice product, changing the public URL slug, or setting a custom
              availability label.
            </div>
          </div>

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
            <div className="mt-10 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
              <section className="rounded-2xl border border-graphite/50 bg-arsenic p-6 shadow-lg">
                <div className="flex flex-col gap-6">
                  <div className={sectionCardClassName}>
                    <SectionHeading
                      icon={FaPlus}
                      title="Create A New Vehicle"
                      description="Use the live Twice option when the vehicle already exists there. Use static-only only for temporary or manual website entries."
                      pills={["Step 1"]}
                    />

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-2xl">
                        <p className="text-sm text-space">
                          Choose a vehicle from Twice below if it already exists in your booking
                          system. That keeps the website linked to the correct live record.
                        </p>
                      </div>
                      {isCreatingNew && (
                        <Button variant="ghost" onClick={handleCancelNewEntry}>
                          Cancel New Entry
                        </Button>
                      )}
                    </div>

                    <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto]">
                      <div>
                        <label className="text-sm font-bold uppercase tracking-[0.18em] text-graphite">
                          Live vehicles from Twice
                        </label>
                        <select
                          className="mt-3 w-full rounded-xl border border-graphite/60 bg-phantom px-4 py-3 text-steel outline-none transition-colors focus:border-cloud"
                          value={newLiveVehicleId}
                          onChange={(event) => setNewLiveVehicleId(event.target.value)}
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
                        onClick={handleStartNewLiveEntry}
                        disabled={!liveVehiclesWithoutMetadata.length}
                        className="justify-center self-end"
                      >
                        Create From Live Vehicle
                      </Button>
                    </div>

                    <div className="mt-4">
                      <Button variant="ghost" onClick={handleStartNewStaticEntry}>
                        Create Static-Only Vehicle
                      </Button>
                    </div>

                    {isCreatingNew && (
                      <div className="mt-5 rounded-xl border border-cloud/30 bg-cloud/10 px-4 py-3 text-sm text-space">
                        You are creating a new metadata entry. Fill in the public website details
                        below, then check the preview before saving.
                      </div>
                    )}
                  </div>

                  {!isCreatingNew && (
                    <div className={sectionCardClassName}>
                      <SectionHeading
                        icon={FaMotorcycle}
                        title="Open An Existing Vehicle"
                        description="Use this dropdown to switch between saved website records."
                        pills={["Step 1"]}
                      />

                      <FieldGroup
                        label="Selected Vehicle"
                        hint="Choose which saved metadata record you want to edit."
                      >
                        {metadataEntries.length > 0 ? (
                          <select
                            className={inputClassName}
                            value={selectedEntryKey}
                            onChange={(event) => setSelectedEntryKey(event.target.value)}
                          >
                            {metadataEntries.map((entry, index) => {
                              const key = getEntryKey(entry, index);

                              return (
                                <option key={key} value={key}>
                                  {entry.name || "Unnamed entry"} ({entry.id || entry.slug || "no id"})
                                </option>
                              );
                            })}
                          </select>
                        ) : (
                          <p className="rounded-xl border border-dashed border-graphite/60 px-4 py-3 text-sm text-space">
                            No saved metadata entries yet. Start by creating a new one above.
                          </p>
                        )}
                      </FieldGroup>
                    </div>
                  )}

                  <div className={sectionCardClassName}>
                    <SectionHeading
                      icon={FaInfoCircle}
                      title="Basic Details"
                      description="These are the main public details customers read first on the site."
                      pills={["Public website", "Step 2"]}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <FieldGroup
                        label="Vehicle Name"
                        hint="Public title shown on the card and detail page."
                      >
                        <input
                          className={inputClassName}
                          value={draft.name}
                          placeholder="Example: Tesla Model 3"
                          onChange={handleDraftChange("name")}
                        />
                      </FieldGroup>
                      <FieldGroup
                        label="Security Deposit"
                        hint="Shown on the detail page. Use only the number if possible, for example 500."
                      >
                        <input
                          className={inputClassName}
                          value={draft.securityDeposit}
                          placeholder="Example: 500"
                          onChange={handleDraftChange("securityDeposit")}
                        />
                      </FieldGroup>
                    </div>

                    <div className="mt-6">
                      <FieldGroup
                        label="Description"
                        hint="Short public paragraph shown on the detail page."
                      >
                        <textarea
                          className={textareaClassName}
                          value={draft.description}
                          placeholder="Write the short description customers should read on the vehicle page."
                          onChange={handleDraftChange("description")}
                        />
                      </FieldGroup>
                    </div>
                  </div>

                  <div className={sectionCardClassName}>
                    <SectionHeading
                      icon={FaTag}
                      title="Fleet Card"
                      description="These fields control the listing card that customers see before opening the vehicle page."
                      pills={["Card preview", "Step 2"]}
                    />

                    <FieldGroup
                      label="Badges"
                      hint="Optional labels shown on the card. Use only the ones you want customers to notice instantly."
                    >
                      <BadgeSelector value={draft.badges} onToggle={handleBadgeToggle} />
                    </FieldGroup>

                    <div className="mt-6">
                      <FieldGroup
                        label="Quick Glance"
                        hint="Keep this to three short facts. Example: 283 cv, Category B, 534 km WLTP."
                      >
                        <QuickGlanceEditor
                          items={draft.quickGlance}
                          addLabel="Add quick fact"
                          emptyMessage="Add up to three short facts for the vehicle card."
                          onAdd={() =>
                            handleAddObjectListItem("quickGlance", EMPTY_QUICK_GLANCE_ITEM)
                          }
                          onChange={(index, key, value) =>
                            handleObjectListChange("quickGlance", index, key, value)
                          }
                          onRemove={(index) => handleRemoveObjectListItem("quickGlance", index)}
                        />
                      </FieldGroup>
                    </div>
                  </div>

                  <div className={sectionCardClassName}>
                    <SectionHeading
                      icon={FaListUl}
                      title="Vehicle Detail Page"
                      description="Use this section for the longer information customers read after opening a vehicle."
                      pills={["Detail page", "Step 2"]}
                    />

                    <FieldGroup
                      label="Specifications"
                      hint="Label and value rows shown in the Specifications section of the detail page."
                    >
                      <FeatureEditor
                        items={draft.technicalFeatures}
                        addLabel="Add specification"
                        emptyMessage="Add label and value rows such as Engine, Power, or Fuel Type."
                        onAdd={() =>
                          handleAddObjectListItem("technicalFeatures", EMPTY_FEATURE_ITEM)
                        }
                        onChange={(index, key, value) =>
                          handleObjectListChange("technicalFeatures", index, key, value)
                        }
                        onRemove={(index) =>
                          handleRemoveObjectListItem("technicalFeatures", index)
                        }
                      />
                    </FieldGroup>

                    <div className="mt-6">
                      <FieldGroup
                        label="Important Notes"
                        hint="Use this for warnings, exceptions, or approval notes that customers must notice."
                      >
                        <ItemWithIconEditor
                          items={draft.importantNotes}
                          addLabel="Add important note"
                          emptyMessage="Add short notes only when the vehicle needs extra warnings or exceptions."
                          placeholder='Example: Reservation subject to approval'
                          onAdd={() => handleAddObjectListItem("importantNotes", EMPTY_LIST_ITEM)}
                          onChange={(index, key, value) =>
                            handleObjectListChange("importantNotes", index, key, value)
                          }
                          onRemove={(index) => handleRemoveObjectListItem("importantNotes", index)}
                        />
                      </FieldGroup>
                    </div>
                  </div>

                  <div className={sectionCardClassName}>
                    <SectionHeading
                      icon={FaCheckCircle}
                      title="Rental Rules"
                      description="Only switch these sections on when a vehicle needs different rental inclusions or requirements from the default shared rules."
                      pills={["Defaults available", "Step 2"]}
                    />

                    <FieldGroup
                      label="Included In Rental"
                      hint="Leave this off to use the default included list shared across the website."
                    >
                      <label className="mb-4 flex items-center justify-between rounded-xl border border-graphite/60 bg-arsenic/70 px-4 py-3">
                        <div>
                          <p className="font-semibold text-cloud">Use vehicle-specific included items</p>
                          <p className="text-sm text-space">
                            Turn this off to use the shared included list from the main metadata file.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          className="h-5 w-5 accent-cloud"
                          checked={draft.hasIncludedOverride}
                          onChange={handleToggleDraftField("hasIncludedOverride")}
                        />
                      </label>

                      {draft.hasIncludedOverride ? (
                        <ItemWithIconEditor
                          items={draft.included}
                          addLabel="Add included item"
                          emptyMessage="Add each item that is included specifically for this vehicle."
                          placeholder="Example: 300 km included"
                          onAdd={() => handleAddObjectListItem("included", EMPTY_LIST_ITEM)}
                          onChange={(index, key, value) =>
                            handleObjectListChange("included", index, key, value)
                          }
                          onRemove={(index) => handleRemoveObjectListItem("included", index)}
                        />
                      ) : (
                        <p className="rounded-xl border border-dashed border-graphite/60 px-4 py-3 text-sm text-space">
                          This vehicle will use the shared included list.
                        </p>
                      )}
                    </FieldGroup>

                    <div className="mt-8">
                      <FieldGroup
                        label="Requirements"
                        hint="Leave this off to use the default driver requirements shared across the website."
                      >
                        <label className="mb-4 flex items-center justify-between rounded-xl border border-graphite/60 bg-arsenic/70 px-4 py-3">
                          <div>
                            <p className="font-semibold text-cloud">Use vehicle-specific requirements</p>
                            <p className="text-sm text-space">
                              Turn this off to use the shared requirements list from the main metadata file.
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            className="h-5 w-5 accent-cloud"
                            checked={draft.hasRequirementsOverride}
                            onChange={handleToggleDraftField("hasRequirementsOverride")}
                          />
                        </label>

                        {draft.hasRequirementsOverride ? (
                          <ItemWithIconEditor
                            items={draft.requirements}
                            addLabel="Add requirement"
                            emptyMessage="Add only the special requirements that apply to this vehicle."
                            placeholder="Example: Minimum age: 25 years"
                            onAdd={() => handleAddObjectListItem("requirements", EMPTY_LIST_ITEM)}
                            onChange={(index, key, value) =>
                              handleObjectListChange("requirements", index, key, value)
                            }
                            onRemove={(index) => handleRemoveObjectListItem("requirements", index)}
                          />
                        ) : (
                          <p className="rounded-xl border border-dashed border-graphite/60 px-4 py-3 text-sm text-space">
                            This vehicle will use the shared requirements list.
                          </p>
                        )}
                      </FieldGroup>
                    </div>
                  </div>

                  <details className="rounded-2xl border border-graphite/50 bg-phantom/20 p-5">
                    <summary className="cursor-pointer list-none text-sm font-bold uppercase tracking-[0.18em] text-graphite">
                      Advanced Settings
                    </summary>
                    <div className="mt-6 space-y-6">
                      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                        Only change these fields if you understand why the website needs them.
                        Most day-to-day edits should be done in the sections above.
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <FieldGroup
                          label="Twice ID"
                          hint="Leave blank only for static-only vehicles. This links the website entry to the live Twice product."
                        >
                          <input
                            className={inputClassName}
                            value={draft.id}
                            placeholder="Live Twice product ID"
                            onChange={handleDraftChange("id")}
                          />
                        </FieldGroup>
                        <FieldGroup
                          label="Slug"
                          hint="Used for the public detail page URL. Change this only if you need a different public link."
                        >
                          <input
                            className={inputClassName}
                            value={draft.slug}
                            placeholder="Example: tesla-model-3"
                            onChange={handleDraftChange("slug")}
                          />
                        </FieldGroup>
                        <FieldGroup
                          label="Source"
                          hint="Choose static only if the vehicle should appear without a live Twice record."
                        >
                          <select
                            className={inputClassName}
                            value={draft.source}
                            onChange={handleDraftChange("source")}
                          >
                            {SOURCE_OPTIONS.map((option) => (
                              <option key={option.value || "empty-source"} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </FieldGroup>
                        <FieldGroup
                          label="Status"
                          hint="Optional status override for the card and details page."
                        >
                          <select
                            className={inputClassName}
                            value={draft.status}
                            onChange={handleDraftChange("status")}
                          >
                            {STATUS_OPTIONS.map((option) => (
                              <option key={option.value || "empty-status"} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </FieldGroup>
                        <FieldGroup
                          label="Availability Label"
                          hint='Optional custom badge text such as "On Demand".'
                        >
                          <input
                            className={inputClassName}
                            value={draft.availabilityLabel}
                            placeholder="Example: On Demand"
                            onChange={handleDraftChange("availabilityLabel")}
                          />
                        </FieldGroup>
                      </div>

                      <FieldGroup
                        label="Alternative Match Names"
                        hint="Only use these if the live Twice product name is different from the name shown on the website."
                      >
                        <StringListEditor
                          items={draft.matchNames}
                          placeholder="Alternative live product name"
                          addLabel="Add alternative name"
                          onAdd={() => handleAddStringListItem("matchNames")}
                          onChange={(index, value) =>
                            handleStringListChange("matchNames", index, value)
                          }
                          onRemove={(index) => handleRemoveStringListItem("matchNames", index)}
                        />
                      </FieldGroup>
                    </div>
                  </details>

                  {(formError || saveMessage) && (
                    <div
                      className={`rounded-xl border p-4 text-sm ${
                        formError
                          ? "border-red-500/40 bg-red-500/10 text-red-200"
                          : "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                      }`}
                    >
                      {formError ? formError : saveMessage}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleSaveSelectedEntry}
                      icon={FaSave}
                      className="min-w-[180px]"
                      disabled={saveMutation.isPending}
                    >
                      {saveMutation.isPending
                        ? "Saving..."
                        : isCreatingNew
                          ? "Create Vehicle Metadata"
                          : "Save Selected Vehicle"}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleResetSelectedEntry}
                      className="min-w-[160px]"
                      disabled={saveMutation.isPending}
                    >
                      Reset Changes
                    </Button>
                    {!isCreatingNew && selectedMetadataEntry && (
                      <Button
                        variant="danger"
                        icon={FaTrash}
                        onClick={handleDeleteSelectedEntry}
                        className="min-w-[160px]"
                        disabled={saveMutation.isPending}
                      >
                        Delete Vehicle
                      </Button>
                    )}
                  </div>
                </div>
              </section>

              <div className="space-y-6">
                <section className="rounded-2xl border border-graphite/50 bg-arsenic p-6 shadow-lg">
                  <SectionHeading
                    icon={FaEye}
                    title={isCreatingNew ? "New Record Preview" : "Selected Record Preview"}
                    description="This updates while you edit so you can check the customer-facing result before saving."
                    pills={["Step 3"]}
                  />

                  {!isCreatingNew && !selectedLiveVehicle && selectedMetadataEntry?.source !== "static" && (
                    <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                      The live Twice vehicle was not found in the current fetch, so this preview is
                      based only on the saved metadata fields.
                    </p>
                  )}

                  {isCreatingNew && !selectedNewLiveVehicle && draft.source !== "static" && (
                    <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                      This new entry is not linked to a live Twice vehicle yet, so the preview uses
                      metadata values only.
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

                <section className="rounded-2xl border border-graphite/50 bg-arsenic p-6 shadow-lg">
                  <SectionHeading
                    icon={FaInfoCircle}
                    title="Before You Save"
                    description="A few practical rules keep the admin workflow predictable."
                    pills={["Step 4"]}
                  />
                  <ul className="mt-4 space-y-2 text-sm text-space">
                    <li>Saving updates the current metadata document used by the site.</li>
                    <li>
                      If Blobs has never been written before, the current local `db.json` data is
                      used as the starting point.
                    </li>
                    <li>Create from a live vehicle whenever the product already exists in Twice.</li>
                    <li>Deleting a vehicle removes only its website metadata, not the live Twice product.</li>
                    <li>
                      Leave Included or Requirements switched off when the default shared lists are
                      correct for that vehicle.
                    </li>
                    <li>Advanced settings are usually only needed for IDs, matching, or custom status labels.</li>
                  </ul>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminPage;
