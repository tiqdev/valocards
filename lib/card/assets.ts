const MEDIA_URL = "https://media.valorant-api.com";

export const cardArt = (
  cardId: string,
  size: "smallart" | "wideart" | "largeart"
) => `${MEDIA_URL}/playercards/${cardId}/${size}.png`;

export const agentIcon = (agentId: string) =>
  `${MEDIA_URL}/agents/${agentId}/displayicon.png`;

export const tierIcon = (tierSetId: string, tier: number) =>
  `${MEDIA_URL}/competitivetiers/${tierSetId}/${tier}/largeicon.png`;

export const agentPortrait = (agentId: string) =>
  `${MEDIA_URL}/agents/${agentId}/fullportrait.png`;

export const sprayIcon = (sprayId: string) =>
  `${MEDIA_URL}/sprays/${sprayId}/fulltransparenticon.png`;
