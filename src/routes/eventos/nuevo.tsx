import { createFileRoute, Link } from "@tanstack/react-router";
import { PromoterHeader } from "@/components/site/PromoterHeader";

export const Route = createFileRoute("/eventos/nuevo")({
  component: NuevoEventoPage,
});

function NuevoEventoPage() {
  return (
    <div className="min-h-screen">
      <PromoterHeader />
      <main className="mx-auto max-w-2xl px-5 py-8 lg:px-8 lg:py-12">
        <Link to="/eventos" className="text-sm text-muted-foreground hover:text-white">
          ← Volver a eventos
        </Link>
        <h1 className="heading-xl mt-4 text-3xl lg:text-4xl">Nuevo evento</h1>
        <p className="mt-2 text-muted-foreground">
          Base del flujo promotor: datos del evento, tipos de entrada y extras.
        </p>

        <form className="mt-8 space-y-6">
          <label className="block">
            <span className="text-sm font-semibold text-white">Nombre del evento</span>
            <input
              type="text"
              placeholder="Ej. Rigoberta Bandini + Maria Jaume"
              className="mt-2 w-full border border-input bg-background px-3 py-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-border-strong focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-white">Recinto</span>
            <input
              type="text"
              placeholder="Ej. Guíxols Arena"
              className="mt-2 w-full border border-input bg-background px-3 py-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-border-strong focus:outline-none"
            />
          </label>
          <button type="button" className="w-full bg-primary py-3 text-base font-semibold text-primary-foreground">
            Guardar borrador
          </button>
        </form>
      </main>
    </div>
  );
}
