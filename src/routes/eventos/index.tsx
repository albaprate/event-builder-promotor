import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PromoterHeader } from "@/components/site/PromoterHeader";

export const Route = createFileRoute("/eventos/")({
  component: EventosPage,
});

const ctaClass =
  "inline-flex items-center justify-center gap-2 bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90";

function EventosPage() {
  return (
    <div className="min-h-screen">
      <PromoterHeader />
      <main className="mx-auto max-w-5xl px-5 py-8 lg:px-8 lg:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="heading-xl text-3xl lg:text-4xl">Tus eventos</h1>
            <p className="mt-2 text-muted-foreground">
              Crea y gestiona eventos, entradas y extras desde aquí.
            </p>
          </div>
          <Link to="/eventos/nuevo" className={ctaClass}>
            <Plus className="size-5" strokeWidth={2} />
            Nuevo evento
          </Link>
        </div>

        <section className="mt-10 border border-[#525252] p-5">
          <p className="font-semibold text-white">Rigoberta Bandini + Maria Jaume</p>
          <p className="mt-1 text-sm text-muted-foreground">Guíxols Arena · 12 jul 2026</p>
          <p className="mt-3 text-sm text-muted-foreground">Borrador · 0 entradas vendidas</p>
        </section>
      </main>
    </div>
  );
}
