import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Facilite Varejo
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/features" className="text-gray-600 hover:text-blue-600 transition duration-300">
                Recursos
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition duration-300">
                Preços
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition duration-300">
                Contato
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
