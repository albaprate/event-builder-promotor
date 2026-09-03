import { Link } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import {
  formatEventStatus,
  formatTicketsSold,
  type PromoterEvent,
} from "@/lib/promoter-events";

type EventListCardProps = {
  event: PromoterEvent;
};

function statusBadgeClass(status: PromoterEvent["status"]) {
  return status === "published"
    ? "border-transparent bg-[#9EF2C0] text-black"
    : "border-transparent bg-white/10 font-semibold text-white";
}

export function EventListCard({ event }: EventListCardProps) {
  const initials = event.title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <Link
      to="/eventos/$eventId/extras"
      params={{ eventId: event.id }}
      className="flex gap-4 rounded-xl border border-white/10 bg-[#121212] p-4 transition-colors hover:border-white/25"
    >
      {event.hero ? (
        <img
          src={event.hero}
          alt=""
          width={72}
          height={72}
          className="size-[4.5rem] shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div
          aria-hidden
          className="flex size-[4.5rem] shrink-0 items-center justify-center rounded-lg bg-white/5 text-sm font-semibold text-muted-foreground"
        >
          {initials}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <Badge
          variant="outline"
          className={`mb-2 w-fit sm:hidden ${statusBadgeClass(event.status)}`}
        >
          {formatEventStatus(event.status)}
        </Badge>

        <div className="flex items-start justify-between gap-3">
          <p className="w-full min-w-0 font-sans font-semibold text-white sm:w-auto">
            {event.title}
          </p>
          <Badge
            variant="outline"
            className={`hidden shrink-0 sm:inline-flex ${statusBadgeClass(event.status)}`}
          >
            {formatEventStatus(event.status)}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {event.venue.split(" · ")[0]} · {event.dateShort}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {formatTicketsSold(event.ticketsSold)}
        </p>
        {event.id === "rigoberta-bandini-maria-jaume" && (
          <p className="mt-2 text-sm font-semibold text-white">Configurar extras →</p>
        )}
      </div>
    </Link>
  );
}
