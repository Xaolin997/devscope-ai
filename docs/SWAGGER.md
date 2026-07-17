# Swagger e OpenAPI

## Acesso

Com o backend em execução:

```text
http://localhost:3333/docs
```

O documento JSON pode ser obtido em:

```text
http://localhost:3333/docs/json
```

## Dependências

```bash
pnpm add @fastify/swagger @fastify/swagger-ui
```

As dependências já foram adicionadas ao `package.json` deste pacote, mas o lockfile deve ser atualizado com `pnpm install`.

## Autorização

Use o botão **Authorize** na interface e informe apenas o JWT. O esquema Bearer adicionará o prefixo correto.

## Atualização da documentação

Cada rota contém um objeto `schema` com:

- tags
- resumo
- descrição
- parâmetros
- corpo
- respostas
- configuração de segurança

Ao criar ou alterar um endpoint, atualize esse schema no mesmo commit. Separar documentação e código em momentos diferentes é uma forma bastante eficiente de garantir que um deles comece a mentir.
