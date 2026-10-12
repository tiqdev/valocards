export interface ValorantApiResponse<T> {
  status: number;
  data: T;
}

export interface PlayerTitle {
  uuid: string;
  displayName: string | null;
  titleText: string | null;
  isHiddenIfNotOwned: boolean;
  assetPath: string;
}

export interface PlayerCard {
  uuid: string;
  displayName: string;
  isHiddenIfNotOwned: boolean;
  themeUuid: string | null;
  displayIcon: string;
  smallArt: string | null;
  wideArt: string | null;
  largeArt: string | null;
  assetPath: string;
}

export interface Agent {
  uuid: string;
  displayName: string;
  description: string;
  displayIcon: string;
  displayIconSmall: string;
  fullPortrait: string | null;
  backgroundGradientColors: string[] | null;
  isPlayableCharacter: boolean;
}

export interface LevelBorder {
  uuid: string;
  displayName: string;
  startingLevel: number;
  levelNumberAppearance: string;
  smallPlayerCardAppearance: string;
  assetPath: string;
}

export interface Tier {
  tier: number;
  tierName: string;
  division: string;
  divisionName: string;
  color: string | null;
  backgroundColor: string | null;
  smallIcon: string | null;
  largeIcon: string | null;
  rankTriangleDownIcon: string | null;
  rankTriangleUpIcon: string | null;
}

export interface CompetitiveTierSet {
  uuid: string;
  assetObjectName: string;
  tiers: Tier[];
  assetPath: string;
}

export interface ContractReward {
  type: string;
  uuid: string;
  amount: number;
  isHighlighted: boolean;
}

export interface Contract {
  uuid: string;
  displayName: string;
  content: {
    relationType: "Agent" | "Event" | "Season" | null;
    relationUuid: string | null;
    chapters:
      | {
          isEpilogue: boolean;
          levels: { reward: ContractReward | null }[] | null;
          freeRewards: ContractReward[] | null;
        }[]
      | null;
  } | null;
}

export interface GameVersion {
  version: string;
  branch: string;
  buildDate: string;
}
