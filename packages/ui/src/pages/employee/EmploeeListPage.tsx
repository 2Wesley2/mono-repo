import React from "react";
import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import "./EmployeeListPage.css";
import NavBar from "../../components/NavBar/NavBar";

interface Employee {
	id: number;
	name: string;
	position: string;
	department: string;
	email: string;
}

const EmployeeListPage: React.FC = () => {
	const [employees, setEmployees] = useState<Employee[]>([
		{
			id: 1,
			name: "João Silva",
			position: "Gerente",
			department: "Vendas",
			email: "joao@example.com",
		},
		{
			id: 2,
			name: "Maria Santos",
			position: "Analista",
			department: "RH",
			email: "maria@example.com",
		},
		{
			id: 3,
			name: "Carlos Oliveira",
			position: "Desenvolvedor",
			department: "TI",
			email: "carlos@example.com",
		},
	]);

	const [showAddForm, setShowAddForm] = useState(false);
	const [newEmployee, setNewEmployee] = useState<Omit<Employee, "id">>({
		name: "",
		position: "",
		department: "",
		email: "",
	});

	const handleAddEmployee = () => {
		setEmployees([...employees, { ...newEmployee, id: employees.length + 1 }]);
		setNewEmployee({ name: "", position: "", department: "", email: "" });
		setShowAddForm(false);
	};

	return (
		<div className="row-page">
			<NavBar />
			<main className="mainContent-dash">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold">Lista de Funcionários</h1>
					<button
						className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
						onClick={() => setShowAddForm(true)}
					>
						<Plus className="mr-2" /> Adicionar Funcionário
					</button>
				</div>

				<div className="mb-4 relative">
					<input
						type="text"
						placeholder="Buscar funcionários..."
						className="w-full p-2 pl-10 border border-gray-300 rounded"
					/>
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full bg-white">
						<thead>
							<tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
								<th className="py-3 px-6 text-left">Nome</th>
								<th className="py-3 px-6 text-left">Cargo</th>
								<th className="py-3 px-6 text-left">Departamento</th>
								<th className="py-3 px-6 text-left">Email</th>
								<th className="py-3 px-6 text-center">Ações</th>
							</tr>
						</thead>
						<tbody className="text-gray-600 text-sm font-light">
							{employees.map((employee) => (
								<tr
									key={employee.id}
									className="border-b border-gray-200 hover:bg-gray-100"
								>
									<td className="py-3 px-6 text-left whitespace-nowrap">
										{employee.name}
									</td>
									<td className="py-3 px-6 text-left">{employee.position}</td>
									<td className="py-3 px-6 text-left">{employee.department}</td>
									<td className="py-3 px-6 text-left">{employee.email}</td>
									<td className="py-3 px-6 text-center">
										<div className="flex item-center justify-center">
											<button className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
												<Edit size={16} />
											</button>
											<button className="w-4 mr-2 transform hover:text-red-500 hover:scale-110">
												<Trash2 size={16} />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{showAddForm && (
					<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
						<div className="bg-white p-5 rounded-lg shadow-lg w-96">
							<h2 className="text-xl font-bold mb-4">
								Adicionar Novo Funcionário
							</h2>
							<input
								type="text"
								placeholder="Nome do funcionário"
								className="w-full p-2 mb-4 border border-gray-300 rounded"
								value={newEmployee.name}
								onChange={(e) =>
									setNewEmployee({ ...newEmployee, name: e.target.value })
								}
							/>
							<input
								type="text"
								placeholder="Cargo"
								className="w-full p-2 mb-4 border border-gray-300 rounded"
								value={newEmployee.position}
								onChange={(e) =>
									setNewEmployee({ ...newEmployee, position: e.target.value })
								}
							/>
							<input
								type="text"
								placeholder="Departamento"
								className="w-full p-2 mb-4 border border-gray-300 rounded"
								value={newEmployee.department}
								onChange={(e) =>
									setNewEmployee({ ...newEmployee, department: e.target.value })
								}
							/>
							<input
								type="email"
								placeholder="Email"
								className="w-full p-2 mb-4 border border-gray-300 rounded"
								value={newEmployee.email}
								onChange={(e) =>
									setNewEmployee({ ...newEmployee, email: e.target.value })
								}
							/>
							<div className="flex justify-end">
								<button
									className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
									onClick={() => setShowAddForm(false)}
								>
									Cancelar
								</button>
								<button
									className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
									onClick={handleAddEmployee}
								>
									Adicionar
								</button>
							</div>
						</div>
					</div>
				)}
			</main>
		</div>
	);
};

export default EmployeeListPage;
