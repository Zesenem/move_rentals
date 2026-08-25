export const inputClassName =
  "min-h-[52px] w-full min-w-0 rounded-xl border border-graphite/60 bg-phantom px-4 py-3 text-sm text-steel outline-none transition-colors focus:border-cloud sm:text-base";
export const textareaClassName = `${inputClassName} min-h-[140px] resize-y`;
export const sectionCardClassName =
  "min-w-0 rounded-2xl border border-graphite/60 bg-arsenic/70 p-5 shadow-lg shadow-phantom/20 lg:p-6";
export const addButtonClassName =
  "inline-flex min-h-[48px] w-full max-w-full items-center justify-center gap-2 rounded-xl border border-cloud/40 bg-cloud/10 px-4 py-3 text-center text-sm font-semibold leading-snug text-cloud transition-colors hover:bg-cloud/20 whitespace-normal break-words sm:w-auto";
export const removeButtonClassName =
  "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-500/40 bg-red-500/10 text-red-200 transition-colors hover:bg-red-500/20";
export const hintPillClassName =
  "inline-flex items-center rounded-full border border-graphite/60 bg-phantom px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-space";
export const adminButtonClassName =
  "min-h-[52px] max-w-full rounded-xl px-5 py-3 text-center text-sm leading-snug whitespace-normal break-words sm:w-full xl:w-auto";

export const STATUS_OPTIONS = [
  { value: "", label: "Usar estado padrão/ao vivo" },
  { value: "available", label: "Disponível" },
  { value: "unavailable", label: "Indisponível" },
  { value: "on-demand", label: "Por pedido" },
];

export const SOURCE_OPTIONS = [
  { value: "", label: "Produto em direto da Twice" },
  { value: "static", label: "Veículo apenas do site" },
];

export const VEHICLE_TYPE_OPTIONS = [
  { value: "", label: "Selecionar tipo" },
  { value: "scooter", label: "Scooter" },
  { value: "motorcycle", label: "Moto" },
  { value: "car", label: "Carro" },
  { value: "watercraft", label: "Veículo náutico" },
];

export const LICENCE_CATEGORY_OPTIONS = [
  { value: "A1", label: "A1" },
  { value: "A2", label: "A2" },
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "nautical", label: "Carta náutica" },
];

export const BADGE_OPTIONS = [
  { value: "ECO", label: "Económico" },
  { value: "Premium", label: "Premium" },
  { value: "GPS", label: "GPS" },
  { value: "Electric", label: "Elétrico" },
  { value: "Anchor", label: "Temporada de verão" },
  { value: "Nautical Licence", label: "Carta náutica" },
  { value: "Best Seller", label: "Mais popular" },
  { value: "Best Value", label: "Melhor preço" },
];

export const QUICK_GLANCE_ICON_OPTIONS = [
  { value: "engine", label: "Motor / cilindrada" },
  { value: "power", label: "Potência" },
  { value: "license", label: "Carta de condução" },
  { value: "gas", label: "Combustível / depósito" },
  { value: "mileage", label: "Quilometragem / autonomia" },
  { value: "transmission", label: "Transmissão" },
  { value: "drivetrain", label: "Tração" },
  { value: "speed", label: "Velocidade" },
  { value: "track", label: "Utilização em pista" },
];

export const LIST_ICON_OPTIONS = [
  { value: "default-check", label: "Confirmação" },
  { value: "id-card", label: "Documento de identificação" },
  { value: "license", label: "Carta de condução" },
  { value: "credit-card", label: "Cartão / caução" },
  { value: "experience", label: "Experiência" },
  { value: "helmet", label: "Capacete" },
  { value: "gloves", label: "Luvas" },
  { value: "jacket", label: "Casaco" },
  { value: "trousers", label: "Calças" },
  { value: "boots", label: "Botas" },
  { value: "lock", label: "Cacifo / cadeado" },
  { value: "tax", label: "Impostos" },
  { value: "shield", label: "Seguro" },
  { value: "users", label: "Terceiros" },
  { value: "road", label: "Estrada / quilometragem" },
  { value: "infinity", label: "Ilimitado" },
  { value: "airport", label: "Aeroporto" },
  { value: "delivery", label: "Entrega" },
  { value: "toll", label: "Portagens" },
];

export const TECHNICAL_FEATURE_OPTIONS = [
  "Engine",
  "Engine Type",
  "Displacement",
  "Power",
  "Torque",
  "Transmission",
  "Fuel Consumption",
  "Fuel Type",
  "Fuel Tank",
  "Seat Height",
  "Weight (Wet)",
  "Top Speed",
  "Drivetrain",
  "Range",
  "Battery Capacity",
  "Charging Time",
  "Dimensions",
  "Storage Capacity",
  "Rider Capacity",
  "Fuel Capacity",
  "Length",
  "Width",
  "Height",
  "Dry Weight",
  "Hull",
  "Brake & Reverse",
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
  "vehicle_type",
  "licence_categories",
  "displacement_cc",
  "luggage_capacity_l",
  "security_deposit",
  "rental_terms",
  "badges",
  "match_names",
  "quick_glance",
  "technical_features",
  "included",
  "requirements",
  "important_notes",
];
