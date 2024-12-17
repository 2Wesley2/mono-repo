# *Facilite Varejo API*
>
> Esta api é projetada para simplificar o gerenciamento de dados e a execução da regra de negócio,
> fornecendo uma solução que recebe e retorna informações em formato JSON.
>

---

## 📜 **Índice**  

1. [Objetivo]
2. [Arquitetura]
3. [Instalacao]
4. [Endpoints]

---

## 🎯 **Objetivo**

[Objetivo]: #-objetivo
> Esta API foi criada para atender negócios como varejo, postos de gasolina, restaurantes, adegas e outros setores que buscam melhorar a
> fidelização de clientes e otimizar suas operações.
> A API processa solicitações no formato JSON, aplicando regras de negócio e retornando dados estruturados de forma eficiente.

## 🛠️ **Arquitetura**  

[Arquitetura]: #️-arquitetura
A api faz parte de um **mono-repo** organizado com a arquitetura baseada em **MVC** (Model, View, Controller).
Com o ajuste para  **Model-Repository-Service-Controller (MRSC)**, garantindo organização e separação clara de responsabilidades.

- **Mono-repo:** Um repositório central que agrupa diferentes pacotes ou módulos, incluindo a API.  
- **MRSC:** A API segue o padrão:
  - **Model**: Define a estrutura dos dados, validações e interações com o banco de dados.
  - **Repository**: Contém as regras de negócio, validando entradas e processando dados antes de retorná-los.
  - **Service**: Contém as regras de negócio, validando entradas e processando dados antes de retorná-los.
  - **Controller**: Garante a comunicação entre o cliente e os serviços, transformando solicitações HTTP em chamadas aos serviços.

---

## 💻 **Instalacao**

[Instalacao]: #-instalacao

### *Pré-requisitos*

Certifique-se de ter o **Node.js** instalado em sua máquina

- Versão mínima: >= 20
- Versão utilizada no projeto: 20.12.2

### *1. Clone o repositório*

  *Para HTTPS:*

```bash
git clone https://github.com/2Wesley2/mono-repo.git
```

  *Para SSH:*

```bash
git@github.com:2Wesley2/mono-repo.git
```

### *2. Acesse o diretório do mono-repo*

```bash
cd mono-repo
```

### *3. Instale as dependências*

```bash
yarn install
```

### *4. Configure as variáveis de ambiente*

Configure as [variaveis-de-ambiente]

### *5. Inicie o ambiente de desenvolvimento com*

[iniciar-ambiente-de-desenvolvimento]: #5-inicie-o-ambiente-de-desenvolvimento-com

```bash
yarn dev
```

---

## 🔑 *Configuracao das Variaveis de Ambiente*

[variaveis-de-ambiente]: #-configuracao-das-variaveis-de-ambiente

### *1. Variáveis para a API*

No diretório `mono-repo/packages/api/`, crie o arquivo `.env` e adicione as seguintes configurações:  
(use No diretório mono-repo barra packages barra api barra vírgula crie o arquivo ponto env e adicione as seguintes configurações dois pontos)

```plaintext
# Configurações da API
PORT=3001  

# Configurações do Banco de Dados
DB_HOST=localhost  
DB_PORT=27017  
DB_NAME=system  
DB_USER=  
DB_PASSWORD=  
DB_ATLAS=  

# Configuração JWT
JWT_SECRET=Token

# Ambiente
NODE_ENV=development  

# Configurações do Twilio
TWILIO_ACCOUNT_SID=idTwilioAccount
TWILIO_AUTH_TOKEN=token 
TWILIO_PHONE_NUMBER=phoneNumber  

# Configurações do Email
EMAIL_HOST=smtp.gmail.com  
EMAIL_PORT=587 
EMAIL_USER=email@email
EMAIL_PASSWORD=passwordEmailApp  

# URLs de Pagamento GetNet
URL_NEW_PAYMENT_V2_GETNET=getnet://pagamento/v2/payment  
URL_NEW_PAYMENT_V3_GETNET=getnet://pagamento/v3/payment  
URL_CHECK_STATUS_GETNET=getnet://pagamento/v1/checkstatus

```

### *2. Variáveis para a FrontEnd com NextJS*

No diretório `mono-repo/packages/frontend`, crie um arquivo `.env` com as seguintes variáveis

```plaintext
# URL Base do Servidor  
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api  
  
# Configuração JWT  
NEXT_PUBLIC_JWT_SECRET=mesmoTokenDaAPi
  
# Ambiente  
NEXT_PUBLIC_NODE_ENV=development  

```

Próximo passo:
[iniciar-ambiente-de-desenvolvimento]

---

## 🔌 *Endpoints*

[Endpoints]: #-endpoints

### **1. Listar Produtos de uma Comanda**

  **Descrição:** Retorna a lista de produtos associados a uma comanda específica, enriquecida com informações detalhadas de cada produto.

- **Endpoint:** `GET /api/orders/:orderNumber/products`
- **Parâmetros:**
  - `orderNumber` *(path)*: Número da comanda a ser consultada. Recebida como string via params

- **Exemplos:**
  
  - *Requisição:*

  ```javascript
  const listProductsByOrder = async (orderNumber) => {
    try {
      const response = await fetch(`http://localhost:3001/api/orders/${orderNumber}/products`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar produtos: ${response.status}`);
      }

      const data = await response.json();
      console.log('Produtos da comanda:', data);
    } catch (error) {
      console.error('Erro:', error.message);
    }
  };

  listProductsByOrder(123);
  ```
  
  - *Resposta:*

  ```json
  {
    "totalAmount": 300,
    "products": [
      {
        "_id": "63cf54b",
        "product": "Produto A",
        "quantity": 2,
        "price": 100
      },
      {
        "_id": "63cf54c",
        "product": "Produto B",
        "quantity": 1,
        "price": 200
      }
    ]
  }
  ```

  - Códigos de Reposta:
    - `200 OK`: Dados da comanda retornados com sucesso.
    - `400 Bad Request`: O parâmetro `orderNumber` não é válido.
    - `404 Not Found`: A comanda não foi encontrada.

### **2. Atualizar Produtos de uma Comanda**

  **Descrição:** Atualiza a lista de produtos de uma comanda, incluindo a quantidade e removendo aqueles com quantidade igual ou inferior a zero.

- **Endpoint:** PUT /api/orders/:orderNumber/order
- **Parâmetros:**
  - `orderNumber` *(path)*: Número da comanda a ser atualizada. Deve ser um número inteiro válido.

- **Body:**

  ```json
  {
    "products": [
      { "product": "63cf54b", "quantity": 3 },
      { "product": "63cf54c", "quantity": 5 }
    ]
  }
  ```

- **Exemplos:**
  
  - *Requisição:*

  ```javascript
    const updateOrderProducts = async (orderNumber, updatedProducts) => {
      try {
        const response = await fetch(`http://localhost:3001/api/orders/${orderNumber}/order`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedProducts)
        });

        if (!response.ok) {
          throw new Error(`Erro ao atualizar produtos: ${response.status}`);
        }

        const data = await response.json();
        console.log('Produtos atualizados:', data);
      } catch (error) {
        console.error('Erro:', error.message);
      }
    };


    // Exemplo de uso
    updateOrderProducts(123, {
      products: [
        { product: "63cf54b", quantity: 3 },
        { product: "63cf54c", quantity: 5 }
      ]
    });

  ```
  
  - *Resposta:*

  ```json
  {
    "updatedProducts": [
      { "product": "63cf54b", "quantity": 3 },
      { "product": "63cf54c", "quantity": 5 }
    ]
  }

  ```

  - Códigos de Reposta:
    - `200 OK`: Produtos da comanda atualizados com sucesso.
    - `400 Bad Request`: O parâmetro `orderNumber` não é válido ou body da requisição não são válidos.
    - `404 Not Found`: A comanda não foi encontrada.
