# 📞 Sistema de Chamados - Backend

Este é um projeto backend em desenvolvimento para gerenciamento de chamados internos, construído com [NestJS](https://nestjs.com/). Ele visa facilitar o registro, acompanhamento e resolução de solicitações por parte dos usuários e operadores do sistema.

## 🚀 Tecnologias Utilizadas

- **[Node.js](https://nodejs.org/)**
- **[NestJS](https://nestjs.com/)**
- **[Prisma ORM](https://www.prisma.io/)**
- **[PostgreSQL](https://www.postgresql.org/)**
- **[Zod](https://zod.dev/)** - Validação de dados
- **[Docker](https://www.docker.com/)** - Containerização da aplicação
- **[JWT](https://jwt.io/)** - Autenticação via JSON Web Token
- **[Vitest](https://vitest.dev/)** - Testes automatizados

## 🐳 Como executar com Docker

```bash
# Subir a aplicação com Docker Compose
docker-compose up -d

# Instale as dependências
npm install

# Crie o arquivo .env
DATABASE_URL
JWT_PRIVATE_KEY
JWT_PUBLIC_KEY

# Configure o banco de dados no .env e execute a migração
npx prisma migrate dev

# Rode o servidor
npm run start:dev

# Rodar testes
npm run test:e2e

##----------------------------

📌 Status do Projeto
🚧 Em desenvolvimento

Atualmente o sistema já possui:
Cadastro e autenticação de usuários
Validações com Zod
Testes iniciais com Vitest

Funcionalidades futuras planejadas:
Criação de chamados
Listagem de chamados
Upload de anexos em chamados
Sistema de notificações
Permissões e perfis de usuários
Histórico de interações nos chamados

