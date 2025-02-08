"use client";

import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    whatsapp: '',
    email: '',
    position: '',
    employees: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para enviar dados do formulário
    console.log('Dados do formulário:', formData);
  };

  return (
    <main className="main-content">
      <section className="form-section">
        <h1>Comece Grátis!</h1>
        <p>
          Teste grátis agora mesmo e comece a fidelizar seus clientes e automatizar o marketing para <strong>aumentar as vendas</strong>.
        </p>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="companyName"
            placeholder="Nome da sua empresa"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="whatsapp"
            placeholder="Seu WhatsApp com DDD"
            value={formData.whatsapp}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Seu e-mail profissional"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <select name="position" value={formData.position} onChange={handleChange} required>
            <option value="" disabled>
              Cargo na Empresa
            </option>
            <option value="CEO">CEO</option>
            <option value="Gerente">Gerente</option>
            <option value="Funcionário">Funcionário</option>
          </select>
          <select name="employees" value={formData.employees} onChange={handleChange} required>
            <option value="" disabled>
              Quantos funcionários você tem?
            </option>
            <option value="1-10">1-10</option>
            <option value="11-50">11-50</option>
            <option value="51-200">51-200</option>
            <option value="200+">Mais de 200</option>
          </select>
          <div className="row">
            <input className="checkbox" type="checkbox" id="robot-check" required/>
            <label className="robo_check" htmlFor="robot-check">Não sou um robô</label>
          </div>
          <button type="submit" className="submit-button">
            Continuar
          </button>
        </form>
      </section>
    </main>
  );
};

export default Register;
