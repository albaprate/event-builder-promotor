import { IMAGES } from "@/lib/images";
import { getPromoterEvent } from "@/lib/promoter-events";

export type AddonCategory = "merchandising" | "consumiciones" | "acceso" | "otros";
export type AddonStatus = "draft" | "active" | "inactive";

export type ShirtSize = "XS" | "S" | "M" | "L" | "XL";

export type AddonProduct = {
  id: string;
  name: string;
  category: AddonCategory | "";
  description: string;
  image: string;
  price: number;
  status: AddonStatus | "";
  stock: number;
  maxPerOrder: number | null;
  unlimitedStock: boolean;
  saleStart: string;
  saleEnd: string;
  sellUntilSoldOut: boolean;
  hasVariants: boolean;
  sizes: ShirtSize[];
  colors: string[];
  models: string[];
  conditions: string;
  restrictions: string;
  importantInfo: string;
  pickupInstructions: string;
  returnPolicy: string;
  userNotice: string;
};

/** Asignación: solo desde un evento, a una o más entradas de ese evento. */
export type AddonAssignment = {
  id: string;
  addonId: string;
  eventId: string;
  ticketTypeIds: string[];
};

export type TicketType = {
  id: string;
  eventId: string;
  name: string;
  price: number;
};

export const ADDON_CATEGORIES: { value: AddonCategory; label: string }[] = [
  { value: "merchandising", label: "Merchandising" },
  { value: "consumiciones", label: "Consumiciones" },
  { value: "acceso", label: "Acceso" },
  { value: "otros", label: "Otros" },
];

export const ADDON_STATUSES: { value: AddonStatus; label: string }[] = [
  { value: "draft", label: "Borrador" },
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
];

export const SHIRT_SIZES: ShirtSize[] = ["XS", "S", "M", "L", "XL"];
export const DEFAULT_COLORS = ["Negro", "Blanco"];
export const DEFAULT_MODELS = ["Botella 50cl", "Botella 75cl"];

export const RIGOBERTA_EVENT_ID = "rigoberta-bandini-maria-jaume";
export const RIGOBERTA_GENERAL_TICKET_ID = "rigoberta-entrada-general";

export const SEED_TICKET_TYPES: TicketType[] = [
  {
    id: RIGOBERTA_GENERAL_TICKET_ID,
    eventId: RIGOBERTA_EVENT_ID,
    name: "Entrada General",
    price: 45,
  },
  {
    id: "rigoberta-vip",
    eventId: RIGOBERTA_EVENT_ID,
    name: "Entrada VIP",
    price: 75,
  },
  {
    id: "premier-general",
    eventId: "premier-padel-finals-2026",
    name: "Entrada General",
    price: 35,
  },
  {
    id: "ivan-general",
    eventId: "ivan-herzog-madrid-2026",
    name: "Entrada General",
    price: 28,
  },
  {
    id: "jungle-pista",
    eventId: "jungle-madrid-2026-10-26",
    name: "Pista",
    price: 55,
  },
];

function emptyAddon(overrides: Partial<AddonProduct> & Pick<AddonProduct, "id" | "name">): AddonProduct {
  return {
    category: "otros",
    description: "",
    image: "",
    price: 0,
    status: "draft",
    stock: 0,
    maxPerOrder: 1,
    unlimitedStock: false,
    saleStart: "",
    saleEnd: "",
    sellUntilSoldOut: false,
    hasVariants: false,
    sizes: [],
    colors: [],
    models: [],
    conditions: "",
    restrictions: "",
    importantInfo: "",
    pickupInstructions: "",
    returnPolicy: "",
    userNotice: "",
    ...overrides,
  };
}

export const SEED_ADDONS: AddonProduct[] = [
  emptyAddon({
    id: "addon-camiseta",
    name: "Camiseta oficial del concierto",
    category: "merchandising",
    description: "Merchandising oficial del evento. Recogida en taquilla el día del concierto.",
    image: IMAGES.teeFront,
    price: 25,
    status: "active",
    stock: 500,
    maxPerOrder: 1,
    unlimitedStock: false,
    sellUntilSoldOut: true,
    hasVariants: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Negro"],
    pickupInstructions: "Recogida en evento",
    userNotice: "Elige talla al comprar. Recogida en taquilla merch.",
  }),
  emptyAddon({
    id: "addon-bono",
    name: "Bono consumiciones",
    category: "consumiciones",
    description: "5 consumiciones + 10 € de saldo en pulsera cashless para canjear en barra.",
    price: 20,
    status: "active",
    stock: 0,
    maxPerOrder: 1,
    unlimitedStock: true,
    sellUntilSoldOut: false,
    hasVariants: false,
    conditions: "El saldo no usado se reembolsa en 7 días laborales.",
    userNotice: "Se carga en la pulsera al acceder al recinto.",
  }),
  emptyAddon({
    id: "addon-fast",
    name: "Fast lane",
    category: "acceso",
    description: "Acceso por fila rápida, sin colas y 30 min antes de la apertura general.",
    price: 10,
    status: "active",
    stock: 200,
    maxPerOrder: 1,
    unlimitedStock: false,
    sellUntilSoldOut: true,
    hasVariants: false,
    importantInfo: "Entrada prioritaria por puerta independiente.",
    userNotice: "Lleva el código QR visible al acceso fast lane.",
  }),
];

/** Rigoberta: los 3 add-ons asignados a Entrada General. */
export const SEED_ASSIGNMENTS: AddonAssignment[] = [
  {
    id: "asg-camiseta-rigoberta",
    addonId: "addon-camiseta",
    eventId: RIGOBERTA_EVENT_ID,
    ticketTypeIds: [RIGOBERTA_GENERAL_TICKET_ID],
  },
  {
    id: "asg-bono-rigoberta",
    addonId: "addon-bono",
    eventId: RIGOBERTA_EVENT_ID,
    ticketTypeIds: [RIGOBERTA_GENERAL_TICKET_ID],
  },
  {
    id: "asg-fast-rigoberta",
    addonId: "addon-fast",
    eventId: RIGOBERTA_EVENT_ID,
    ticketTypeIds: [RIGOBERTA_GENERAL_TICKET_ID],
  },
];

export function createEmptyAddonForm(): AddonProduct {
  return emptyAddon({
    id: "",
    name: "",
    category: "",
    status: "",
    stock: 100,
    maxPerOrder: 1,
  });
}

export function eur(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function categoryLabel(category: AddonCategory | ""): string {
  if (!category) return "Sin categoría";
  return ADDON_CATEGORIES.find((c) => c.value === category)?.label ?? category;
}

export function statusLabel(status: AddonStatus | ""): string {
  if (!status) return "Sin estado";
  return ADDON_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function getEventTitle(eventId: string): string {
  return getPromoterEvent(eventId)?.title ?? eventId;
}
