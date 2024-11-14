/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Limita a otimização apenas a imagens locais (no diretório 'public')
    domains: [],

    // Define o padrão para os caminhos de imagem locais no diretório `public`
    unoptimized: false, // Desativa a otimização (caso ative para diagnosticar)
  },
};

export default nextConfig;
