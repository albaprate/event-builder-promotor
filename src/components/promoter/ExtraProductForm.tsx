import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  eur,
  EXTRA_LABELS,
  SHIRT_SIZES,
  type EventExtraConfig,
  type ShirtSize,
} from "@/lib/event-extras";
import { cn } from "@/lib/utils";

type ExtraProductFormProps = {
  extra: EventExtraConfig;
  onChange: (next: EventExtraConfig) => void;
};

export function ExtraProductForm({ extra, onChange }: ExtraProductFormProps) {
  const update = (patch: Partial<EventExtraConfig>) => onChange({ ...extra, ...patch });

  const toggleSize = (size: ShirtSize) => {
    const current = extra.sizes ?? [];
    const next = current.includes(size)
      ? current.filter((s) => s !== size)
      : [...current, size];
    if (next.length > 0) {
      update({ sizes: next });
    } else {
      const { sizes: _omit, ...rest } = extra;
      onChange(rest);
    }
  };

  return (
    <article
      className={cn(
        "border p-5 transition-colors",
        extra.enabled ? "border-white" : "border-[#525252] opacity-80",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {EXTRA_LABELS[extra.id]}
          </p>
          <h3 className="mt-1 font-sans text-lg font-semibold normal-case text-white">
            {extra.name || "Sin nombre"}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor={`${extra.id}-enabled`} className="text-sm text-muted-foreground">
            {extra.enabled ? "Activo" : "Inactivo"}
          </Label>
          <Switch
            id={`${extra.id}-enabled`}
            checked={extra.enabled}
            onCheckedChange={(enabled) => update({ enabled })}
          />
        </div>
      </div>

      {extra.enabled && (
        <div className="mt-5 space-y-4 border-t border-border pt-5">
          <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
            <div className="space-y-2">
              <Label htmlFor={`${extra.id}-name`}>Nombre en checkout</Label>
              <Input
                id={`${extra.id}-name`}
                value={extra.name}
                onChange={(e) => update({ name: e.target.value })}
                className="h-11 rounded-none border-input bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${extra.id}-price`}>Precio</Label>
              <div className="relative">
                <Input
                  id={`${extra.id}-price`}
                  type="number"
                  min={0}
                  step={0.5}
                  value={extra.price}
                  onChange={(e) => update({ price: Number(e.target.value) || 0 })}
                  className="h-11 rounded-none border-input bg-background pr-8"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  €
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Fan verá {eur(extra.price)}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${extra.id}-description`}>Descripción breve</Label>
            <Textarea
              id={`${extra.id}-description`}
              value={extra.description}
              onChange={(e) => update({ description: e.target.value })}
              rows={2}
              className="min-h-0 rounded-none border-input bg-background"
            />
          </div>

          {extra.id === "shirt" && (
            <>
              <div className="space-y-2">
                <Label htmlFor={`${extra.id}-pickup`}>Nota de recogida</Label>
                <Input
                  id={`${extra.id}-pickup`}
                  value={extra.pickupNote ?? ""}
                  onChange={(e) => update({ pickupNote: e.target.value })}
                  className="h-11 rounded-none border-input bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label>Tallas disponibles</Label>
                <div className="flex flex-wrap gap-2">
                  {SHIRT_SIZES.map((size) => {
                    const active = extra.sizes?.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleSize(size)}
                        className={
                          active
                            ? "flex h-10 min-w-12 items-center justify-center bg-white px-4 text-sm font-semibold text-black"
                            : "flex h-10 min-w-12 items-center justify-center border border-[#525252] px-4 text-sm font-semibold text-white"
                        }
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </article>
  );
}
