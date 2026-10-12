"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useStudioCatalog } from "@/hooks/use-studio-catalog";
import { tierIcon } from "@/lib/card/assets";
import { cn } from "@/lib/utils";
import { useCardStore } from "@/stores/card-store";
import type { Catalog, CatalogTier } from "@/types/catalog";

const selectTiers = (catalog: Catalog) => ({
  tierSetId: catalog.tierSetId,
  tiers: catalog.tiers,
});

export const RankPicker = () => {
  const selectedTier = useCardStore((state) => state.config.tier);
  const update = useCardStore((state) => state.update);
  const { data } = useStudioCatalog(selectTiers);

  // Rank'ler ligine göre gruplanır: Demir 1-2-3, Bronz 1-2-3 ...
  const divisions = useMemo(() => {
    const groups = new Map<string, CatalogTier[]>();
    for (const tier of data?.tiers ?? []) {
      groups.set(tier.division, [...(groups.get(tier.division) ?? []), tier]);
    }
    return [...groups.entries()];
  }, [data?.tiers]);

  if (!data) return null;

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 lg:grid-cols-2">
      {divisions.map(([division, tiers]) => (
        <div key={division} className="flex flex-col gap-2">
          <span className="font-display text-xs uppercase tracking-widest text-muted-foreground">
            {division}
          </span>
          <div className="flex gap-1.5">
            {tiers.map((tier) => {
              const selected = tier.tier === selectedTier;

              return (
                <button
                  key={tier.tier}
                  type="button"
                  title={tier.name}
                  aria-label={tier.name}
                  aria-pressed={selected}
                  onClick={() => update({ tier: tier.tier })}
                  className={cn(
                    "relative size-14 rounded-sm border p-1.5 outline-none transition focus-visible:ring-2 focus-visible:ring-ring",
                    selected
                      ? "border-primary bg-primary/10"
                      : "border-transparent opacity-60 hover:border-border hover:bg-muted hover:opacity-100"
                  )}
                >
                  <Image
                    src={tierIcon(data.tierSetId, tier.tier)}
                    alt=""
                    width={44}
                    height={44}
                    unoptimized
                    className="size-full object-contain"
                  />
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
