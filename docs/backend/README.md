# BACKEND.md

# Backend

## Visão Geral

O backend do DevScope AI é responsável por fornecer toda a lógica de negócio da aplicação através de uma API REST construída com **Fastify**, utilizando **TypeScript**, **Prisma ORM** e **PostgreSQL**.

Sua arquitetura foi planejada para ser modular, escalável e de fácil manutenção, permitindo que novas funcionalidades sejam adicionadas sem comprometer a estrutura existente.

---

# Tecnologias

| Tecnologia | Finalidade            |
| ---------- | --------------------- |
| Node.js    | Ambiente de execução  |
| TypeScript | Tipagem estática      |
| Fastify    | Framework HTTP        |
| Prisma ORM | Persistência de dados |
| PostgreSQL | Banco de dados        |
| JWT        | Autenticação          |
| Zod        | Validação             |
| Vitest     | Testes                |

---

# Objetivos da arquitetura

O backend foi desenvolvido seguindo alguns princípios fundamentais:

- Separação de responsabilidades
- Baixo acoplamento
- Alta coesão
- Código reutilizável
- Facilidade de testes
- Escalabilidade

Cada módulo possui responsabilidades bem definidas, evitando concentração excessiva de lógica em uma única camada.

---

# Estrutura do Backend

```text
backend/

├── prisma/
│
├── src/
│
│   ├── config/
│   ├── errors/
│   ├── helpers/
│   ├── middlewares/
│   ├── modules/
│   ├── routes/
│   ├── app.ts
│   └── server.ts
│
├── tests/
│
├── package.json
└── tsconfig.json
```

---

# Configuração

## config/

Responsável pelas configurações da aplicação.

Exemplos:

- leitura das variáveis de ambiente;
- configuração do Prisma;
- configuração do JWT;
- parâmetros globais.

Toda configuração compartilhada deve permanecer nessa pasta.

---

# Errors

```text
errors/
```

Centraliza todas as exceções da aplicação.

Existe uma classe base (`AppError`) que representa qualquer erro de domínio.

A partir dela são criadas exceções específicas como:

```text
CredenciaisInvalidasError

DadosInvalidosError

RecursoDuplicadoError

RecursoNaoEncontradoError

SemPermissaoError

TokenInvalidoError
```

Essa abordagem permite que a regra de negócio permaneça desacoplada do protocolo HTTP.

---

# Helpers

A pasta `helpers` contém funções reutilizáveis utilizadas por diferentes módulos.

Exemplos:

- normalização de texto;
- funções utilitárias;
- validações genéricas;
- conversões.

Helpers não possuem dependência de banco nem de HTTP.

---

# Middlewares

Responsáveis por interceptar requisições antes que elas cheguem aos Controllers.

Atualmente incluem funcionalidades como:

- autenticação JWT;
- recuperação do usuário autenticado;
- validação de permissões.

Fluxo:

```text
Request

↓

Middleware

↓

Controller
```

---

# Routes

As rotas apenas registram os endpoints da aplicação.

Exemplo:

```text
/auth

/empresas

/projetos
```

Toda lógica permanece nos Controllers.

---

# Modules

A pasta `modules` representa o núcleo da aplicação.

Cada módulo é independente.

Exemplo:

```text
modules/

auth/

empresa/

projeto/
```

Cada módulo encapsula completamente sua responsabilidade.

---

# Estrutura de um módulo

Todos seguem o mesmo padrão.

```text
empresa/

empresa.controller.ts

empresa.service.ts

empresa.repository.ts

empresa.schema.ts
```

---

## Controller

Responsável pela camada HTTP.

Funções:

- receber requisição;
- chamar validação;
- executar Service;
- devolver resposta.

Não possui regra de negócio.

---

## Service

Contém toda a lógica da aplicação.

Responsável por:

- validações;
- regras;
- permissões;
- verificações;
- decisões de negócio.

É considerado o coração do backend.

---

## Repository

Camada responsável pelo acesso ao banco.

Toda comunicação com o Prisma acontece aqui.

Isso evita que Services conheçam detalhes de persistência.

---

## Schema

Responsável pela validação utilizando Zod.

Todas as entradas da API são validadas antes de chegarem à regra de negócio.

---

# Fluxo de execução

Uma requisição percorre as seguintes etapas.

```text
Cliente

↓

Fastify

↓

Middleware

↓

Controller

↓

Schema

↓

Service

↓

Repository

↓

Prisma

↓

PostgreSQL
```

Depois o fluxo retorna no sentido inverso.

---

# Comunicação entre camadas

A comunicação sempre ocorre em apenas uma direção.

```text
Controller

↓

Service

↓

Repository
```

Nunca ocorre:

```text
Repository

↓

Controller
```

Nem:

```text
Repository

↓

Service

↓

Controller

↓

Repository
```

Essa organização evita dependências circulares.

---

# Validação de dados

Toda entrada passa por Schemas Zod.

Exemplo:

```text
Body

↓

Schema

↓

Dados válidos

↓

Service
```

Caso a validação falhe, a requisição é encerrada imediatamente.

---

# Tratamento de exceções

Ao invés de retornar códigos HTTP diretamente dentro dos Services, são lançadas exceções.

Exemplo:

```text
throw new RecursoDuplicadoError(...)
```

Essas exceções são capturadas pelo Error Handler global.

Isso mantém os Services independentes do Fastify.

---

# Banco de dados

O backend utiliza PostgreSQL como banco principal.

Características:

- relacional;
- suporte a transações;
- alta confiabilidade;
- excelente integração com Prisma.

Todo acesso ao banco ocorre através do Prisma ORM.

---

# Prisma

O Prisma fornece:

- tipagem automática;
- migrations;
- relacionamento entre entidades;
- consultas seguras.

Ele atua como camada de abstração entre a aplicação e o PostgreSQL.

---

# Autenticação

O backend utiliza JWT.

Fluxo resumido:

```text
Login

↓

Validação

↓

Geração do Token

↓

Cliente envia Bearer Token

↓

Middleware

↓

Usuário autenticado
```

Os detalhes completos estão documentados em **AUTH.md**.

---

# Organização por domínio

A aplicação cresce adicionando novos módulos.

Exemplo:

```text
modules/

auth

empresa

projeto

sprint

tarefa

comentario

convite

dashboard
```

Cada módulo possui seu próprio ciclo de vida.

---

# Escalabilidade

A arquitetura atual facilita:

- criação de novos módulos;
- reutilização de código;
- testes;
- manutenção.

Não existe necessidade de modificar módulos antigos para adicionar novas funcionalidades.

---

# Testabilidade

A separação entre camadas permite testar a regra de negócio isoladamente.

É possível criar testes para:

- Services;
- autenticação;
- permissões;
- endpoints;
- integrações.

Sem depender diretamente do framework HTTP.

---

# Convenções adotadas

## Controllers

- Não acessam banco.
- Não possuem regra de negócio.
- Não possuem SQL.
- Não possuem Prisma.

---

## Services

- Centralizam toda a lógica.
- Nunca retornam respostas HTTP.
- Nunca utilizam `reply.send()`.

---

## Repositories

- Apenas acesso ao banco.
- Nenhuma regra de negócio.
- Nenhuma validação.

---

## Schemas

- Apenas validação.
- Nenhuma consulta.
- Nenhuma lógica.

---

# Benefícios dessa arquitetura

- Código organizado
- Fácil manutenção
- Baixo acoplamento
- Fácil evolução
- Fácil criação de testes
- Melhor reaproveitamento de código
- Separação clara de responsabilidades

---

# Evolução prevista

Com o crescimento do projeto, novos módulos serão adicionados sem alterar a estrutura principal.

Entre eles:

- Sprint
- Tarefas
- Comentários
- Convites
- Uploads
- Dashboard
- Notificações
- Auditoria
- IA integrada

A arquitetura atual foi planejada para suportar essa evolução de forma consistente e organizada.
