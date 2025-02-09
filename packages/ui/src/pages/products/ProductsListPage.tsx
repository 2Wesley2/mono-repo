import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import './ProductListPage.css';
import NavBar from '../../components/NavBar/NavBar';
import { Product } from '../../types/product';

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Hambúrguer Clássico', price: 15.99, category: 'Lanches' },
    { id: 2, name: 'Batata Frita', price: 8.99, category: 'Acompanhamentos' },
    { id: 3, name: 'Refrigerante', price: 5.99, category: 'Bebidas' }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    category: ''
  });

  const handleAddProduct = () => {
    setProducts([...products, { ...newProduct, id: products.length + 1 }]);
    setNewProduct({ name: '', price: 0, category: '' });
    setShowAddForm(false);
  };

  return (
    <div className="row-page">
      <NavBar />
      <main className="mainContent-dash">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Lista de Produtos</h1>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="mr-2" /> Adicionar Produto
          </button>
        </div>

        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Buscar produtos..."
            className="w-full p-2 pl-10 border border-gray-300 rounded"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Nome</th>
                <th className="py-3 px-6 text-left">Preço</th>
                <th className="py-3 px-6 text-left">Categoria</th>
                <th className="py-3 px-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{product.name}</td>
                  <td className="py-3 px-6 text-left">R$ {product.price.toFixed(2)}</td>
                  <td className="py-3 px-6 text-left">{product.category}</td>
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
              <h2 className="text-xl font-bold mb-4">Adicionar Novo Produto</h2>
              <input
                type="text"
                placeholder="Nome do produto"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <input
                type="number"
                placeholder="Preço"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: parseFloat(e.target.value)
                  })
                }
              />
              <input
                type="text"
                placeholder="Categoria"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
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
                  onClick={handleAddProduct}
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

export default ProductListPage;
