import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AddonForm } from "@/components/promoter/AddonForm";
import { PromoterHeader } from "@/components/site/PromoterHeader";
import { getEventTitle, type AddonProduct } from "@/lib/addons";
import {
  getAddon,
  getAssignmentsForAddon,
  upsertAddon,
  useAddonsStore,
} from "@/lib/addons-store";

export const Route = createFileRoute("/biblioteca/$addonId")({
  beforeLoad: ({ params }) => {
    const product = getAddon(params.addonId);
    if (!product) throw notFound();
  },
  component: EditAddonPage,
});

function EditAddonPage() {
  const { addonId } = Route.useParams();
  const navigate = useNavigate();
  const store = useAddonsStore();
  const product = store.products.find((p) => p.id === addonId)!;
  const [form, setForm] = useState<AddonProduct>(product);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(product);
  }, [product]);

  const uses = getAssignmentsForAddon(addonId);

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
        <h1 className="heading-xl mt-4 text-3xl lg:text-4xl">{product.name}</h1>
        <p className="mt-2 text-muted-foreground">
          Edita el producto de la biblioteca. Los cambios afectan a todos los eventos donde se use.
        </p>

        {saved && (
          <p
            role="status"
            className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400"
          >
            Add-on actualizado.
          </p>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,42rem)_260px] lg:justify-between">
          <AddonForm
            value={form}
            onChange={(next) => {
              setForm(next);
              setSaved(false);
            }}
            submitLabel="Guardar cambios"
            secondaryAction={{
              label: "Volver",
              onClick: () => navigate({ to: "/biblioteca" }),
            }}
            onSubmit={(value) => {
              upsertAddon(value);
              setSaved(true);
            }}
          />

          <aside>
            <div className="sticky top-28 rounded-xl border border-white/10 bg-[#121212] p-5">
              <p className="font-sans text-sm font-semibold text-white">
                Eventos donde se usa
              </p>
              {uses.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Aún no está asignado. Ábrelo desde un evento para asignarlo a entradas.
                </p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {uses.map((use) => (
                    <li
                      key={use.id}
                      className="rounded-lg border border-white/10 px-3 py-3"
                    >
                      <p className="text-sm font-semibold text-white">
                        {getEventTitle(use.eventId)}
                      </p>
                      <Link
                        to="/eventos/$eventId/extras"
                        params={{ eventId: use.eventId }}
                        className="mt-3 inline-block text-sm font-semibold text-white hover:underline"
                      >
                        Modificar asignaciones →
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
