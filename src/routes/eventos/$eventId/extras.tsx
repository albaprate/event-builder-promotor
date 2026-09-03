import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Plus, Library, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  AddonCard,
  AddonIcon,
  btnPrimaryClass,
  btnSecondaryClass,
} from "@/components/promoter/AddonCard";
import { AddonForm } from "@/components/promoter/AddonForm";
import { TicketAssignmentPicker } from "@/components/promoter/TicketAssignmentPicker";
import { EventDetailShell } from "@/components/site/EventDetailShell";
import {
  categoryLabel,
  createEmptyAddonForm,
  eur,
  type AddonAssignment,
  type AddonProduct,
  type TicketType,
} from "@/lib/addons";
import {
  assignAddonToEvent,
  getAddon,
  getAssignmentsForEvent,
  getTicketTypesForEvent,
  removeAddonFromTicket,
  updateAssignmentTickets,
  upsertAddon,
  useAddonsStore,
} from "@/lib/addons-store";
import { getPromoterEvent } from "@/lib/promoter-events";

export const Route = createFileRoute("/eventos/$eventId/extras")({
  beforeLoad: ({ params }) => {
    const event = getPromoterEvent(params.eventId);
    if (!event) throw notFound();
  },
  component: EventExtrasPage,
});

type Mode = "list" | "from-library" | "create-new" | "edit-assignment";

type TicketGroup = {
  ticket: TicketType;
  rows: {
    asg: AddonAssignment;
    product: AddonProduct;
  }[];
};

function EventExtrasPage() {
  const { eventId } = Route.useParams();
  const event = getPromoterEvent(eventId)!;
  const store = useAddonsStore();

  const tickets = getTicketTypesForEvent(eventId);
  const assignments = getAssignmentsForEvent(eventId);

  const ticketGroups: TicketGroup[] = useMemo(
    () =>
      tickets.map((ticket) => ({
        ticket,
        rows: assignments
          .filter((asg) => asg.ticketTypeIds.includes(ticket.id))
          .map((asg) => {
            const product = getAddon(asg.addonId);
            if (!product) return null;
            return { asg, product };
          })
          .filter(Boolean) as TicketGroup["rows"],
      })),
    [tickets, assignments, store.products],
  );

  const [mode, setMode] = useState<Mode>("list");
  const [selectedAddonId, setSelectedAddonId] = useState<string | null>(null);
  const [ticketIds, setTicketIds] = useState<string[]>([]);
  const [newForm, setNewForm] = useState<AddonProduct>(() => createEmptyAddonForm());
  const [editingAsgId, setEditingAsgId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [focusTicketId, setFocusTicketId] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const id = window.setTimeout(() => setMessage(null), 3500);
    return () => window.clearTimeout(id);
  }, [message]);

  const resetToList = () => {
    setMode("list");
    setSelectedAddonId(null);
    setTicketIds([]);
    setEditingAsgId(null);
    setFocusTicketId(null);
    setNewForm(createEmptyAddonForm());
  };

  const startFromLibrary = (preferredTicketId?: string) => {
    setMessage(null);
    setMode("from-library");
    setSelectedAddonId(null);
    setFocusTicketId(preferredTicketId ?? null);
    setTicketIds(
      preferredTicketId
        ? [preferredTicketId]
        : tickets[0]
          ? [tickets[0].id]
          : [],
    );
  };

  const startCreateNew = (preferredTicketId?: string) => {
    setMessage(null);
    setMode("create-new");
    setNewForm(createEmptyAddonForm());
    setFocusTicketId(preferredTicketId ?? null);
    setTicketIds(
      preferredTicketId
        ? [preferredTicketId]
        : tickets[0]
          ? [tickets[0].id]
          : [],
    );
  };

  const startEditAssignment = (asgId: string, currentTickets: string[]) => {
    setMessage(null);
    setEditingAsgId(asgId);
    setTicketIds(currentTickets);
    setMode("edit-assignment");
  };

  const focusTicketName = focusTicketId
    ? tickets.find((t) => t.id === focusTicketId)?.name
    : null;

  return (
    <EventDetailShell event={event} activeTab="extras">
      {mode === "list" && (
        <div className="space-y-8">
          <div>
            <h2 className="heading-xl text-2xl">Entradas y add-ons</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Los add-ons se asignan a cada tipo de entrada.
            </p>
          </div>

          {message && (
            <p
              role="status"
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400"
            >
              {message}
            </p>
          )}

          {tickets.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/15 p-8 text-center">
              <p className="text-muted-foreground">
                Este evento no tiene tipos de entrada. Configúralos antes de asignar add-ons.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {ticketGroups.map(({ ticket, rows }) => (
                <section
                  key={ticket.id}
                  className="rounded-xl border border-white/10 bg-[#121212] p-5 lg:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-sans text-lg font-semibold normal-case tracking-normal text-white">
                        {ticket.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {eur(ticket.price)} · {rows.length}{" "}
                        {rows.length === 1 ? "add-on" : "add-ons"}
                      </p>
                    </div>
                    <div className="ml-auto flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startFromLibrary(ticket.id)}
                        className={btnSecondaryClass}
                      >
                        <Library className="size-4" strokeWidth={2} />
                        Añadir de biblioteca
                      </button>
                      <button
                        type="button"
                        onClick={() => startCreateNew(ticket.id)}
                        className={btnPrimaryClass}
                      >
                        <Plus className="size-4" strokeWidth={2} />
                        Crear add-on
                      </button>
                    </div>
                  </div>

                  {rows.length === 0 ? (
                    <p className="mt-5 text-sm text-muted-foreground">
                      Ningún add-on asignado a esta entrada.
                    </p>
                  ) : (
                    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                      {rows.map(({ asg, product }) => (
                        <li key={`${asg.id}-${ticket.id}`}>
                          <div className="flex h-full items-start gap-4 rounded-xl border border-white/10 bg-black/40 p-4">
                            <AddonIcon
                              category={product.category}
                              image={product.image}
                            />
                            <div className="flex min-w-0 flex-1 flex-col">
                              <p className="font-sans text-base font-semibold text-white">
                                {product.name}
                              </p>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {categoryLabel(product.category)} · {eur(product.price)}
                              </p>
                              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                                <button
                                  type="button"
                                  onClick={() =>
                                    startEditAssignment(asg.id, asg.ticketTypeIds)
                                  }
                                  className="font-semibold text-white hover:underline"
                                >
                                  Cambiar asignaciones
                                </button>
                                <Link
                                  to="/biblioteca/$addonId"
                                  params={{ addonId: product.id }}
                                  className="font-semibold text-white hover:underline"
                                >
                                  Editar
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => {
                                    removeAddonFromTicket(asg.id, ticket.id);
                                    setMessage(
                                      `“${product.name}” quitado de ${ticket.name}.`,
                                    );
                                  }}
                                  className="font-semibold text-muted-foreground hover:text-red-400"
                                >
                                  Quitar
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          )}
        </div>
      )}

      {mode === "from-library" && (
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="heading-xl text-2xl">Añadir desde biblioteca</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {focusTicketName
                  ? `Asigna un add-on de la biblioteca a “${focusTicketName}” (puedes incluir más entradas).`
                  : "Elige un add-on que ya tienes creado y asígnalo a las entradas de este evento."}
              </p>
            </div>
            <button
              type="button"
              onClick={resetToList}
              className="text-muted-foreground hover:text-white"
              aria-label="Cerrar"
            >
              <X className="size-5" />
            </button>
          </div>

          {store.products.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-[#121212] p-6">
              <p className="text-sm text-muted-foreground">
                La biblioteca está vacía.
              </p>
              <button
                type="button"
                onClick={() => startCreateNew(focusTicketId ?? undefined)}
                className={`mt-4 ${btnPrimaryClass}`}
              >
                <Plus className="size-4" strokeWidth={2} />
                Crear uno nuevo
              </button>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <p className="font-sans text-sm font-semibold text-white">
                  Add-ons de la biblioteca
                </p>
                <ul className="space-y-2">
                  {store.products.map((product) => {
                    const selected = selectedAddonId === product.id;
                    const alreadyOnFocus =
                      focusTicketId &&
                      assignments.some(
                        (a) =>
                          a.addonId === product.id &&
                          a.ticketTypeIds.includes(focusTicketId),
                      );
                    return (
                      <li key={product.id}>
                        <button
                          type="button"
                          disabled={Boolean(alreadyOnFocus)}
                          onClick={() => setSelectedAddonId(product.id)}
                          className={`w-full text-left disabled:opacity-40 ${
                            selected ? "rounded-xl ring-1 ring-white" : ""
                          }`}
                        >
                          <AddonCard
                            product={product}
                            meta={
                              alreadyOnFocus
                                ? `Ya asignado a ${focusTicketName}`
                                : undefined
                            }
                          />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="space-y-6">
                <div className="rounded-xl border border-white/10 bg-[#121212] p-5">
                  <TicketAssignmentPicker
                    tickets={tickets}
                    selectedIds={ticketIds}
                    onChange={setTicketIds}
                  />
                </div>
                <button
                  type="button"
                  disabled={!selectedAddonId || ticketIds.length === 0}
                  onClick={() => {
                    if (!selectedAddonId) return;
                    assignAddonToEvent({
                      addonId: selectedAddonId,
                      eventId,
                      ticketTypeIds: ticketIds,
                    });
                    const name = getAddon(selectedAddonId)?.name ?? "Add-on";
                    setMessage(`“${name}” asignado a las entradas seleccionadas.`);
                    resetToList();
                  }}
                  className={`${btnPrimaryClass} w-full disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  Asignar a entradas
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === "create-new" && (
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="heading-xl text-2xl">Crear add-on</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Se guarda en la biblioteca y se asigna a las entradas que elijas de este evento.
              </p>
            </div>
            <button
              type="button"
              onClick={resetToList}
              className="text-muted-foreground hover:text-white"
              aria-label="Cerrar"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="mx-auto max-w-2xl space-y-6">
            <AddonForm
              value={newForm}
              onChange={setNewForm}
              submitLabel="Crear y asignar"
              secondaryAction={{ label: "Cancelar", onClick: resetToList }}
              afterFields={
                <div className="rounded-xl border border-white/10 bg-[#121212] p-5">
                  <TicketAssignmentPicker
                    tickets={tickets}
                    selectedIds={ticketIds}
                    onChange={setTicketIds}
                  />
                </div>
              }
              onSubmit={(value) => {
                if (ticketIds.length === 0) {
                  setMessage("Selecciona al menos una entrada.");
                  return;
                }
                const created = upsertAddon(value);
                assignAddonToEvent({
                  addonId: created.id,
                  eventId,
                  ticketTypeIds: ticketIds,
                });
                setMessage(`“${created.name}” creado y asignado a este evento.`);
                resetToList();
              }}
            />
          </div>
        </div>
      )}

      {mode === "edit-assignment" && editingAsgId && (
        <div className="mx-auto max-w-lg space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="heading-xl text-2xl">Asignación a entradas</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Elige a qué entradas de este evento va ligado el add-on.
              </p>
            </div>
            <button
              type="button"
              onClick={resetToList}
              className="text-muted-foreground hover:text-white"
              aria-label="Cerrar"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#121212] p-5">
            <TicketAssignmentPicker
              tickets={tickets}
              selectedIds={ticketIds}
              onChange={setTicketIds}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              updateAssignmentTickets(editingAsgId, ticketIds);
              setMessage(
                ticketIds.length === 0
                  ? "Add-on desasignado del evento."
                  : "Asignación de entradas actualizada.",
              );
              resetToList();
            }}
            className={`${btnPrimaryClass} w-full`}
          >
            Guardar asignaciones
          </button>
        </div>
      )}
    </EventDetailShell>
  );
}
