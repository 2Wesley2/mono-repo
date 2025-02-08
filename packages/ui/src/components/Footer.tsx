import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<footer className="bg-gray-800 text-white py-8">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div>
						<h3 className="text-xl font-bold mb-4">56 CRM</h3>
						<p className="text-gray-400">
							Soluções completas para fidelização de clientes e gerenciamento de
							restaurantes.
						</p>
					</div>
					<div>
						<h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
						<ul className="space-y-2">
							<li>
								<Link
									to="/about"
									className="text-gray-400 hover:text-white transition duration-300"
								>
									Sobre Nós
								</Link>
							</li>
							<li>
								<Link
									to="/features"
									className="text-gray-400 hover:text-white transition duration-300"
								>
									Recursos
								</Link>
							</li>
							<li>
								<Link
									to="/pricing"
									className="text-gray-400 hover:text-white transition duration-300"
								>
									Preços
								</Link>
							</li>
							<li>
								<Link
									to="/contact"
									className="text-gray-400 hover:text-white transition duration-300"
								>
									Contato
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="text-lg font-semibold mb-4">Contate-nos</h4>
						<p className="text-gray-400">Email: contato@56crm.com</p>
						<p className="text-gray-400">Telefone: (11) 1234-5678</p>
					</div>
				</div>
				<div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
					<p>
						&copy; 2025 Facilite Varejo. Todos os direitos reservados.
						Desenvolvido por{" "}
						<Link
							to="https://borderlessdev.com/" // Defina a rota que você deseja
							className="text-blue-800 hover:text-blue-500 transition duration-300"
						>
							Borderless
						</Link>
					</p>{" "}
				</div>
			</div>
		</footer>
	);
};

export default Footer;
