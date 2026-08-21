export const inputClassName =
  "min-h-[52px] w-full min-w-0 rounded-xl border border-graphite/60 bg-phantom px-4 py-3 text-sm text-steel outline-none transition-colors focus:border-cloud sm:text-base";
export const textareaClassName = `${inputClassName} min-h-[140px] resize-y`;
export const sectionCardClassName =
  "min-w-0 rounded-2xl border border-graphite/50 bg-phantom/40 p-5 shadow-sm lg:p-6";
export const addButtonClassName =
  "inline-flex min-h-[48px] w-full max-w-full items-center justify-center gap-2 rounded-xl border border-cloud/40 bg-cloud/10 px-4 py-3 text-center text-sm font-semibold leading-snug text-cloud transition-colors hover:bg-cloud/20 whitespace-normal break-words sm:w-auto";
export const removeButtonClassName =
  "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-500/40 bg-red-500/10 text-red-200 transition-colors hover:bg-red-500/20";
export const hintPillClassName =
  "inline-flex items-center rounded-full border border-graphite/60 bg-phantom px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-space";
export const adminButtonClassName =
  "min-h-[52px] max-w-full rounded-xl px-5 py-3 text-center text-sm leading-snug whitespace-normal break-words sm:w-full xl:w-auto";

export const STATUS_OPTIONS = [
  { value: "", label: "Use live/default status" },
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
  { value: "on-demand", label: "On Demand" },
];

export const SOURCE_OPTIONS = [
  { value: "", label: "Live product from Twice" },
  { value: "static", label: "Static-only vehicle" },
];

export const BADGE_OPTIONS = ["ECO", "Premium", "GPS", "Electric", "Best Seller", "Best Value"];

export const QUICK_GLANCE_ICON_OPTIONS = [
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

export const LIST_ICON_OPTIONS = [
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

export const EMPTY_QUICK_GLANCE_ITEM = { label: "", icon: "engine" };
export const EMPTY_FEATURE_ITEM = { label: "", value: "" };
export const EMPTY_LIST_ITEM = { item: "", icon: "default-check" };

export const PREVIEW_EDITABLE_KEYS = [
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
