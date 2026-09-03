import { Link } from "@tanstack/react-router";
import { IMAGES } from "@/lib/images";

export function PromoterHeader() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-border/60 bg-background px-4 py-3 lg:px-8 lg:py-4">
      <Link to="/eventos" className="flex items-center">
        <img
          src={IMAGES.proLogo}
          alt="Baila.pro"
          width={165}
          height={32}
          className="h-6 w-auto lg:h-8"
        />
      </Link>
      <nav className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wide sm:gap-7 sm:text-sm">
        <Link
          to="/eventos"
          className="text-muted-foreground transition-colors hover:text-white"
          activeProps={{ className: "text-white" }}
        >
          Eventos
        </Link>
        <Link
          to="/biblioteca"
          className="text-muted-foreground transition-colors hover:text-white"
          activeProps={{ className: "text-white" }}
        >
          Biblioteca
        </Link>
        <span className="hidden text-muted-foreground sm:inline">Ventas</span>
      </nav>
      <span className="flex size-9 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
        P
      </span>
    </header>
  );
}
