# Arquitetura do Sistema

## Visão Geral

O DevScope AI foi projetado utilizando uma arquitetura em camadas (Layered Architecture), com forte separação de responsabilidades entre os módulos da aplicação.

O principal objetivo dessa arquitetura é facilitar:

- manutenção;
- escalabilidade;
- testes automatizados;
- reutilização de código;
- desacoplamento entre regras de negócio e infraestrutura.

Embora seja um projeto em desenvolvimento, sua estrutura segue princípios utilizados em aplicações de médio e grande porte.

---

# Arquitetura Geral

```text
                Cliente

                   │
                   ▼

             HTTP Request

                   │
                   ▼

              Fastify Router

                   │
                   ▼

              Controller Layer

                   │
                   ▼

               Service Layer

                   │
                   ▼

            Repository Layer

                   │
                   ▼

               Prisma ORM

                   │
                   ▼

              PostgreSQL
```

Cada camada possui uma responsabilidade específica.

---

# Camadas

## Controllers

Os Controllers representam a entrada da aplicação.

São responsáveis por:

- receber requisições;
- validar dados utilizando Zod;
- chamar os Services;
- retornar respostas HTTP.

Eles **não possuem regra de negócio**.

Exemplo:

```text
POST /empresas
        │
        ▼
EmpresaController
        │
        ▼
EmpresaService
```

Um Controller deve ser simples.

Exemplo de responsabilidades:

✔ Ler parâmetros

✔ Ler body

✔ Ler query

✔ Ler usuário autenticado

✔ Chamar o Service

✔ Retornar resposta

Ele nunca deve:

- acessar o banco;
- executar lógica de negócio;
- tratar regras de permissão.

---

# Services

Os Services representam o coração da aplicação.

Toda regra de negócio deve existir aqui.

Exemplos:

- verificar permissões;
- validar datas;
- impedir duplicidade;
- validar existência;
- lançar exceções.

Exemplo:

```text
Criar Projeto

↓

Verificar empresa

↓

Verificar usuário

↓

Verificar nome duplicado

↓

Criar projeto

↓

Retornar resultado
```

O Service não conhece HTTP.

Ele não sabe o que é:

- Fastify
- Request
- Response

Ele trabalha apenas com dados.

---

# Repositories

Os Repositories são responsáveis pelo acesso ao banco de dados.

Toda comunicação com o Prisma acontece nessa camada.

Exemplo:

```text
ProjetoService

↓

ProjetoRepository

↓

Prisma

↓

Banco
```

Isso permite trocar o ORM futuramente sem alterar a regra de negócio.

---

# Prisma ORM

O Prisma é utilizado como camada de persistência.

Responsabilidades:

- consultas;
- inserções;
- atualizações;
- exclusões;
- relacionamentos.

O restante da aplicação não conversa diretamente com o banco.

Sempre existe um Repository intermediando.

---

# Banco de Dados

Atualmente o banco utilizado é:

```text
PostgreSQL
```

O banco é executado utilizando Docker.

Toda evolução da estrutura é feita através de migrations do Prisma.

---

# Organização por módulos

A aplicação segue uma arquitetura modular.

Cada módulo possui seus próprios arquivos.

Exemplo:

```text
modules/

auth/

empresa/

projeto/

sprint/

tarefa/
```

Cada módulo é praticamente independente dos demais.

---

# Estrutura interna de um módulo

Todos os módulos seguem o mesmo padrão.

```text
empresa/

empresa.controller.ts

empresa.service.ts

empresa.repository.ts

empresa.schema.ts
```

Cada arquivo possui uma responsabilidade única.

---

## Controller

Responsável pela comunicação HTTP.

---

## Service

Responsável pela regra de negócio.

---

## Repository

Responsável pelo banco.

---

## Schema

Responsável pela validação utilizando Zod.

---

# Fluxo de uma requisição

Exemplo:

```text
POST /empresas
```

Fluxo completo:

```text
Cliente

↓

Fastify

↓

Middleware JWT

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

↓

Repository

↓

Service

↓

Controller

↓

Response
```

---

# Autenticação

A autenticação acontece através de JWT.

Fluxo:

```text
Login

↓

Validação

↓

JWT

↓

Cliente envia Bearer Token

↓

Middleware

↓

Usuário autenticado
```

O middleware adiciona as informações do usuário na requisição.

Assim os Controllers não precisam validar tokens manualmente.

---

# Tratamento de erros

A aplicação utiliza exceções específicas.

Exemplo:

```text
Controller

↓

Service

↓

throw RecursoDuplicadoError

↓

Global Error Handler

↓

HTTP 409
```

Isso elimina dezenas de blocos try/catch espalhados pela aplicação.

---

# Hierarquia de entidades

Atualmente o sistema possui a seguinte estrutura.

```text
Usuário

│

├── Empresas

│

└── Empresa

        │

        ├── Projetos

        │

        └── Projeto

                │

                ├── Sprints (em desenvolvimento)

                │

                └── Sprint

                        │

                        ├── Tarefas (planejado)

                        │

                        └── Comentários
```

Essa hierarquia facilita controle de permissões e isolamento de dados.

---

# Injeção de dependências

No momento a aplicação utiliza injeção manual.

Exemplo:

```text
Controller

↓

Service

↓

Repository
```

Não existe utilização de containers como:

- Inversify
- Tsyringe
- NestJS DI

Para o tamanho atual do projeto, isso mantém o código simples e de fácil entendimento.

---

# Organização das exceções

Todas as exceções herdam da classe base:

```text
AppError
```

Atualmente existem erros específicos para:

- dados inválidos;
- credenciais inválidas;
- recurso duplicado;
- recurso inexistente;
- falta de permissão;
- token inválido.

Essa abordagem mantém o tratamento de erros consistente em toda a aplicação.

---

# Testabilidade

A arquitetura foi planejada para facilitar testes.

Como os Services não dependem diretamente do Fastify, torna-se simples criar testes para:

- regras de negócio;
- autenticação;
- permissões;
- validações.

Os testes de integração utilizam um banco isolado.

---

# Escalabilidade

A estrutura atual permite crescimento sem necessidade de reorganização.

Novos módulos podem ser adicionados seguindo exatamente o mesmo padrão.

Exemplo:

```text
modules/

sprint/

tarefa/

comentario/

convite/

dashboard/

notificacao/
```

Sem alterar a estrutura existente.

---

# Decisões Arquiteturais

## Utilizar Fastify

Escolhido pela alta performance, baixo consumo de recursos e excelente suporte ao TypeScript.

---

## Utilizar Prisma

Escolhido por oferecer:

- tipagem completa;
- migrations;
- excelente integração com TypeScript;
- produtividade.

---

## Utilizar PostgreSQL

Banco relacional robusto, amplamente utilizado em aplicações de produção.

---

## Utilizar arquitetura em camadas

A separação entre Controllers, Services e Repositories facilita:

- manutenção;
- reutilização;
- testes;
- escalabilidade.

---

## Utilizar Zod

Toda validação de entrada acontece utilizando Schemas.

Isso elimina validações espalhadas pelos Controllers.

---

## Utilizar Domain Errors

As regras de negócio lançam exceções específicas em vez de códigos HTTP.

Isso desacopla a regra de negócio da camada de transporte.

---

# Próximos passos da arquitetura

A arquitetura continuará evoluindo com:

- módulo de Sprint;
- módulo de Tarefas;
- sistema de Convites;
- Upload de arquivos;
- Auditoria;
- Sistema de Notificações;
- Dashboard;
- IA para apoio ao gerenciamento de projetos.

A estrutura atual foi planejada para acomodar essas funcionalidades sem necessidade de grandes refatorações.
