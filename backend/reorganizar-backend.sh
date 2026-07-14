#!/usr/bin/env bash

set -e

echo "===================================="
echo " Organizando estrutura do DevScope "
echo "===================================="

echo
echo "Criando estrutura do backend..."

mkdir -p src/config
mkdir -p src/generated
mkdir -p src/middlewares
mkdir -p src/plugins
mkdir -p src/types
mkdir -p src/utils

mkdir -p src/modules/auth
mkdir -p src/modules/usuarios
mkdir -p src/modules/empresas
mkdir -p src/modules/projetos
mkdir -p src/modules/sprints
mkdir -p src/modules/tarefas
mkdir -p src/modules/comentarios
mkdir -p src/modules/github
mkdir -p src/modules/dashboard
mkdir -p src/modules/notificacoes
mkdir -p src/modules/ai

mkdir -p tests
mkdir -p scripts

echo
echo "Criando estrutura do frontend..."

mkdir -p ../frontend/features/auth
mkdir -p ../frontend/features/dashboard
mkdir -p ../frontend/features/empresa
mkdir -p ../frontend/features/projeto
mkdir -p ../frontend/features/tarefa
mkdir -p ../frontend/features/sprint

echo
echo "Criando packages..."

mkdir -p ../packages/shared

mkdir -p ../packages/shared/constants
mkdir -p ../packages/shared/enums
mkdir -p ../packages/shared/types
mkdir -p ../packages/shared/utils
mkdir -p ../packages/shared/schemas

echo
echo "Criando documentação..."

mkdir -p ../docs/api
mkdir -p ../docs/arquitetura
mkdir -p ../docs/banco
mkdir -p ../docs/deploy
mkdir -p ../docs/wireframes
mkdir -p ../docs/prints

echo
echo "Criando infraestrutura..."

mkdir -p ../infra/postgres/init
mkdir -p ../infra/postgres/backup

mkdir -p ../infra/nginx/conf.d

mkdir -p ../infra/scripts

mkdir -p ../.github/workflows

echo
echo "Criando arquivos caso não existam..."

touch ../ROADMAP.md

touch ../docs/api/README.md
touch ../docs/arquitetura/README.md
touch ../docs/banco/README.md
touch ../docs/deploy/README.md

touch ../packages/shared/README.md

touch ../infra/scripts/README.md

touch tests/.gitkeep
touch scripts/.gitkeep

echo
echo "===================================="
echo " Estrutura criada com sucesso!"
echo "===================================="