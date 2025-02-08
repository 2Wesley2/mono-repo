export interface ComandaItem {
	id: number;
	name: string;
	price: number;
	quantity: number;
}

export interface Comanda {
	id: number;
	items: ComandaItem[];
}

export type Category =
	| "REFEIÇÕES"
	| "GERAL"
	| "BEBIDAS"
	| "SALGADOS"
	| "LANCHES";
