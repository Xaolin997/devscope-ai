# API REST

## Visão Geral

O DevScope AI disponibiliza uma API REST responsável por toda a comunicação entre clientes e o backend.

A API foi desenvolvida seguindo boas práticas REST, utilizando:

- HTTP Status Codes
- JSON
- JWT Authentication
- Zod Validation
- Domain Errors
- Versionamento preparado

---

# URL Base

Durante o desenvolvimento:

```http
http://localhost:3333
```

Em produção:

```http
https://api.devscopeai.com
```

---

# Formato das Requisições

Todas as requisições utilizam JSON.

Exemplo:

```http
POST /auth/login
Content-Type: application/json
```

Body:

```json
{
  "email": "usuario@email.com",
  "senha": "123456"
}
```

---

# Formato das Respostas

Todas as respostas retornam JSON.

Exemplo:

```json
{
  "id": "c0a4...",
  "nome": "Projeto XPTO"
}
```

---

# Autenticação

A API utiliza JWT.

Após o login, o cliente recebe um token.

```json
{
  "usuario": {
    "id": "...",
    "nome": "..."
  },
  "token": "eyJhbGc..."
}
```

Esse token deve ser enviado nas próximas requisições.

```http
Authorization: Bearer TOKEN
```

---

# Códigos HTTP

| Código | Significado     |
| ------ | --------------- |
| 200    | Sucesso         |
| 201    | Criado          |
| 204    | Sem conteúdo    |
| 400    | Dados inválidos |
| 401    | Não autenticado |
| 403    | Sem permissão   |
| 404    | Não encontrado  |
| 409    | Conflito        |
| 500    | Erro interno    |

---

# Estrutura de Erros

Todos os erros seguem o mesmo padrão.

```json
{
  "erro": "Mensagem descritiva",
  "codigo": "CODIGO_DO_ERRO"
}
```

Exemplo:

```json
{
  "erro": "Projeto não encontrado.",
  "codigo": "RECURSO_NAO_ENCONTRADO"
}
```

---

# Módulo Auth

---

## POST /auth/cadastro

Cria um novo usuário.

### Body

```json
{
  "nome": "João",
  "email": "joao@email.com",
  "senha": "123456"
}
```

---

### Resposta

```http
201 Created
```

```json
{
  "id": "...",
  "nome": "João",
  "email": "joao@email.com"
}
```

---

### Possíveis erros

400

```json
{
  "codigo": "DADOS_INVALIDOS"
}
```

409

```json
{
  "codigo": "RECURSO_DUPLICADO"
}
```

---

## POST /auth/login

Autentica um usuário.

### Body

```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

---

### Resposta

```json
{
  "usuario": {
    "id": "...",
    "nome": "...",
    "email": "..."
  },
  "token": "JWT"
}
```

---

### Possíveis erros

401

```json
{
  "codigo": "CREDENCIAIS_INVALIDAS"
}
```

---

## GET /auth/perfil

Obtém o usuário autenticado.

### Headers

```http
Authorization: Bearer TOKEN
```

---

### Resposta

```json
{
  "id": "...",
  "nome": "...",
  "email": "..."
}
```

---

# Módulo Empresas

---

## POST /empresas

Cria uma empresa.

### Headers

```http
Authorization: Bearer TOKEN
```

---

### Body

```json
{
  "nome": "DevScope"
}
```

---

### Resposta

```http
201 Created
```

```json
{
  "id": "...",
  "nome": "DevScope"
}
```

---

### Erros

401

```json
{
  "codigo": "TOKEN_INVALIDO"
}
```

409

```json
{
  "codigo": "RECURSO_DUPLICADO"
}
```

---

## GET /empresas

Lista todas as empresas do usuário autenticado.

### Headers

```http
Authorization: Bearer TOKEN
```

---

### Resposta

```json
[
  {
    "id": "...",
    "nome": "Empresa A"
  },
  {
    "id": "...",
    "nome": "Empresa B"
  }
]
```

---

## GET /empresas/:id

Retorna uma empresa específica.

### Parâmetros

| Nome | Tipo |
| ---- | ---- |
| id   | UUID |

---

### Resposta

```json
{
  "id": "...",
  "nome": "Empresa"
}
```

---

### Erros

404

```json
{
  "codigo": "RECURSO_NAO_ENCONTRADO"
}
```

---

## PUT /empresas/:id

Atualiza uma empresa.

### Body

```json
{
  "nome": "Novo Nome"
}
```

---

### Resposta

```json
{
  "id": "...",
  "nome": "Novo Nome"
}
```

---

## DELETE /empresas/:id

Remove uma empresa.

---

### Resposta

```http
204 No Content
```

---

# Módulo Projetos

---

## POST /projetos

Cria um projeto.

### Body

```json
{
  "empresaId": "...",
  "nome": "API Financeira",
  "descricao": "..."
}
```

---

### Resposta

```json
{
  "id": "...",
  "nome": "API Financeira"
}
```

---

## GET /projetos

Lista os projetos do usuário.

---

### Resposta

```json
[
  {
    "id": "...",
    "nome": "...",
    "empresaId": "..."
  }
]
```

---

## GET /projetos/:id

Obtém um projeto específico.

---

### Resposta

```json
{
  "id": "...",
  "nome": "...",
  "descricao": "...",
  "empresaId": "..."
}
```

---

## PUT /projetos/:id

Atualiza um projeto.

---

### Body

```json
{
  "nome": "Novo Projeto",
  "descricao": "..."
}
```

---

### Resposta

```json
{
  "id": "...",
  "nome": "Novo Projeto"
}
```

---

## DELETE /projetos/:id

Remove um projeto.

---

### Resposta

```http
204 No Content
```

---

# Fluxo de Autenticação

```text
Login

↓

JWT

↓

Cliente armazena Token

↓

Authorization: Bearer

↓

Middleware

↓

Usuário autenticado

↓

Controller
```

---

# Fluxo de uma Requisição

```text
Cliente

↓

HTTP Request

↓

Fastify

↓

Middleware

↓

Controller

↓

Service

↓

Repository

↓

Prisma

↓

PostgreSQL
```

---

# Convenções

## UUID

Todos os identificadores utilizam UUID.

Exemplo:

```text
550e8400-e29b-41d4-a716-446655440000
```

---

## Datas

Todas as datas seguem o padrão ISO 8601.

```text
2026-07-18T14:35:21.923Z
```

---

## Content-Type

Todas as requisições utilizam:

```http
Content-Type: application/json
```

---

## Authorization

Rotas protegidas exigem:

```http
Authorization: Bearer TOKEN
```

---

# Rotas Públicas

- POST /auth/cadastro
- POST /auth/login

---

# Rotas Protegidas

- GET /auth/perfil

- POST /empresas
- GET /empresas
- GET /empresas/:id
- PUT /empresas/:id
- DELETE /empresas/:id

- POST /projetos
- GET /projetos
- GET /projetos/:id
- PUT /projetos/:id
- DELETE /projetos/:id

---

# Versionamento

A API foi estruturada para permitir versionamento futuro.

Exemplo:

```text
/api/v1/auth

/api/v1/empresas

/api/v1/projetos
```

Embora atualmente ainda utilize apenas a versão inicial.

---

# Próximos Endpoints

Os próximos módulos adicionarão novas rotas.

- Sprint
- Tarefas
- Comentários
- Convites
- Dashboard
- Uploads
- Notificações
- Auditoria

Todos seguirão o mesmo padrão de documentação apresentado neste arquivo.
