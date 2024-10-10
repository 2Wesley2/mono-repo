import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <ul style={{ all: "initial" }}>
        <li><Link to="/gerenciar-funcionarios">1 - Gerenciar Funcionários</Link></li>
        <li><Link to="/gerenciar-clientes">2 - Gerenciar Clientes</Link></li>
        <li><Link to="/gerenciar-vendas">3 - Gerenciar Vendas</Link></li>
      </ul>
    </div>
  );
};

export default Home;
