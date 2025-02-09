import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Helmet>
        <title>56 CRM - Conquiste, Retenha e Fidelize Clientes</title>
        <meta
          name="description"
          content="Solução completa para fidelizar seus clientes e gerenciar comandas de restaurantes"
        />
      </Helmet>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Conquiste, Retenha e Fidelize Clientes</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Solução completa para sua empresa crescer: app fidelidade, portal do cliente, PDV, automações e diversas
            ferramentas de marketing.
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => navigate('/login')}
          >
            Experimente Grátis!
          </button>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8 transition duration-300 ease-in-out hover:shadow-xl">
            <img src="/assets/icon-fidelidade.png" alt="Programa de Fidelidade" className="w-16 h-16 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Programa de Fidelidade</h2>
            <p className="text-gray-600">
              Plataforma completa com portal e aplicativo fidelidade para você conquistar, reter e fidelizar seus
              clientes.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8 transition duration-300 ease-in-out hover:shadow-xl">
            <img src="/assets/icon-marketing.png" alt="Marketing Automatizado" className="w-16 h-16 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Marketing Automatizado</h2>
            <p className="text-gray-600">
              Campanhas personalizadas e automatizadas para aumentar a recorrência mantendo contato com os clientes via
              WhatsApp, SMS e E-mail.
            </p>
          </div>
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Gerencie Comandas com Facilidade</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Nosso sistema de controle de comandas para restaurantes simplifica suas operações e melhora a experiência do
            cliente.
          </p>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => navigate('/demo')}
          >
            Agende uma Demonstração
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
