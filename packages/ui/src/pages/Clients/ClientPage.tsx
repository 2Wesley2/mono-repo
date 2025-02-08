import React, { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import "./ClientPage.css";
import NavBar from "../../components/NavBar/NavBar";
import { Client } from "../../types/client";

const ClientPage: React.FC = () => {
	const [clients, setClient] = useState<Client[]>([
		{
			id: 1,
			name: "Cliente 01",
			phone: "51988887777",
			email: "teste01@gmail.com",
			address: "Rua principal, 123",
			createdAt: new Date(),
			vendas: []
		},
		{
			id: 2,
			name: "Cliente 02",
			phone: "51988887777",
			email: "teste02@gmail.com",
			address: "Rua principal, 123",
			createdAt: new Date(),
			vendas: []
		},
		{
			id: 3,
			name: "Cliente 03",
			phone: "51988887777",
			email: "teste03@gmail.com",
			address: "Rua principal, 123",
			createdAt: new Date(),
			vendas: []
		},
	]);

	const [showAddForm, setShowAddForm] = useState(false);
	const [newClient, setNewClient] = useState<Omit<Client, "id" | "createdAt">>({
		name: "",
		phone: "",
		email: "",
		address: "",
		vendas: [],
	});

	const handleAddClient = () => {
		setClient([
			...clients,
			{ ...newClient, id: clients.length + 1, createdAt: new Date() },
		]); // ALTERADO
		setNewClient({ name: "", phone: "", email: "", address: "", vendas: [] }); // ALTERADO
		setShowAddForm(false);
	};

	return (
		<div className="row-page">
			<NavBar />
			<main className="mainContent-dash">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold">Clientes cadastrados</h1>
					<button
						className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
						onClick={() => setShowAddForm(true)}
					>
						<Plus className="mr-2" /> Cadastrar cliente
					</button>
				</div>

				<div className="mb-4 relative">
					<input
						type="text"
						placeholder="Buscar clientes..."
						className="w-full p-2 pl-10 border border-gray-300 rounded"
					/>
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full bg-white">
						<thead>
							<tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
								<th className="py-3 px-6 text-left">Nome</th>
								<th className="py-3 px-6 text-left">Telefone</th>
								<th className="py-3 px-6 text-left">Email</th>
								<th className="py-3 px-6 text-left">Endereço</th>
								<th className="py-3 px-6 text-center">Ações</th>
							</tr>
						</thead>
						<tbody className="text-gray-600 text-sm font-light">
							{clients.map(
								(
									client // ALTERADO
								) => (
									<tr
										key={client.id}
										className="border-b border-gray-200 hover:bg-gray-100"
									>
										<td className="py-3 px-6 text-left whitespace-nowrap">
											{client.name}
										</td>
										<td className="py-3 px-6 text-left">{client.phone}</td>
										<td className="py-3 px-6 text-left">{client.email}</td>{" "}
										{/* ALTERADO */}
										<td className="py-3 px-6 text-left">
											{client.address}
										</td>{" "}
										{/* ALTERADO */}
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
								)
							)}
						</tbody>
					</table>
				</div>

				{showAddForm && (
					<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
						<div className="bg-white p-5 rounded-lg shadow-lg w-96">
							<h2 className="text-xl font-bold mb-4">Adicionar Novo Cliente</h2>{" "}
							{/* ALTERADO */}
							<input
								type="text"
								placeholder="Nome do cliente"
								className="w-full p-2 mb-4 border border-gray-300 rounded"
								value={newClient.name}
								onChange={(e) =>
									setNewClient({ ...newClient, name: e.target.value })
								}
							/>
							<input
								type="text"
								placeholder="Telefone"
								className="w-full p-2 mb-4 border border-gray-300 rounded"
								value={newClient.phone}
								onChange={(e) =>
									setNewClient({ ...newClient, phone: e.target.value })
								}
							/>
							<input
								type="email"
								placeholder="Email"
								className="w-full p-2 mb-4 border border-gray-300 rounded"
								value={newClient.email}
								onChange={(e) =>
									setNewClient({ ...newClient, email: e.target.value })
								}
							/>
							<input
								type="text"
								placeholder="Endereço"
								className="w-full p-2 mb-4 border border-gray-300 rounded"
								value={newClient.address}
								onChange={(e) =>
									setNewClient({ ...newClient, address: e.target.value })
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
									onClick={handleAddClient} // ALTERADO
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

export default ClientPage;
