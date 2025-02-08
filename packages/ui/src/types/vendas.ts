import { Client } from "./client";
import { Product } from "./product";

export interface Venda {
  id:           String;
  clientId:    	String;
  client:      	Client;
  products: 	Product[];
  totalValue: 	number;
  date:     	Date;
}