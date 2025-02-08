import React from "react";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NavBar from "../../components/NavBar/NavBar";
import "./finance.css";

interface Payment {
	id: number;
	date: string;
	description: string;
	amount: number;
	status: "completed" | "pending" | "failed";
}

const FinancePage: React.FC = () => {
	const [payments, setPayments] = useState<Payment[]>([
		{
			id: 1,
			date: "04/02/2025",
			description: "Pagamento de fornecedor",
			amount: 1500.0,
			status: "completed",
		},
		{
			id: 2,
			date: "24/01/2025",
			description: "Salário funcionário",
			amount: 2000.0,
			status: "completed",
		},
		{
			id: 3,
			date: "10/01/2025",
			description: "Aluguel",
			amount: 3000.0,
			status: "pending",
		},
		{
			id: 4,
			date: "15/12/2024",
			description: "Conta de luz",
			amount: 500.0,
			status: "failed",
		},
		{
			id: 5,
			date: "10/12/2024",
			description: "Manutenção equipamentos",
			amount: 800.0,
			status: "completed",
		},
	]);

	const [filters, setFilters] = useState({
		startDate: "",
		endDate: "",
		minAmount: "",
		maxAmount: "",
		status: "",
	});

	const handleFilterChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFilters((prev) => ({ ...prev, [name]: value }));
	};

	const filteredPayments = payments.filter((payment) => {
		return (
			(!filters.startDate || payment.date   >=  filters.startDate) &&
			(!filters.endDate 	|| payment.date   <=  filters.endDate) &&
			(!filters.minAmount || payment.amount >=  Number.parseFloat(filters.minAmount)) &&
			(!filters.maxAmount || payment.amount <=  Number.parseFloat(filters.maxAmount)) &&
			(!filters.status 	|| payment.status === filters.status)
		);
	});

	return (
		<div className="row-page">
			<NavBar />
			<main className="mainContent-dash">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold">Histórico Financeiro</h1>
				</div>

				<div className="financial-container">
					<div className="filters">
						<div className="filter-item">
							<label htmlFor="startDate">Data Inicial</label>
							<input
								type="date"
								id="startDate"
								name="startDate"
								value={filters.startDate}
								onChange={handleFilterChange}
							/>
						</div>
						<div className="filter-item">
							<label htmlFor="endDate">Data Final</label>
							<input
								type="date"
								id="endDate"
								name="endDate"
								value={filters.endDate}
								onChange={handleFilterChange}
							/>
						</div>
						<div className="filter-item">
							<label htmlFor="minAmount">Valor Mínimo</label>
							<input
								type="number"
								id="minAmount"
								name="minAmount"
								value={filters.minAmount}
								onChange={handleFilterChange}
							/>
						</div>
						<div className="filter-item">
							<label htmlFor="maxAmount">Valor Máximo</label>
							<input
								type="number"
								id="maxAmount"
								name="maxAmount"
								value={filters.maxAmount}
								onChange={handleFilterChange}
							/>
						</div>
						<div className="filter-item">
							<label htmlFor="status">Status</label>
							<select
								id="status"
								name="status"
								value={filters.status}
								onChange={handleFilterChange}
							>
								<option value="">Todos</option>
								<option value="completed">Concluído</option>
								<option value="pending">Pendente</option>
								<option value="failed">Falhou</option>
							</select>
						</div>
					</div>

					<div className="overflow-x-auto">
						<table className="payment-table">
							<thead>
								<tr>
									<th>Data</th>
									<th>Descrição</th>
									<th>Valor</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{filteredPayments.map((payment) => (
									<tr key={payment.id}>
										<td>{payment.date}</td>
										<td>{payment.description}</td>
										<td>R$ {payment.amount.toFixed(2)}</td>
										<td>
											<span className={`status-badge status-${payment.status}`}>
												{payment.status === "completed" && "Concluído"}
												{payment.status === "pending" && "Pendente"}
												{payment.status === "failed" && "Falhou"}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="pagination">
						<button disabled>
							<ChevronLeft size={18} />
						</button>
						<span className="mx-4">Página 1 de 1</span>
						<button disabled>
							<ChevronRight size={18} />
						</button>
					</div>
				</div>
			</main>
		</div>
	);
};

export default FinancePage;
