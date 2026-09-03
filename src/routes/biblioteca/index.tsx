import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { AddonCard, btnPrimaryClass } from "@/components/promoter/AddonCard";
import { PromoterHeader } from "@/components/site/PromoterHeader";
import { useAddonsStore } from "@/lib/addons-store";

export const Route = createFileRoute("/biblioteca/")({
  component: BibliotecaPage,
});

function BibliotecaPage() {
  const { products } = useAddonsStore();

  return (
    <div className="min-h-screen">
      <PromoterHeader />
      <main className="mx-auto max-w-5xl px-5 py-8 lg:px-8 lg:py-12">
        <div className="space-y-4">
          <div>
            <h1 className="heading-xl text-3xl lg:text-4xl">Biblioteca de add-ons</h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Productos reutilizables. Créalos aquí y asígnalos a entradas desde cada evento.
            </p>
          </div>
          <Link to="/biblioteca/nuevo" className={btnPrimaryClass}>
            <Plus className="size-5" strokeWidth={2} />
            Nuevo add-on
          </Link>
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {products.map((product) => (
            <li key={product.id}>
              <AddonCard
                product={product}
                href="/biblioteca/$addonId"
                footer={
                  <span className="text-sm font-semibold text-white">Editar →</span>
                }
              />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
