import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";
import {
	Briefcase,
	ChartNoAxesCombined,
	ChevronDown,
	DollarSign,
	IdCard,
	Mail,
	Menu,
	PackageSearch,
	Settings,
	UserCircle,
	UserCog,
	Users,
	Utensils,
} from "lucide-react";

const NavBar = () => {
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(true); // Controle de abrir/fechar menu

	const toggleMenu = () => setIsOpen(!isOpen);

	const handleNavigation = (path: string) => {
		navigate(path);
	};

	return (
		<nav className={`navbar ${isOpen ? "open" : "closed"}`}>
			<div className="navbar-header">
				<button className="menu-toggle" onClick={toggleMenu}>
					{isOpen ? <Menu /> : <ChevronDown />}
				</button>
				{isOpen && <h1 className="navbar-title">Facilite Varejo</h1>}
			</div>
			<ul className="navbar-menu">
				<li onClick={() => handleNavigation("/dashboard")}>
					<ChartNoAxesCombined className="icon" />
					{isOpen && <span>Dashboard</span>}
				</li>
				<li onClick={() => handleNavigation("/comandas")}>
					<Utensils className="icon" />
					{isOpen && <span>Controle de Comandas</span>}
				</li>
				<li onClick={() => handleNavigation("/employee")}>
					<IdCard className="icon" />
					{isOpen && <span>Funcionários</span>}
				</li>
				<li onClick={() => handleNavigation("/products")}>
					<PackageSearch className="icon" />
					{isOpen && <span>Produtos</span>}
				</li>
				<li onClick={() => handleNavigation("/clients")}>
					<UserCircle className="icon" />
					{isOpen && <span>Clientes</span>}
				</li>
				<li onClick={() => handleNavigation("/finance")}>
					<DollarSign className="icon" />
					{isOpen && <span>Financeiro</span>}
				</li>
				<li onClick={() => handleNavigation("/settings")}>
					<Settings className="icon" />
					{isOpen && <span>Configurações</span>}
				</li>
			</ul>
		</nav>
	);
};

export default NavBar;