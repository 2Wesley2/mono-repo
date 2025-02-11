interface Tier {
  id: number;
  minValue: number;
  creditValue: number;
}

export interface TierListProps {
  tiers: Tier[];
  setTiers: React.Dispatch<React.SetStateAction<Tier[]>>;
}
