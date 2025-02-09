import { Client } from './client';
import { Product } from './product';

export interface Venda {
  id: string;
  clientId: string;
  client: Client;
  products: Product[];
  totalValue: number;
  date: Date;
}
