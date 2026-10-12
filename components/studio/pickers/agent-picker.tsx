"use client";

import Image from "next/image";
import { useStudioCatalog } from "@/hooks/use-studio-catalog";
import { agentIcon } from "@/lib/card/assets";
import { toAccentColor, withAlpha } from "@/lib/card/color";
import { cn } from "@/lib/utils";
import { useCardStore } from "@/stores/card-store";
import type { Catalog } from "@/types/catalog";

const selectAgents = (catalog: Catalog) => catalog.agents;

export const AgentPicker = () => {
  const agentId = useCardStore((state) => state.config.agentId);
  const update = useCardStore((state) => state.update);
  const { data: agents = [] } = useStudioCatalog(selectAgents);

  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-4">
      {agents.map((agent) => {
        const selected = agent.id === agentId;
        const accent = toAccentColor(agent.colors[0] ?? "#57ddc5");

        return (
          <button
            key={agent.id}
            type="button"
            aria-pressed={selected}
            onClick={() => update({ agentId: agent.id })}
            className={cn(
              "group flex flex-col items-center gap-1 rounded-sm border p-1.5 outline-none transition focus-visible:ring-2 focus-visible:ring-ring",
              selected
                ? "border-primary bg-primary/10"
                : "border-transparent hover:border-border hover:bg-muted"
            )}
          >
            <span
              className="corner-cut-sm relative aspect-square w-full overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(to top, ${withAlpha(accent, selected ? 0.6 : 0.3)}, transparent)`,
              }}
            >
              <Image
                src={agentIcon(agent.id)}
                alt=""
                fill
                unoptimized
                className={cn(
                  "object-contain transition-all duration-300 group-hover:scale-105",
                  !selected && "grayscale-[60%] group-hover:grayscale-0"
                )}
              />
            </span>
            <span
              className={cn(
                "w-full truncate text-center font-display text-xs uppercase tracking-wider",
                selected ? "text-primary" : "text-muted-foreground"
              )}
            >
              {agent.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};
