import { Link } from "@tanstack/react-router";
import { AlignLeft, Search } from "lucide-react";
import { IMAGES } from "@/lib/images";

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-border/60 bg-background px-4 py-3 lg:px-8 lg:py-4">
      <button aria-label="Menú" className="text-foreground lg:hidden">
        <AlignLeft className="size-7" strokeWidth={1.5} />
      </button>
      <Link to="/rigoberta-bandini-maria-jaume" className="flex items-center">
        <img src={IMAGES.logo} alt="Baila.fm" width={800} height={155} className="h-6 w-auto lg:h-7" />
      </Link>
      <div className="hidden flex-1 items-center gap-2 rounded-full border border-border px-4 py-2.5 lg:flex lg:max-w-md">
        <Search className="size-5 text-muted-foreground" strokeWidth={1.5} />
        <span className="text-sm text-muted-foreground">Encuentra tu próximo plan</span>
      </div>
      <nav className="hidden items-center gap-7 text-sm font-semibold uppercase tracking-wide lg:flex">
        <span>Eventos</span>
        <span>Blog</span>
        <span>Vende tu evento</span>
        <span>Ayuda</span>
      </nav>
      <div className="flex items-center gap-3">
        <button aria-label="Buscar" className="text-foreground lg:hidden">
          <Search className="size-6" strokeWidth={1.5} />
        </button>
        <span className="flex size-9 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
          A
        </span>
      </div>
    </header>
  );
}
