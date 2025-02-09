import React from 'react';
import { useState } from 'react';
import { Comanda, ComandaItem } from '../../types/comanda';

interface ComandaFormProps {
  comanda: Comanda;
  onAddItem: (item: ComandaItem) => void;
}

export const ComandaForm: React.FC<ComandaFormProps> = ({ comanda, onAddItem }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: ComandaItem = {
      id: Date.now(),
      name,
      price: Number.parseFloat(price),
      quantity: Number.parseInt(quantity)
    };
    onAddItem(newItem);
    setName('');
    setPrice('');
    setQuantity('');
  };

  return (
    <div className="comanda-form">
      <h2>Adicionar Item à Comanda #{comanda.id}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nome do item" value={name} onChange={(e) => setName(e.target.value)} required />
        <input
          type="number"
          placeholder="Preço"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          step="0.01"
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <button type="submit">Adicionar Item</button>
      </form>
      <div className="comanda-items">
        <h3>Itens da Comanda</h3>
        {comanda.items.map((item) => (
          <div key={item.id} className="comanda-item">
            <span>{item.name}</span>
            <span>
              R$ {item.price.toFixed(2)} x {item.quantity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
