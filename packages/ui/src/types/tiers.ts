export interface Tier {
  id: string; // alterado de number para string
  minValue: number;
  creditValue: number;
}

export interface TierListProps {
  tiers: Tier[];
  setTiers: React.Dispatch<React.SetStateAction<Tier[]>>;
}

export interface TierFieldProps {
  label: string;
  fieldId: string;
  value: number;
  editing: boolean;
  onChange: (value: number) => void;
  className?: string;
}

export interface TierListPropsUI {
  tiers: Tier[];
  editingTier: { [id: string]: boolean };
  onToggleEditing: (id: string) => void;
  onChange: (id: string, field: string, value: number) => void;
}
