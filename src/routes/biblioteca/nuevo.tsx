import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { AddonForm } from "@/components/promoter/AddonForm";
import { PromoterHeader } from "@/components/site/PromoterHeader";
import { createEmptyAddonForm, type AddonProduct } from "@/lib/addons";
import { upsertAddon } from "@/lib/addons-store";

export const Route = createFileRoute("/biblioteca/nuevo")({
  component: NuevoAddonPage,
});

function NuevoAddonPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<AddonProduct>(() => createEmptyAddonForm());

  return (
    <div className="min-h-screen">
      <PromoterHeader />
      <main className="mx-auto max-w-5xl px-5 py-8 lg:px-8 lg:py-12">
        <Link
          to="/biblioteca"
          className="text-sm text-muted-foreground transition-colors hover:text-white"
        >
          ← Biblioteca
        </Link>
        <h1 className="heading-xl mt-4 text-3xl lg:text-4xl">Nuevo add-on</h1>
        <p className="mt-2 text-muted-foreground">
          Se guarda en la biblioteca. Luego podrás asignarlo a entradas desde un evento.
        </p>

        <div className="mt-8">
          <AddonForm
            value={form}
            onChange={setForm}
            submitLabel="Crear add-on"
            secondaryAction={{
              label: "Cancelar",
              onClick: () => navigate({ to: "/biblioteca" }),
            }}
            onSubmit={(value) => {
              const created = upsertAddon(value);
              navigate({
                to: "/biblioteca/$addonId",
                params: { addonId: created.id },
              });
            }}
          />
        </div>
      </main>
    </div>
  );
}
