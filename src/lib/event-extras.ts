export type ExtraId = "shirt" | "bono" | "fast";

export type ShirtSize = "XS" | "S" | "M" | "L" | "XL";

export type EventExtraConfig = {
  id: ExtraId;
  enabled: boolean;
  name: string;
  description: string;
  price: number;
  pickupNote?: string;
  sizes?: ShirtSize[];
};

export const SHIRT_SIZES: ShirtSize[] = ["XS", "S", "M", "L", "XL"];

export const DEFAULT_EVENT_EXTRAS: EventExtraConfig[] = [
  {
    id: "shirt",
    enabled: true,
    name: "Camiseta oficial del concierto",
    description: "Merchandising oficial del evento. Recogida en taquilla el día del concierto.",
    price: 25,
    pickupNote: "Recogida en evento",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "bono",
    enabled: true,
    name: "Bono consumiciones",
    description: "5 consumiciones + 10 € de saldo en pulsera cashless para canjear en barra.",
    price: 20,
  },
  {
    id: "fast",
    enabled: true,
    name: "Fast lane",
    description: "Acceso por fila rápida, sin colas y 30 min antes de la apertura general.",
    price: 10,
  },
];

export function cloneDefaultExtras(): EventExtraConfig[] {
  return DEFAULT_EVENT_EXTRAS.map((extra) => ({
    ...extra,
    ...(extra.sizes ? { sizes: [...extra.sizes] } : {}),
  }));
}

export function eur(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export const EXTRA_LABELS: Record<ExtraId, string> = {
  shirt: "Merchandising",
  bono: "Consumiciones",
  fast: "Acceso",
};
