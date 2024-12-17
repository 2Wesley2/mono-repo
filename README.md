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

### *Pré-requisitos*

Certifique-se de ter o **Node.js** instalado em sua máquina

- Versão mínima: >= 20
- Versão utilizada no projeto: 20.12.2

### *1. Clone o repositório*

- para HTTPS:

```bash
git clone https://github.com/2Wesley2/mono-repo.git
```

- Para SSH

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

[Configure as variaveis de ambiente] [variaveis]

### *5. Inicie o ambiente de desenvolvimento com:*

```bash
yarn dev
```

## *Configuracao das Variaveis de Ambiente*

[variaveis]: #configuracao-das-variaveis-de-ambiente

Crie os arquivos `.env` necessários no projeto.

### *1. Variáveis para a API*

No diretório `mono-repo/packages/api/`, crie o arquivo `.env` e adicione as seguintes configurações:  
(use No diretório mono-repo barra packages barra api barra vírgula crie o arquivo ponto env e adicione as seguintes configurações dois pontos)
[variáveis]: #configuração-das-variáveis-de-ambiente

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

# Configurações do Twilio (use cerquilha Configurações do Twilio)
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
