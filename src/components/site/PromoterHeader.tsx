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
