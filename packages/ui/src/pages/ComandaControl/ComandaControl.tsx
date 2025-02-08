"use client";

import React from "react";
import { useState } from "react";
import { Search } from "lucide-react";
import "./ComandaControl.css";
import { Category, Comanda } from "../../types/comanda";
import { Product } from "../../types/product";
import NavBar from "../../components/NavBar/NavBar";
import PaymentButton from "../../components/payment/PaymentButton";

const CATEGORIES: Category[] = [
	"REFEIÇÕES",
	"GERAL",
	"BEBIDAS",
	"SALGADOS",
	"LANCHES",
];

const SAMPLE_PRODUCTS: Product[] = [
	{ id: 1, name: "Massa ao molho branco", price: 50.0, category: "REFEIÇÕES" },
	{ id: 2, name: "File ao molho madeira", price: 80.0, category: "REFEIÇÕES" },
	{ id: 3, name: "Lasanha", price: 40.0, category: "REFEIÇÕES" },
	{ id: 4, name: "Peixe com anchovas", price: 70.0, category: "REFEIÇÕES" },

	{ id: 5, name: "Refri", price: 7.0, category: "BEBIDAS" },
	{ id: 6, name: "Água", price: 5.0, category: "BEBIDAS" },
	{ id: 7, name: "Suco", price: 10.0, category: "BEBIDAS" },
	{ id: 8, name: "Cerveja", price: 12.0, category: "BEBIDAS" },

	{ id: 9, name: "Pão de queijo", price: 5.0, category: "SALGADOS" },
	{ id: 10, name: "Pastel assado", price: 9.0, category: "SALGADOS" },
	{ id: 11, name: "Pastel frito", price: 9.0, category: "SALGADOS" },

	{ id: 12, name: "Sanduíche", price: 10.0, category: "LANCHES" },
];

export const ComandaControlPage: React.FC = () => {
	const [searchComanda, setSearchComanda] = useState("");
	const [selectedCategory, setSelectedCategory] =
		useState<Category>("REFEIÇÕES");
	const [currentComanda, setCurrentComanda] = useState<Comanda>({
		id: 1,
		items: [],
	});

	const addItemToComanda = (product: Product) => {
		const existingItem = currentComanda.items.find(
			(item) => item.id === product.id
		);

		if (existingItem) {
			setCurrentComanda({
				...currentComanda,
				items: currentComanda.items.map((item) =>
					item.id === product.id
						? { ...item, quantity: item.quantity + 1 }
						: item
				),
			});
		} else {
			setCurrentComanda({
				...currentComanda,
				items: [...currentComanda.items, { ...product, quantity: 1 }],
			});
		}
	};

	const calculateTotal = () => {
		return currentComanda.items.reduce(
			(total, item) => total + item.price * item.quantity,
			0
		);
	};

	const filteredProducts = SAMPLE_PRODUCTS.filter(
		(product) => product.category === selectedCategory
	);

	const handlePaymentComplete = () => {
		setCurrentComanda({ id: currentComanda.id + 1, items: [] });
	};

	return (
		<div className="row-page">
			<NavBar />
			<div className="comanda-control">
				<div className="comanda-header">
					<h1>Comanda {currentComanda.id} aberta</h1>
					<div className="search-container">
						<input
							type="text"
							value={searchComanda}
							onChange={(e) => setSearchComanda(e.target.value)}
							placeholder="Buscar comanda..."
						/>
						<button className="search-button">
							<Search className="search-icon" />
						</button>
					</div>
				</div>

				<div className="comanda-content">
					<table className="comanda-table">
						<thead>
							<tr>
								<th>PRODUTO</th>
								<th>QUANTIDADE</th>
								<th>(R$) VALOR UNITÁRIO</th>
							</tr>
						</thead>
						<tbody>
							{currentComanda.items.map((item) => (
								<tr key={item.id}>
									<td>{item.name}</td>
									<td>{item.quantity}</td>
									<td>{item.price.toFixed(2)}</td>
								</tr>
							))}
						</tbody>
					</table>

					<div className="total-container">
						<span>Total: R$ {calculateTotal().toFixed(2)}</span>
						<PaymentButton
							total={calculateTotal()}
							onPaymentComplete={handlePaymentComplete}
						/>
					</div>
				</div>

				<div className="products-section">
					<div className="category-tabs">
						{CATEGORIES.map((category) => (
							<button
								key={category}
								className={`category-tab ${
									selectedCategory === category ? "active" : ""
								}`}
								onClick={() => setSelectedCategory(category)}
							>
								{category}
							</button>
						))}
					</div>

					<div className="products-grid">
						{filteredProducts.map((product) => (
							<button
								key={product.id}
								className="product-button"
								onClick={() => addItemToComanda(product)}
							>
								{product.name}
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
