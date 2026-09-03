import type { TicketType } from "@/lib/addons";
import { eur } from "@/lib/addons";
import { cn } from "@/lib/utils";

type TicketAssignmentPickerProps = {
  tickets: TicketType[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  className?: string;
};

export function TicketAssignmentPicker({
  tickets,
  selectedIds,
  onChange,
  className,
}: TicketAssignmentPickerProps) {
  const toggle = (id: string) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id],
    );
  };

  if (tickets.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Este evento no tiene tipos de entrada configurados.
      </p>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <p className="font-sans text-sm font-semibold text-white">Asignar a entradas *</p>
      <p className="text-sm text-muted-foreground">
        Los add-ons solo se asignan a entradas desde el evento. Elige al menos una.
      </p>
      <ul className="space-y-2">
        {tickets.map((ticket) => {
          const checked = selectedIds.includes(ticket.id);
          return (
            <li key={ticket.id}>
              <label
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-4 py-3 transition-colors",
                  checked ? "border-white bg-white/5" : "border-white/15 hover:border-white/40",
                )}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(ticket.id)}
                    className="size-4 accent-[#7637E5]"
                  />
                  <span className="text-sm font-semibold text-white">{ticket.name}</span>
                </span>
                <span className="text-sm text-muted-foreground">{eur(ticket.price)}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
