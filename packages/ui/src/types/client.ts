import { Venda } from "./vendas";

export interface Client {
	id: number;
	name: string;
	phone: string;
	email: string;
	address: string;
	createdAt: Date;
	vendas: Venda[];
}