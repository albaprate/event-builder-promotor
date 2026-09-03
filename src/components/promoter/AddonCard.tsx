import { Link } from "@tanstack/react-router";
import { CupSoda, Package, Shirt, Zap, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import {
  categoryLabel,
  eur,
  type AddonCategory,
  type AddonProduct,
} from "@/lib/addons";
import { cn } from "@/lib/utils";

const CATEGORY_ICON: Record<
  AddonCategory,
  { Icon: LucideIcon; color: string; bg: string }
> = {
  merchandising: {
    Icon: Shirt,
    color: "text-[#C77DFF]",
    bg: "bg-[#C77DFF]/15",
  },
  consumiciones: {
    Icon: CupSoda,
    color: "text-[#FF4D9E]",
    bg: "bg-[#FF4D9E]/15",
  },
  acceso: {
    Icon: Zap,
    color: "text-[#4DA3FF]",
    bg: "bg-[#4DA3FF]/15",
  },
  otros: {
    Icon: Package,
    color: "text-[#9EF2C0]",
    bg: "bg-[#9EF2C0]/15",
  },
};

export const btnPrimaryClass =
  "inline-flex items-center justify-center gap-2 rounded-none bg-primary px-4 py-3 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90";

export const btnSecondaryClass =
  "inline-flex items-center justify-center gap-2 rounded-none border border-white/20 px-4 py-3 text-base font-semibold text-white transition-colors hover:border-white";

export function AddonIcon({
  category,
  image,
  className,
}: {
  category: AddonCategory | "";
  image?: string;
  className?: string;
}) {
  if (image) {
    return (
      <img
        src={image}
        alt=""
        className={cn(
          "size-[4.5rem] shrink-0 rounded-lg object-cover bg-surface",
          className,
        )}
      />
    );
  }

  const { Icon, color, bg } = CATEGORY_ICON[category || "otros"];
  return (
    <div
      aria-hidden
      className={cn(
        "flex size-[4.5rem] shrink-0 items-center justify-center rounded-lg",
        bg,
        className,
      )}
    >
      <Icon className={cn("size-6", color)} strokeWidth={1.75} />
    </div>
  );
}

type AddonCardProps = {
  product: AddonProduct;
  meta?: string;
  footer?: ReactNode;
  href?: string;
  className?: string;
};

export function AddonCard({ product, meta, footer, href, className }: AddonCardProps) {
  const body = (
    <>
      <AddonIcon category={product.category} image={product.image} />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="font-sans text-base font-semibold text-white">{product.name}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {categoryLabel(product.category)} · {eur(product.price)}
        </p>
        {meta && <p className="mt-1 text-sm text-muted-foreground">{meta}</p>}
        {footer && (
          <div className="mt-2 flex items-center gap-4 self-start">{footer}</div>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        to={href}
        params={{ addonId: product.id }}
        className={cn(
          "flex h-full items-start gap-4 rounded-xl border border-white/10 bg-[#121212] p-4 transition-colors hover:border-white/25",
          className,
        )}
      >
        {body}
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "flex h-full items-start gap-4 rounded-xl border border-white/10 bg-[#121212] p-4",
        className,
      )}
    >
      {body}
    </div>
  );
}
