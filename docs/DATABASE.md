# Banco de dados

## Tecnologia

- PostgreSQL
- Prisma ORM
- Migrações versionadas em `backend/prisma/migrations`

## Entidades

### Usuario

- `id`
- `nome`
- `email`
- `senhaHash`
- `criadoEm`
- `atualizadoEm`

### Empresa

- `id`
- `nome`
- `nomeNormalizado`
- `criadoPorId`
- `criadoEm`
- `atualizadoEm`

A combinação `criadoPorId + nomeNormalizado` é única.

### MembroEmpresa

Relaciona usuário e empresa.

- `id`
- `cargo`
- `usuarioId`
- `empresaId`
- `criadoEm`

A combinação `usuarioId + empresaId` é única.

### Projeto

- `id`
- `nome`
- `nomeNormalizado`
- `descricao`
- `status`
- `dataInicio`
- `dataLimite`
- `empresaId`
- `criadoEm`
- `atualizadoEm`

A combinação `empresaId + nomeNormalizado` é única.

## Relacionamentos

```text
Usuario 1 ── N MembroEmpresa N ── 1 Empresa
Empresa 1 ── N Projeto
```

## Comandos úteis

```bash
pnpm prisma validate
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma migrate deploy
pnpm prisma studio
```
