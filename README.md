# Projeto de Gestão de Empresas

Este projeto implementa um sistema de gestão de empresas com autenticação e autorização baseadas em roles, permitindo a gestão de empresas, usuários e tarefas.

## Tabela de Conteúdos

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Execução da Aplicação](#execução-da-aplicação)

## Tecnologias Utilizadas

- Node.js
- Nest.js
- MySql
- JWT (JSON Web Tokens) para autenticação
- Typeorm (para interação com o MySql)

## Funcionalidades

1. **Autenticação e Autorização**

   - Implementação de autenticação com JWT.
   - Autorização baseada em roles: Admin e User.

2. **Gestão de Empresas (Tenants)**

   - Criar, atualizar, visualizar e excluir empresas.
   - Cada empresa tem seus próprios usuários e tarefas.

3. **Gestão de Usuários**

   - Registrar usuários em uma empresa.
   - Atribuir roles (Admin, User).
   - Visualizar, atualizar e excluir usuários.

4. **Gestão de Tarefas**
   - Criar, atualizar, visualizar e excluir tarefas.
   - Cada tarefa possui um título, descrição, status (pendente, em progresso, concluída) e prazo.

## Configuração do Ambiente

Para rodar este projeto em sua máquina local, siga os passos abaixo:

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/task-management-api.git
   cd task-management-api
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**

   ```bash
    PORT=3001

    JWT_SECRET=at-secret

    MYSQL_HOST=localhost
    MYSQL_PORT=3306
    MYSQL_DB=task_management
    MYSQL_USER=elves
    MYSQL_PASSWORD=BeIFT10>@x
   ```

4. **Rodar as migrations:**

   ```bash
   npm run migration:run
   ```

5. **Subir o container do banco de dados com Docker Compose:**

   ```bash
   docker-compose up -d
   ```

6. **Executar a aplicação:**

   ```bash
   npm start
   ```

## Cadastro de Empresa e Usuário Admin

Após rodar o projeto, é necessário cadastrar uma empresa utilizando o endpoint `POST /tenants`. Ao cadastrar a primeira empresa, um usuário Admin será criado automaticamente para essa empresa, e você estará autorizado a acessar as funcionalidades da API.

**Importante:** Para acessar os recursos, é necessário enviar o token gerado no login (endpoint `POST /auth/login`)
