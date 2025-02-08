"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MainContent = () => {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Lógica para enviar os dados de login
		console.log("Dados do login:", formData);
	};

	return (
		<main className="main-content">
			<section className="form-section">
				<h1>Entrar na sua conta</h1>
				<p>Faça login para continuar e acessar sua conta.</p>
				<form onSubmit={handleSubmit} className="register-form">
					<input
						type="email"
						name="email"
						placeholder="Seu e-mail"
						value={formData.email}
						onChange={handleChange}
						required
					/>
					<input
						type="password"
						name="password"
						placeholder="Sua senha"
						value={formData.password}
						onChange={handleChange}
						required
					/>
					<div className="row">
						<input
							className="checkbox"
							type="checkbox"
							id="robot-check"
							required
						/>
						<label className="robo_check" htmlFor="robot-check">
							Não sou um robô
						</label>
					</div>
					<button
						type="submit"
						className="submit-button"
						onClick={() => navigate("/dashboard")}
					>
						Entrar
					</button>
				</form>

				{/* Adicionando o texto "Ainda não tem conta?" e o botão "Cadastre-se" */}
				<div className="signup-link">
					<p>Ainda não tem conta?</p>
					<button
						onClick={() => navigate("/register")} // Substitua "/signup" pela rota da sua página de cadastro
						className="signup-button"
					>
						Cadastre-se
					</button>
				</div>
			</section>
		</main>
	);
};

export default MainContent;
