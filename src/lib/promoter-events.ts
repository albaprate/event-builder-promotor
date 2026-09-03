import { IMAGES } from "@/lib/images";

export type EventStatus = "draft" | "published";

export type PromoterEvent = {
  id: string;
  title: string;
  dateLong: string;
  dateShort: string;
  venue: string;
  festival?: string;
  status: EventStatus;
  ticketsSold: number;
  hero?: string;
  /** URL pública fan (opcional) */
  fanUrl?: string;
};

export const PROMOTER_EVENTS: Record<string, PromoterEvent> = {
  "rigoberta-bandini-maria-jaume": {
    id: "rigoberta-bandini-maria-jaume",
    title: "Rigoberta Bandini + Maria Jaume",
    dateLong: "Viernes 14 de agosto de 2026 · 22:00",
    dateShort: "14 ago 2026",
    venue: "Guíxols Arena · Sant Feliu de Guíxols",
    festival: "64 Festival Porta Ferrada Occident",
    status: "draft",
    ticketsSold: 0,
    hero: IMAGES.hero,
    fanUrl: "http://localhost:8080/rigoberta-bandini-maria-jaume",
  },
  "premier-padel-finals-2026": {
    id: "premier-padel-finals-2026",
    title: "Cuartos de Final Jueves · Qatar Airways Premier Padel Finals 2026",
    dateLong: "Jueves 10 de diciembre de 2026 · 13:00",
    dateShort: "jue, 10 dic 2026, 13:00",
    venue: "Palau Sant Jordi · Barcelona",
    status: "published",
    ticketsSold: 5456,
    hero: IMAGES.premierPadel,
  },
  "ivan-herzog-madrid-2026": {
    id: "ivan-herzog-madrid-2026",
    title: "Ivan Herzog",
    dateLong: "Sábado 21 de marzo de 2026 · 21:00",
    dateShort: "21 mar 2026",
    venue: "La Riviera · Madrid",
    status: "published",
    ticketsSold: 892,
    hero: IMAGES.ivanHerzog,
  },
  "jungle-madrid-2026-10-26": {
    id: "jungle-madrid-2026-10-26",
    title: "Jungle",
    dateLong: "Domingo 26 de octubre de 2026 · 20:30",
    dateShort: "26 oct 2026",
    venue: "WiZink Center · Madrid",
    status: "published",
    ticketsSold: 3241,
    hero: IMAGES.jungle,
  },
};

export function getPromoterEvent(eventId: string): PromoterEvent | undefined {
  return PROMOTER_EVENTS[eventId];
}

export function listPromoterEvents(): PromoterEvent[] {
  return Object.values(PROMOTER_EVENTS).sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "draft" ? -1 : 1;
    }
    return a.title.localeCompare(b.title, "es");
  });
}

export function formatTicketsSold(count: number): string {
  if (count === 0) return "0 entradas vendidas";
  return `${count.toLocaleString("es-ES")} entradas vendidas`;
}

export function formatEventStatus(status: EventStatus): string {
  return status === "published" ? "Publicado" : "Borrador";
}
