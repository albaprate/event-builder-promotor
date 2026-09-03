import { useState, type FormEvent, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { btnPrimaryClass, btnSecondaryClass } from "@/components/promoter/AddonCard";
import {
  ADDON_CATEGORIES,
  ADDON_STATUSES,
  DEFAULT_COLORS,
  DEFAULT_MODELS,
  SHIRT_SIZES,
  type AddonProduct,
  type ShirtSize,
} from "@/lib/addons";
import { cn } from "@/lib/utils";

const fieldClass =
  "h-11 rounded-lg border-input bg-background text-base text-muted-foreground md:text-sm";
const areaClass =
  "rounded-lg border-input bg-background text-base text-muted-foreground md:text-sm";

type AddonFormProps = {
  value: AddonProduct;
  onChange: (next: AddonProduct) => void;
  onSubmit: (value: AddonProduct) => void;
  submitLabel: string;
  secondaryAction?: { label: string; onClick: () => void };
  /** Rendered after all form sections, before submit (e.g. ticket assignment) */
  afterFields?: ReactNode;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-[#121212] p-5 lg:p-6">
      <h3 className="font-sans text-sm font-semibold normal-case tracking-normal text-white">
        {title}
      </h3>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function CollapsibleSection({
  title,
  hint,
  defaultOpen = false,
  children,
}: {
  title: string;
  hint?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-xl border border-white/10 bg-[#121212]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left lg:px-6"
        aria-expanded={open}
      >
        <div>
          <h3 className="font-sans text-sm font-semibold normal-case tracking-normal text-white">
            {title}
          </h3>
          {hint && !open && (
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          )}
        </div>
        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          strokeWidth={1.75}
        />
      </button>
      {open && <div className="space-y-4 border-t border-white/10 px-5 pb-5 pt-4 lg:px-6">{children}</div>}
    </section>
  );
}

export function AddonForm({
  value,
  onChange,
  onSubmit,
  submitLabel,
  secondaryAction,
  afterFields,
}: AddonFormProps) {
  const update = (patch: Partial<AddonProduct>) => onChange({ ...value, ...patch });

  const toggleInList = <T extends string>(list: T[], item: T): T[] =>
    list.includes(item) ? list.filter((x) => x !== item) : [...list, item];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl space-y-6">
      <Section title="Información básica">
        <div className="space-y-2">
          <Label htmlFor="addon-name">Nombre *</Label>
          <Input
            id="addon-name"
            required
            value={value.name}
            onChange={(e) => update({ name: e.target.value })}
            className={fieldClass}
            placeholder="Ej. Camiseta oficial del concierto"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="addon-category">Categoría *</Label>
            <select
              id="addon-category"
              required
              value={value.category}
              onChange={(e) =>
                update({ category: e.target.value as AddonProduct["category"] })
              }
              className={cn(fieldClass, "w-full px-3")}
            >
              <option value="" disabled>
                Selecciona categoría
              </option>
              {ADDON_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="addon-status">Estado *</Label>
            <select
              id="addon-status"
              required
              value={value.status}
              onChange={(e) =>
                update({ status: e.target.value as AddonProduct["status"] })
              }
              className={cn(fieldClass, "w-full px-3")}
            >
              <option value="" disabled>
                Selecciona estado
              </option>
              {ADDON_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="addon-description">Descripción</Label>
          <Textarea
            id="addon-description"
            value={value.description}
            onChange={(e) => update({ description: e.target.value })}
            rows={3}
            className={areaClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="addon-price">Precio *</Label>
            <div className="relative">
              <Input
                id="addon-price"
                type="number"
                required
                min={0}
                step={0.5}
                value={value.price}
                onChange={(e) => update({ price: Number(e.target.value) || 0 })}
                className={cn(fieldClass, "pr-8")}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                €
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="addon-image">Imagen (URL)</Label>
            <Input
              id="addon-image"
              value={value.image ?? ""}
              onChange={(e) => update({ image: e.target.value || undefined })}
              className={fieldClass}
              placeholder="/tee-front.png"
            />
          </div>
        </div>
      </Section>

      <Section title="Stock">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="addon-unlimited">¿Stock ilimitado?</Label>
          <Switch
            id="addon-unlimited"
            checked={value.unlimitedStock}
            onCheckedChange={(unlimitedStock) => update({ unlimitedStock })}
          />
        </div>
        {!value.unlimitedStock && (
          <div className="space-y-2">
            <Label htmlFor="addon-stock">Stock disponible *</Label>
            <Input
              id="addon-stock"
              type="number"
              min={0}
              required={!value.unlimitedStock}
              value={value.stock}
              onChange={(e) => update({ stock: Number(e.target.value) || 0 })}
              className={fieldClass}
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="addon-max">Límite de unidades por pedido</Label>
          <Input
            id="addon-max"
            type="number"
            min={1}
            value={value.maxPerOrder ?? ""}
            onChange={(e) =>
              update({
                maxPerOrder: e.target.value ? Number(e.target.value) : null,
              })
            }
            className={fieldClass}
            placeholder="Sin límite"
          />
        </div>
      </Section>

      <CollapsibleSection
        title="Periodo de venta"
        hint="Opcional · fechas de inicio y fin"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="addon-start">Fecha/hora de inicio</Label>
            <Input
              id="addon-start"
              type="datetime-local"
              value={value.saleStart}
              onChange={(e) => update({ saleStart: e.target.value })}
              className={fieldClass}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addon-end">Fecha/hora de fin</Label>
            <Input
              id="addon-end"
              type="datetime-local"
              value={value.saleEnd}
              onChange={(e) => update({ saleEnd: e.target.value })}
              className={fieldClass}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="addon-soldout">Venta hasta agotar stock</Label>
          <Switch
            id="addon-soldout"
            checked={value.sellUntilSoldOut}
            onCheckedChange={(sellUntilSoldOut) => update({ sellUntilSoldOut })}
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Configuración del producto"
        hint="Opcional · variantes, tallas, colores"
        defaultOpen={value.hasVariants}
      >
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="addon-variants">¿Tiene variantes?</Label>
          <Switch
            id="addon-variants"
            checked={value.hasVariants}
            onCheckedChange={(hasVariants) => update({ hasVariants })}
          />
        </div>

        {value.hasVariants && (
          <>
            <div className="space-y-2">
              <Label>Talla</Label>
              <div className="flex flex-wrap gap-2">
                {SHIRT_SIZES.map((size) => {
                  const active = value.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      aria-pressed={active}
                      onClick={() =>
                        update({ sizes: toggleInList(value.sizes, size as ShirtSize) })
                      }
                      className={
                        active
                          ? "flex h-10 min-w-12 items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-black"
                          : "flex h-10 min-w-12 items-center justify-center rounded-lg border border-[#525252] px-4 text-sm font-semibold text-white"
                      }
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_COLORS.map((color) => {
                  const active = value.colors.includes(color);
                  return (
                    <button
                      key={color}
                      type="button"
                      aria-pressed={active}
                      onClick={() =>
                        update({ colors: toggleInList(value.colors, color) })
                      }
                      className={
                        active
                          ? "rounded-lg border border-white bg-white px-3 py-2 text-sm font-semibold text-black"
                          : "rounded-lg border border-[#525252] px-3 py-2 text-sm font-semibold text-white"
                      }
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Modelo / tipo</Label>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_MODELS.map((model) => {
                  const active = value.models.includes(model);
                  return (
                    <button
                      key={model}
                      type="button"
                      aria-pressed={active}
                      onClick={() =>
                        update({ models: toggleInList(value.models, model) })
                      }
                      className={
                        active
                          ? "rounded-lg border border-white bg-white px-3 py-2 text-sm font-semibold text-black"
                          : "rounded-lg border border-[#525252] px-3 py-2 text-sm font-semibold text-white"
                      }
                    >
                      {model}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CollapsibleSection>

      <CollapsibleSection
        title="Avisos y condiciones"
        hint="Opcional · textos visibles para el fan"
      >
        <div className="space-y-2">
          <Label htmlFor="addon-conditions">Condiciones de uso</Label>
          <Textarea
            id="addon-conditions"
            value={value.conditions}
            onChange={(e) => update({ conditions: e.target.value })}
            rows={2}
            className={areaClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="addon-restrictions">Restricciones</Label>
          <Textarea
            id="addon-restrictions"
            value={value.restrictions}
            onChange={(e) => update({ restrictions: e.target.value })}
            rows={2}
            className={areaClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="addon-important">Información importante</Label>
          <Textarea
            id="addon-important"
            value={value.importantInfo}
            onChange={(e) => update({ importantInfo: e.target.value })}
            rows={2}
            className={areaClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="addon-pickup">Instrucciones de recogida/uso</Label>
          <Textarea
            id="addon-pickup"
            value={value.pickupInstructions}
            onChange={(e) => update({ pickupInstructions: e.target.value })}
            rows={2}
            className={areaClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="addon-return">Política de devolución</Label>
          <Textarea
            id="addon-return"
            value={value.returnPolicy}
            onChange={(e) => update({ returnPolicy: e.target.value })}
            rows={2}
            className={areaClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="addon-notice">Aviso visible al usuario</Label>
          <Textarea
            id="addon-notice"
            value={value.userNotice}
            onChange={(e) => update({ userNotice: e.target.value })}
            rows={2}
            className={areaClass}
          />
        </div>
      </CollapsibleSection>

      {afterFields}

      <div className="flex flex-wrap gap-3">
        <button type="submit" className={btnPrimaryClass}>
          {submitLabel}
        </button>
        {secondaryAction && (
          <button
            type="button"
            onClick={secondaryAction.onClick}
            className={btnSecondaryClass}
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </form>
  );
}
