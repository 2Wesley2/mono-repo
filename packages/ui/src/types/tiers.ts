export interface Tier {
  id: number;
  minValue: number;
  creditValue: number;
}

export interface TierListProps {
  tiers: Tier[];
  setTiers: React.Dispatch<React.SetStateAction<Tier[]>>;
}

export interface TierListPropsUI {
  tiers: Tier[];
  editingTier: { [id: number]: boolean };
  onToggleEditing: (id: number) => void;
  onChange: (id: number, field: string, value: number) => void;
}
