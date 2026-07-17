# DevScope AI

<p align="center">
  <img src="./docs/assets/logo.png" alt="DevScope AI Logo" width="180"/>
</p>

<p align="center">
  <strong>Plataforma para gerenciamento de projetos de software.</strong>
</p>

<p align="center">

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-orange)
![Node](https://img.shields.io/badge/Node.js-22.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Fastify](https://img.shields.io/badge/Fastify-5.x-black)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![License](https://img.shields.io/badge/license-MIT-brightgreen)

</p>

---

# Sobre o projeto

O **DevScope AI** é uma plataforma desenvolvida para auxiliar equipes de desenvolvimento de software na organização de projetos, gerenciamento de tarefas e acompanhamento do progresso das equipes.

O objetivo é oferecer uma solução moderna, escalável e segura para gerenciamento de projetos utilizando uma arquitetura baseada em módulos, separação de responsabilidades e boas práticas de desenvolvimento.

O projeto está sendo desenvolvido utilizando uma arquitetura inspirada em aplicações utilizadas em produção, priorizando organização, escalabilidade, testabilidade e facilidade de manutenção.

---

# Objetivos

O DevScope AI busca solucionar problemas comuns encontrados durante o desenvolvimento de software, como:

- organização de múltiplos projetos;
- gerenciamento de equipes;
- controle de tarefas;
- acompanhamento de sprints;
- controle de permissões;
- histórico de alterações;
- autenticação segura;
- API preparada para aplicações web e mobile.

---

# Tecnologias

## Backend

- Node.js
- TypeScript
- Fastify
- Prisma ORM
- PostgreSQL
- JWT
- Zod
- Vitest

## Infraestrutura

- Docker
- Docker Compose
- PNPM Workspaces
- Turborepo

## Frontend

> Em desenvolvimento.

---

# Arquitetura

O projeto utiliza arquitetura em camadas, separando responsabilidades entre Controllers, Services e Repositories.

```text
Cliente
    │
    ▼
Rotas
    │
    ▼
Controllers
    │
    ▼
Services
    │
    ▼
Repositories
    │
    ▼
Prisma ORM
    │
    ▼
PostgreSQL
```

Essa organização facilita:

- manutenção;
- reutilização de código;
- criação de testes;
- evolução do sistema.

---

# Estrutura do projeto

```text
devscope-ai/

backend/
│
├── prisma/
├── src/
│   ├── config/
│   ├── errors/
│   ├── helpers/
│   ├── middlewares/
│   ├── modules/
│   ├── routes/
│   └── server.ts
│
├── tests/
│
└── package.json

frontend/
packages/
infra/
docs/
```

---

# Funcionalidades implementadas

## Autenticação

- Cadastro de usuários
- Login
- JWT
- Perfil autenticado
- Middleware de autenticação

---

## Empresas

- Criar empresa
- Listar empresas
- Buscar empresa
- Atualizar empresa
- Excluir empresa

---

## Projetos

- Criar projeto
- Listar projetos
- Buscar projeto
- Atualizar projeto
- Excluir projeto

---

## Tratamento de erros

A aplicação utiliza um sistema centralizado de exceções baseado em classes específicas.

Exemplos:

- DadosInvalidosError
- RecursoDuplicadoError
- RecursoNaoEncontradoError
- SemPermissaoError
- CredenciaisInvalidasError
- TokenInvalidoError

Todas as exceções são tratadas por um Error Handler global.

---

# Testes

O projeto possui testes automatizados utilizando o Vitest.

Atualmente existem testes para:

- autenticação;
- empresas;
- projetos.

Os testes utilizam um banco isolado para garantir independência entre execuções.

---

# Segurança

Atualmente o projeto utiliza:

- senhas criptografadas;
- autenticação JWT;
- validação com Zod;
- tratamento centralizado de erros;
- separação entre DTOs e entidades;
- validação de permissões.

Melhorias planejadas:

- Cookies HttpOnly;
- Refresh Token;
- Rate Limiting;
- Helmet;
- CORS restritivo;
- Auditoria;
- Logs estruturados.

---

# Próximas funcionalidades

O desenvolvimento seguirá a seguinte ordem:

- Sprint
- Tarefas
- Comentários
- Convites
- Dashboard
- Uploads
- Notificações
- Histórico de alterações
- IA para auxílio na gestão de projetos

---

# Executando o projeto

## Clonar o repositório

```bash
git clone https://github.com/SEU_USUARIO/devscope-ai.git
```

---

## Instalar dependências

```bash
pnpm install
```

---

## Configurar variáveis de ambiente

```bash
cp .env.example .env
```

---

## Subir banco de dados

```bash
docker compose up -d
```

---

## Executar migrações

```bash
pnpm prisma migrate deploy
```

Durante o desenvolvimento:

```bash
pnpm prisma migrate dev
```

---

## Iniciar servidor

```bash
pnpm dev
```

---

## Executar testes

```bash
pnpm test
```

---

# Documentação

A documentação completa está disponível na pasta **docs**.

| Documento       | Descrição                |
| --------------- | ------------------------ |
| ARCHITECTURE.md | Arquitetura do sistema   |
| BACKEND.md      | Organização do backend   |
| API.md          | Endpoints da API         |
| AUTH.md         | Sistema de autenticação  |
| DATABASE.md     | Modelagem do banco       |
| TESTS.md        | Testes automatizados     |
| SECURITY.md     | Estratégias de segurança |
| CONTRIBUTING.md | Guia para contribuição   |
| ROADMAP.md      | Planejamento do projeto  |

---

# Estado atual

O projeto encontra-se em desenvolvimento ativo.

Funcionalidades implementadas:

- ✅ Autenticação
- ✅ Empresas
- ✅ Projetos

Em desenvolvimento:

- 🚧 Sprint
- 🚧 Tarefas
- 🚧 Dashboard
- 🚧 Frontend

---

# Licença

Este projeto está licenciado sob a licença MIT.

---

# Autor

Desenvolvido por **Kayo Moura**.

Projeto criado com foco em estudo de arquitetura de software, desenvolvimento backend moderno e construção de uma plataforma escalável para gerenciamento de projetos.
