# Contribuição

## Preparação

```bash
git clone <URL_DO_REPOSITORIO>
cd devscope-ai
pnpm install
```

Configure os arquivos `.env`, suba o PostgreSQL e aplique as migrações.

## Antes de enviar mudanças

No backend:

```bash
pnpm verify
```

## Convenções

- Mantenha regras de negócio nos services.
- Mantenha consultas nos repositories.
- Valide entradas com Zod.
- Use erros de domínio.
- Adicione testes para novas regras.
- Atualize a documentação OpenAPI da rota.
- Não envie `.env`, `node_modules`, arquivos gerados temporários ou bancos locais.

## Commits

Prefira commits pequenos e descritivos, por exemplo:

```text
feat(projetos): adicionar filtro por status
fix(auth): impedir login com email inválido
docs(api): documentar atualização de empresa
test(empresas): cobrir exclusão sem permissão
```
