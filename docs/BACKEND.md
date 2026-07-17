# Backend

## Estrutura

```text
backend/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── config/
│   ├── errors/
│   ├── generated/
│   ├── helpers/
│   ├── middlewares/
│   ├── modules/
│   ├── plugins/
│   ├── types/
│   ├── app.ts
│   └── server.ts
├── tests/
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── vitest.config.ts
```

## Inicialização

`server.ts` carrega variáveis de ambiente, cria a aplicação e escuta em `0.0.0.0`. A porta padrão é `3333`.

`app.ts` registra:

- CORS
- rate limiting
- JWT
- Swagger/OpenAPI
- handler global de erros
- rotas de autenticação
- rotas de empresas
- rotas de projetos
- health check

## Scripts principais

```bash
pnpm dev
pnpm build
pnpm start
pnpm typecheck
pnpm test
pnpm test:watch
pnpm test:coverage
pnpm prisma:validate
pnpm verify
```

## Convenções

- Arquivos TypeScript usam módulos ES.
- Imports internos compilados usam extensão `.js`.
- Controllers não acessam Prisma diretamente.
- Services não conhecem objetos HTTP.
- Repositories não definem regras de negócio.
- Entradas externas são validadas com Zod.
