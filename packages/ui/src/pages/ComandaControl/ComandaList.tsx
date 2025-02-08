import React from "react";
import { Comanda } from "../../types/comanda";

interface ComandaListProps {
	comandas: Comanda[];
	onSelectComanda: (comanda: Comanda) => void;
	calculateTotal: (comanda: Comanda) => number;
}

export const ComandaList: React.FC<ComandaListProps> = ({
	comandas,
	onSelectComanda,
	calculateTotal,
}) => {
	return (
		<div className="comanda-list">
			<h2>Comandas Abertas</h2>
			{comandas.map((comanda) => (
				<div
					key={comanda.id}
					className="comanda-item"
					onClick={() => onSelectComanda(comanda)}
				>
					<span>Comanda #{comanda.id}</span>
					<span>Total: R$ {calculateTotal(comanda).toFixed(2)}</span>
				</div>
			))}
		</div>
	);
};
