import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { PromoterHeader } from "@/components/site/PromoterHeader";
import type { PromoterEvent } from "@/lib/promoter-events";

type EventTab = "extras";

type EventDetailShellProps = {
  event: PromoterEvent;
  activeTab: EventTab;
  children: ReactNode;
};

export function EventDetailShell({ event, activeTab, children }: EventDetailShellProps) {
  return (
    <div className="min-h-screen">
      <PromoterHeader />
      <main className="mx-auto max-w-5xl px-5 py-6 lg:px-8 lg:py-10">
        <Link
          to="/eventos"
          className="text-sm text-muted-foreground transition-colors hover:text-white"
        >
          ← Eventos
        </Link>

        <div className="mt-6 flex items-start gap-4">
          {event.hero ? (
            <img
              src={event.hero}
              alt=""
              width={80}
              height={80}
              className="size-20 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div
              aria-hidden
              className="flex size-20 shrink-0 items-center justify-center rounded-lg bg-surface text-lg font-semibold text-muted-foreground"
            >
              {event.title
                .split(/\s+/)
                .slice(0, 2)
                .map((word) => word[0])
                .join("")}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <h1 className="heading-xl min-w-0 text-2xl lg:text-3xl">{event.title}</h1>
              <Badge
                variant="outline"
                className={
                  event.status === "published"
                    ? "shrink-0 border-transparent bg-[#9EF2C0] text-black"
                    : "shrink-0 border-transparent bg-white/10 font-semibold text-white"
                }
              >
                {event.status === "published" ? "Publicado" : "Borrador"}
              </Badge>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <p className="text-sm font-semibold text-white">{event.dateLong}</p>
              {event.fanUrl && (
                <a
                  href={event.fanUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-base font-semibold text-white transition-opacity hover:opacity-80"
                >
                  <ExternalLink className="size-4" strokeWidth={2} />
                  Ver evento
                </a>
              )}
            </div>
            <p className="text-sm font-semibold text-white">{event.venue}</p>
            {event.festival && (
              <p className="text-sm text-muted-foreground">{event.festival}</p>
            )}
          </div>
        </div>

        <nav
          aria-label="Secciones del evento"
          className="mt-8 flex gap-6 overflow-x-auto border-b border-border text-sm font-semibold uppercase tracking-wide"
        >
          <span className="shrink-0 pb-3 text-muted-foreground/50">Información</span>
          <Link
            to="/eventos/$eventId/extras"
            params={{ eventId: event.id }}
            aria-current={activeTab === "extras" ? "page" : undefined}
            className={
              activeTab === "extras"
                ? "shrink-0 border-b-2 border-white pb-3 text-white"
                : "shrink-0 pb-3 text-muted-foreground transition-colors hover:text-white"
            }
          >
            Entradas
          </Link>
          <span className="shrink-0 pb-3 text-muted-foreground/50">Pedidos</span>
          <span className="shrink-0 pb-3 text-muted-foreground/50">Informes</span>
        </nav>

        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}
