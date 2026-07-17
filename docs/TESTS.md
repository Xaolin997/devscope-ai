# Testes

## Ferramentas

- Vitest
- Fastify `inject`
- PostgreSQL de teste
- dotenv-cli

## Cobertura atual

- Health check
- Cadastro
- Perfil autenticado
- Empresas
- Projetos

## Executar

```bash
cd backend
pnpm test:db:prepare
pnpm test
```

Modo observação:

```bash
pnpm test:watch
```

Cobertura:

```bash
pnpm test:coverage
```

## Isolamento

Os testes utilizam `.env.test` e helper de limpeza do banco. Nunca aponte esse arquivo para um banco importante, a menos que o objetivo seja transformar uma tarde tranquila em arqueologia de dados.
