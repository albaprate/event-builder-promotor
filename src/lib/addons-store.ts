import { useSyncExternalStore } from "react";

import {
  SEED_ADDONS,
  SEED_ASSIGNMENTS,
  SEED_TICKET_TYPES,
  type AddonAssignment,
  type AddonProduct,
  type TicketType,
} from "@/lib/addons";

type AddonsState = {
  products: AddonProduct[];
  assignments: AddonAssignment[];
  ticketTypes: TicketType[];
};

let state: AddonsState = {
  products: structuredClone(SEED_ADDONS),
  assignments: structuredClone(SEED_ASSIGNMENTS),
  ticketTypes: structuredClone(SEED_TICKET_TYPES),
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(next: AddonsState) {
  state = next;
  emit();
}

export function subscribeAddons(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAddonsSnapshot(): AddonsState {
  return state;
}

export function useAddonsStore() {
  return useSyncExternalStore(subscribeAddons, getAddonsSnapshot, getAddonsSnapshot);
}

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function upsertAddon(product: AddonProduct): AddonProduct {
  const existing = state.products.find((p) => p.id === product.id);
  if (existing) {
    setState({
      ...state,
      products: state.products.map((p) => (p.id === product.id ? product : p)),
    });
    return product;
  }
  const created = { ...product, id: product.id || newId("addon") };
  setState({ ...state, products: [created, ...state.products] });
  return created;
}

export function getAddon(addonId: string): AddonProduct | undefined {
  return state.products.find((p) => p.id === addonId);
}

export function getTicketTypesForEvent(eventId: string): TicketType[] {
  return state.ticketTypes.filter((t) => t.eventId === eventId);
}

export function getAssignmentsForEvent(eventId: string): AddonAssignment[] {
  return state.assignments.filter((a) => a.eventId === eventId);
}

export function getAssignmentsForAddon(addonId: string): AddonAssignment[] {
  return state.assignments.filter((a) => a.addonId === addonId);
}

export function assignAddonToEvent(input: {
  addonId: string;
  eventId: string;
  ticketTypeIds: string[];
}): AddonAssignment {
  const existing = state.assignments.find(
    (a) => a.addonId === input.addonId && a.eventId === input.eventId,
  );

  if (existing) {
    const updated = { ...existing, ticketTypeIds: [...input.ticketTypeIds] };
    setState({
      ...state,
      assignments: state.assignments.map((a) => (a.id === existing.id ? updated : a)),
    });
    return updated;
  }

  const created: AddonAssignment = {
    id: newId("asg"),
    addonId: input.addonId,
    eventId: input.eventId,
    ticketTypeIds: [...input.ticketTypeIds],
  };
  setState({ ...state, assignments: [...state.assignments, created] });
  return created;
}

export function removeAssignment(assignmentId: string) {
  setState({
    ...state,
    assignments: state.assignments.filter((a) => a.id !== assignmentId),
  });
}

export function updateAssignmentTickets(assignmentId: string, ticketTypeIds: string[]) {
  if (ticketTypeIds.length === 0) {
    removeAssignment(assignmentId);
    return;
  }
  setState({
    ...state,
    assignments: state.assignments.map((a) =>
      a.id === assignmentId ? { ...a, ticketTypeIds: [...ticketTypeIds] } : a,
    ),
  });
}

/** Quita un add-on de una entrada concreta. Si no queda ninguna, elimina la asignación. */
export function removeAddonFromTicket(assignmentId: string, ticketTypeId: string) {
  const asg = state.assignments.find((a) => a.id === assignmentId);
  if (!asg) return;
  updateAssignmentTickets(
    assignmentId,
    asg.ticketTypeIds.filter((id) => id !== ticketTypeId),
  );
}
