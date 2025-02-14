import React, { useState } from 'react';
import { TierList } from '../../ui/tierList';
import { TierListProps } from '../../types/tiers';

export const TierListUI: React.FC<TierListProps> = ({ tiers, setTiers }) => {
  const [editingTier, setEditingTier] = useState<{ [id: string]: boolean }>({}); // alterado para string

  const handleInputChange = (id: string, field: string, value: number) => {
    setTiers((prevTiers) => prevTiers.map((tier) => (tier.id === id ? { ...tier, [field]: value } : tier)));
  };

  const toggleEditingTier = (id: string) => {
    setEditingTier((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <TierList
      tiers={tiers}
      editingTier={editingTier}
      onToggleEditing={toggleEditingTier}
      onChange={handleInputChange}
    />
  );
};
