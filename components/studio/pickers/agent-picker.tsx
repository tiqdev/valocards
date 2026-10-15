"use client";

import { AgentGrid } from "@/components/pickers/agent-grid";
import { useCardStore } from "@/stores/card-store";

export const AgentPicker = () => {
  const agentId = useCardStore((state) => state.config.agentId);
  const update = useCardStore((state) => state.update);

  return (
    <AgentGrid
      selectedId={agentId}
      onSelect={(agent) => update({ agentId: agent.id })}
    />
  );
};
