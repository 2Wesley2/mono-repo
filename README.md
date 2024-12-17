# *API de Relacionamento com Clientes*
>
> Esta api é projetada para simplificar o gerenciamento de dados e a execução da regra de negócio,
> fornecendo uma solução que que recebe e retorna informações em formato JSON.
>

---

## 📜 **Índice**  

1. [Objetivo] (#objetivo)  
2. [Arquitetura] (#arquitetura)  
3. [Instalação] (#instalação)  
4. [Uso] (#uso)  
5. [Endpoints] (#endpoints)  
6. [Exemplos de Respostas] (#exemplos-de-respostas)  
7. [Contribuindo] (#contribuindo)  
8. [Licença] (#licença)  

---

## 🎯 **Objetivo**  

> Esta API foi criada para atender negócios como varejo, postos de gasolina, restaurantes, adegas e outros setores que buscam melhorar a
> fidelização de clientes e otimizar suas operações.
> A API processa solicitações no formato JSON, aplicando regras de negócio e retornando dados estruturados de forma eficiente.

## 🛠️ **Arquitetura**  

A api faz parte de um **mono-repo** organizado com a arquitetura baseada em **MVC** (Model, View, Controller).
Com o ajuste de para  **Model-Repository-Service-Controller (MRSC)**, garantindo organização e separação clara de responsabilidades.

- **Mono-repo:** Um repositório central que agrupa diferentes pacotes ou módulos, incluindo a API.  
- **MRSC:** A API segue o padrão:  
  - **Model**: Define a estrutura dos dados, validações e interações com o banco de dados.
  - **Repository**: Contém as regras de negócio, validando entradas e processando dados antes de retorná-los.
  - **Service**: Contém as regras de negócio, validando entradas e processando dados antes de retorná-los.
  - **Controller**: Garante a comunicação entre o cliente e os serviços, transformando solicitações HTTP em chamadas aos serviços.

---

## 💻 **Instalação**  

Explique como instalar e configurar o projeto. Exemplo:

## Clone o repositório

- para HTTPS:

```bash
git clone https://github.com/2Wesley2/mono-repo.git
```

## Acesse o diretório do mono-repo
cd caminho/para/a/api

## Instale as dependências
npm install

## Inicialize o servidor
npm start

## 🔗 **Endpoints**

Aqui está uma versão melhorada da seção Endpoints do README, com base nos endpoints da camada de OrderService e suas funcionalidades:

🔗 Endpoints
A API expõe endpoints RESTful que permitem gerenciar comandas e seus produtos.

🛒 Comandas
1. Criar uma nova comanda
Método: POST
Endpoint: /orders
Descrição: Cria uma nova comanda com os produtos informados.
Parâmetros na Requisição (Body):
json
Copiar código
{
  "orderNumber": 123,
  "products": [
    { "product": "productId1", "quantity": 2 },
    { "product": "productId2", "quantity": 5 }
  ]
}
Resposta:
json
Copiar código
{
  "orderNumber": 123,
  "status": "Stand By",
  "totalAmount": 250.00,
  "products": [
    { "product": "productId1", "quantity": 2 },
    { "product": "productId2", "quantity": 5 }
  ]
}
2. Atualizar produtos de uma comanda existente
Método: PUT
Endpoint: /orders/{orderNumber}/products
Descrição: Atualiza os produtos associados a uma comanda existente. Produtos com quantity <= 0 serão removidos.
Parâmetros na URL:
orderNumber (integer): Número único identificador da comanda.
Parâmetros na Requisição (Body):
json
Copiar código
[
  { "product": "productId1", "quantity": 3 },
  { "product": "productId3", "quantity": 1 }
]
Resposta:
json
Copiar código
{
  "orderNumber": 123,
  "status": "In Progress",
  "totalAmount": 300.00,
  "products": [
    { "product": "productId1", "quantity": 3 },
    { "product": "productId3", "quantity": 1 }
  ]
}
3. Listar produtos de uma comanda
Método: GET
Endpoint: /orders/{orderNumber}/products
Descrição: Retorna os produtos associados a uma comanda, com informações detalhadas.
Parâmetros na URL:
orderNumber (integer): Número único identificador da comanda.
Resposta:
json
Copiar código
{
  "orderNumber": 123,
  "products": [
    { "_id": "productId1", "product": "Produto A", "quantity": 2, "price": 100.00 },
    { "_id": "productId2", "product": "Produto B", "quantity": 5, "price": 200.00 }
  ],
  "totalAmount": 1100.00
}
4. Deletar uma comanda
Método: DELETE
Endpoint: /orders/{orderNumber}
Descrição: Remove uma comanda e todos os seus produtos do sistema.
Parâmetros na URL:
orderNumber (integer): Número único identificador da comanda.
Resposta:
json
Copiar código
{
  "message": "Comanda deletada com sucesso."
}