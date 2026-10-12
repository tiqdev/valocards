const MEDIA_URL = "https://media.valorant-api.com";

export const cardArt = (
  cardId: string,
  size: "smallart" | "wideart" | "largeart"
) => `${MEDIA_URL}/playercards/${cardId}/${size}.png`;

export const agentIcon = (agentId: string) =>
  `${MEDIA_URL}/agents/${agentId}/displayicon.png`;

export const tierIcon = (tierSetId: string, tier: number) =>
  `${MEDIA_URL}/competitivetiers/${tierSetId}/${tier}/largeicon.png`;
