# Arquitetura

## Visão geral

O backend segue uma arquitetura modular em camadas:

```text
Requisição HTTP
      ↓
Rotas e middlewares
      ↓
Controllers
      ↓
Services
      ↓
Repositories
      ↓
Prisma ORM
      ↓
PostgreSQL
```

## Responsabilidades

### Rotas

Registram endpoints, middlewares, metadados OpenAPI e controladores.

### Controllers

Recebem dados HTTP, validam entradas com Zod, chamam serviços e definem códigos de resposta.

### Services

Concentram regras de negócio, permissões, validações de período, duplicidade e existência de recursos.

### Repositories

Executam operações de persistência utilizando Prisma.

### Tratamento de erros

As regras de negócio lançam classes derivadas de `AppError`. O handler global converte essas exceções em respostas JSON padronizadas.

```json
{
  "erro": "Mensagem descritiva",
  "codigo": "CODIGO_DO_ERRO"
}
```

## Módulos atuais

```text
src/modules/
├── auth/
├── empresas/
└── projetos/
```

## Fluxo de autenticação

```text
POST /auth/login
      ↓
Validação de credenciais
      ↓
Geração do JWT
      ↓
Authorization: Bearer <token>
      ↓
Middleware verificarAutenticacao
      ↓
request.user
```

## Decisões relevantes

- Fastify para camada HTTP.
- Zod para validação de entrada.
- Prisma para acesso tipado ao PostgreSQL.
- JWT stateless durante a fase atual do backend.
- Injeção manual de dependências para manter simplicidade.
- Módulos separados por domínio.
