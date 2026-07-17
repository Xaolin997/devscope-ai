# API

## Base URL

```text
http://localhost:3333
```

## Autenticação

Rotas protegidas exigem:

```http
Authorization: Bearer <token>
```

## Resposta de erro

```json
{
  "erro": "Mensagem",
  "codigo": "CODIGO"
}
```

Erros de validação também podem incluir `detalhes`.

## Rotas

### Saúde

#### `GET /health`

Retorna o estado básico do serviço.

### Autenticação

#### `POST /auth/cadastro`

```json
{
  "nome": "Kayo Moura",
  "email": "kayo@example.com",
  "senha": "senha123"
}
```

#### `POST /auth/login`

```json
{
  "email": "kayo@example.com",
  "senha": "senha123"
}
```

Resposta:

```json
{
  "usuario": {
    "id": "uuid",
    "nome": "Kayo Moura",
    "email": "kayo@example.com"
  },
  "token": "jwt"
}
```

#### `GET /auth/perfil`

Retorna `usuarioId` e `email` extraídos do JWT.

### Empresas

Todas exigem autenticação.

- `POST /empresas/`
- `GET /empresas/`
- `GET /empresas/:id`
- `PATCH /empresas/:id`
- `DELETE /empresas/:id`

Criação e atualização:

```json
{
  "nome": "DevScope Tecnologia"
}
```

### Projetos

Todas exigem autenticação.

- `POST /empresas/:empresaId/projetos`
- `GET /empresas/:empresaId/projetos`
- `GET /empresas/:empresaId/projetos/:projetoId`
- `PATCH /empresas/:empresaId/projetos/:projetoId`
- `DELETE /empresas/:empresaId/projetos/:projetoId`

Criação:

```json
{
  "nome": "Portal do Cliente",
  "descricao": "Novo portal web",
  "status": "ATIVO",
  "dataInicio": "2026-07-17T12:00:00.000Z",
  "dataLimite": "2026-12-01T12:00:00.000Z"
}
```

Status aceitos:

- `ATIVO`
- `PAUSADO`
- `CONCLUIDO`
- `CANCELADO`

## Documentação interativa

Acesse:

```text
http://localhost:3333/docs
```
