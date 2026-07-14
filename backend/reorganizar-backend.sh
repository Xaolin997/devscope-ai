#!/usr/bin/env bash

set -e

echo "Criando estrutura por módulos..."

mkdir -p src/modules/auth
mkdir -p src/modules/empresas
mkdir -p src/modules/projetos
mkdir -p src/modules/usuarios
mkdir -p src/config
mkdir -p src/middlewares
mkdir -p src/types
mkdir -p src/utils

mover_se_existir() {
  origem="$1"
  destino="$2"

  if [ -f "$origem" ]; then
    echo "Movendo $origem -> $destino"
    mv "$origem" "$destino"
  else
    echo "Ignorado: $origem não existe"
  fi
}

mover_se_existir \
  "src/controllers/auth.controller.ts" \
  "src/modules/auth/auth.controller.ts"

mover_se_existir \
  "src/services/auth.service.ts" \
  "src/modules/auth/auth.service.ts"

mover_se_existir \
  "src/routes/auth.routes.ts" \
  "src/modules/auth/auth.routes.ts"

mover_se_existir \
  "src/repositories/usuario.repository.ts" \
  "src/modules/auth/usuario.repository.ts"

mover_se_existir \
  "src/controllers/empresa.controller.ts" \
  "src/modules/empresas/empresa.controller.ts"

mover_se_existir \
  "src/services/empresa.service.ts" \
  "src/modules/empresas/empresa.service.ts"

mover_se_existir \
  "src/routes/empresa.routes.ts" \
  "src/modules/empresas/empresa.routes.ts"

mover_se_existir \
  "src/repositories/empresa.repository.ts" \
  "src/modules/empresas/empresa.repository.ts"

mover_se_existir \
  "src/routes/projeto.routes.ts" \
  "src/modules/projetos/projeto.routes.ts"

echo
echo "Removendo apenas pastas vazias antigas..."

rmdir src/controllers 2>/dev/null || true
rmdir src/services 2>/dev/null || true
rmdir src/routes 2>/dev/null || true
rmdir src/repositories 2>/dev/null || true

echo
echo "Estrutura final:"
find src -maxdepth 4 -type f | sort

echo
echo "Reorganização concluída."
echo "Agora será necessário corrigir os caminhos dos imports."