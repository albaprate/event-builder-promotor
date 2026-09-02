#!/usr/bin/env bash
# Duplica event-builder-plus como base del lado promotor (admin).
# Uso: desde la raíz del repo fan → ./scripts/setup-promotor-project.sh

set -euo pipefail

SOURCE="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${1:-$(dirname "$SOURCE")/event-builder-promotor}"

if [[ -e "$TARGET" ]]; then
  echo "Error: ya existe $TARGET"
  echo "Borra la carpeta o pasa otra ruta: ./scripts/setup-promotor-project.sh /ruta/destino"
  exit 1
fi

echo "→ Copiando $SOURCE → $TARGET"
rsync -a \
  --exclude node_modules \
  --exclude .git \
  --exclude dist \
  --exclude .vite \
  --exclude .lovable \
  "$SOURCE/" "$TARGET/"

echo "→ Eliminando rutas y componentes del flujo fan"
rm -f "$TARGET/src/routes/checkout.tsx"
rm -f "$TARGET/src/routes/entradas.tsx"
rm -f "$TARGET/src/routes/rigoberta-bandini-maria-jaume.tsx"
rm -f "$TARGET/src/components/site/ExtraCard.tsx"
rm -f "$TARGET/src/components/site/SizePicker.tsx"
rm -f "$TARGET/src/lib/cart.ts"

echo "→ Creando rutas promotor"
mkdir -p "$TARGET/src/routes/eventos"

cat > "$TARGET/src/routes/index.tsx" <<'EOF'
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/eventos" });
  },
});
EOF

cat > "$TARGET/src/routes/eventos/index.tsx" <<'EOF'
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
EOF

cat > "$TARGET/src/routes/eventos/nuevo.tsx" <<'EOF'
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
EOF

cat > "$TARGET/src/components/site/PromoterHeader.tsx" <<'EOF'
import { Link } from "@tanstack/react-router";
import { IMAGES } from "@/lib/images";

export function PromoterHeader() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-border/60 bg-background px-4 py-3 lg:px-8 lg:py-4">
      <Link to="/eventos" className="flex items-center">
        <img src={IMAGES.logo} alt="Baila.fm" width={800} height={155} className="h-6 w-auto lg:h-7" />
      </Link>
      <nav className="hidden items-center gap-7 text-sm font-semibold uppercase tracking-wide lg:flex">
        <Link to="/eventos" className="text-white">
          Eventos
        </Link>
        <span className="text-muted-foreground">Ventas</span>
        <span className="text-muted-foreground">Ajustes</span>
      </nav>
      <span className="flex size-9 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
        P
      </span>
    </header>
  );
}
EOF

echo "→ Actualizando package.json y README"
node -e "
const fs = require('fs');
const p = JSON.parse(fs.readFileSync('$TARGET/package.json', 'utf8'));
p.name = 'event-builder-promotor';
fs.writeFileSync('$TARGET/package.json', JSON.stringify(p, null, 2) + '\n');
"

cat > "$TARGET/README.md" <<'EOF'
# Event Builder Promotor

Base del **lado promotor** (admin) para Baila.fm. Duplicado desde `event-builder-plus` (flujo fan).

## Qué incluye

- Mismo design system (tipografías, colores, componentes UI)
- Rutas iniciales: `/eventos`, `/eventos/nuevo`
- Sin checkout, entradas ni carrito del flujo fan

## Desarrollo

```sh
cd event-builder-promotor
npm i
npm run dev
```

Abre `http://localhost:8080/` → redirige a `/eventos`.

## Repo

Crea un repo nuevo en GitHub (ej. `event-builder-promotor`) y sube:

```sh
git init -b main
git add -A && git commit -m "Initial promoter base from fan project"
git remote add origin git@github.com:TU_USUARIO/event-builder-promotor.git
git push -u origin main
```
EOF

rm -f "$TARGET/src/routeTree.gen.ts"

echo "→ Inicializando git"
cd "$TARGET"
git init -b main
git add -A
git commit -m "Initial promoter base duplicated from event-builder-plus fan flow."

echo ""
echo "✓ Proyecto promotor listo en: $TARGET"
echo ""
echo "Siguiente:"
echo "  cd \"$TARGET\""
echo "  npm i && npm run dev"
echo "  # Crear repo en GitHub y git remote add origin ... && git push -u origin main"
