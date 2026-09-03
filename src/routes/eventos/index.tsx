import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { EventListCard } from "@/components/promoter/EventListCard";
import { PromoterHeader } from "@/components/site/PromoterHeader";
import { listPromoterEvents } from "@/lib/promoter-events";

export const Route = createFileRoute("/eventos/")({
  component: EventosPage,
});

const ctaClass =
  "inline-flex items-center justify-center gap-2 rounded-none bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90";

function EventosPage() {
  const events = listPromoterEvents();

  return (
    <div className="min-h-screen">
      <PromoterHeader />
      <main className="mx-auto max-w-5xl px-5 py-8 lg:px-8 lg:py-12">
        <div className="space-y-4">
          <div>
            <h1 className="heading-xl text-3xl lg:text-4xl">Tus eventos</h1>
            <p className="mt-2 text-muted-foreground">
              Crea y gestiona eventos, entradas y extras desde aquí.
            </p>
          </div>
          {/* Fuera del alcance del MVP: crear evento */}
          {/* <Link to="/eventos/nuevo" className={ctaClass}> */}
          <button type="button" className={ctaClass}>
            <Plus className="size-5" strokeWidth={2} />
            Nuevo evento
          </button>
          {/* </Link> */}
        </div>

        <ul className="mt-10 space-y-3">
          {events.map((event) => (
            <li key={event.id}>
              <EventListCard event={event} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
