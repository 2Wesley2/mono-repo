import React from "react";
import { useState } from "react";
import { Save } from "lucide-react";
import NavBar from "../../components/NavBar/NavBar";
import "./settings.css";

const SettingsPage: React.FC = () => {
	const [settings, setSettings] = useState({
		companyName: "Facilite Varejo",
		email: "contato@facilitevarejo.com",
		language: "pt-BR",
		currency: "BRL",
		timezone: "America/Sao_Paulo",
		enableNotifications: true,
		enableAutoBackup: true,
	});

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value, type } = e.target;
		setSettings((prev) => ({
			...prev,
			[name]:
				type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Here you would typically send the settings to your backend
		console.log("Settings saved:", settings);
		// You can add a toast notification here to inform the user
	};

	return (
		<div className="row-page">
			<NavBar />
			<main className="mainContent-dash">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold">Configurações</h1>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="settings-grid">
						<div className="settings-card">
							<h2>Informações da Empresa</h2>
							<div className="form-group">
								<label htmlFor="companyName">Nome da Empresa</label>
								<input
									type="text"
									id="companyName"
									name="companyName"
									value={settings.companyName}
									onChange={handleInputChange}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="email">E-mail de Contato</label>
								<input
									type="email"
									id="email"
									name="email"
									value={settings.email}
									onChange={handleInputChange}
								/>
							</div>
						</div>

						<div className="settings-card">
							<h2>Preferências Regionais</h2>
							{/* <div className="form-group">
								<label htmlFor="language">Idioma</label>
								<select
									id="language"
									name="language"
									value={settings.language}
									onChange={handleInputChange}
								>
									<option value="pt-BR">Português (Brasil)</option>
									<option value="en-US">English (US)</option>
									<option value="es-ES">Español</option>
								</select>
							</div> */}
							<div className="form-group">
								<label htmlFor="currency">Moeda</label>
								<select
									id="currency"
									name="currency"
									value={settings.currency}
									onChange={handleInputChange}
								>
									<option value="BRL">Real (R$)</option>
									<option value="USD">US Dollar ($)</option>
									<option value="EUR">Euro (€)</option>
								</select>
							</div>
							<div className="form-group">
								<label htmlFor="timezone">Fuso Horário</label>
								<select
									id="timezone"
									name="timezone"
									value={settings.timezone}
									onChange={handleInputChange}
								>
									<option value="America/Sao_Paulo">Brasília</option>
									<option value="America/New_York">New York</option>
									<option value="Europe/London">London</option>
								</select>
							</div>
						</div>

						<div className="settings-card">
							<h2>Notificações e Backup</h2>
							<div className="form-group">
								<label>
									<input
										type="checkbox"
										name="enableNotifications"
										checked={settings.enableNotifications}
										onChange={handleInputChange}
									/>
									Ativar notificações
								</label>
							</div>
							<div className="form-group">
								<label>
									<input
										type="checkbox"
										name="enableAutoBackup"
										checked={settings.enableAutoBackup}
										onChange={handleInputChange}
									/>
									Ativar backup automático
								</label>
							</div>
						</div>
					</div>

					<button type="submit" className="save-button mt-6 flex items-center">
						<Save className="mr-2" size={18} />
						Salvar Configurações
					</button>
				</form>
			</main>
		</div>
	);
};

export default SettingsPage;
