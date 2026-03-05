# Code Examples: Criando Repositorio para CI/CD

## Fluxo completo via terminal

### Criar repositorio via GitHub CLI

```bash
# Instalar gh se necessario
# https://cli.github.com/

# Criar repositorio privado
gh repo create skillz.ci.api \
  --private \
  --description "Primeiro projeto para testes de CI e CD"
```

### Criar via interface web

```
URL: https://github.com/new

Campos:
- Repository name: skillz.ci.api
- Description: Primeiro projeto para testes de CI e CD
- Visibility: Private
- Initialize: NAO marcar nenhuma opcao (sem README, sem .gitignore, sem license)
```

## Preparar projeto local

### Validar .gitignore

```gitignore
# .gitignore para projeto Node/NestJS
node_modules/
dist/
.cache/
.env
*.log
```

### Validacao pre-commit

```bash
# ANTES de git add, sempre verifique
git status

# Saida esperada — apenas arquivos desejados:
# Untracked files:
#   .gitignore
#   Dockerfile
#   docker-compose.yml
#   nest-cli.json
#   package.json
#   src/
#   tsconfig.json
#   ...

# Se aparecer algo indesejado como .cache/:
echo "/.cache" >> .gitignore
```

### Se ja fez git add com arquivos indesejados

```bash
# Remover do staging sem deletar o arquivo
git rm -r --cached .cache/

# Atualizar .gitignore
echo "/.cache" >> .gitignore

# Adicionar novamente
git add .
git status  # Confirmar que .cache nao aparece mais
```

## Primeiro commit e push

```bash
# Inicializar repositorio
git init

# Adicionar arquivos
git add .

# Validar
git status

# Commit com conventional commit
git commit -m "chore: first commit"

# Configurar branch principal
git branch -M main

# Conectar com repositorio remoto (SSH)
git remote add origin git@github.com:seu-usuario/skillz.ci.api.git

# Push inicial
git push -u origin main
```

## Alternativa com HTTPS

```bash
# Se nao tiver SSH configurado
git remote add origin https://github.com/seu-usuario/skillz.ci.api.git

# Push pedira usuario e token (Personal Access Token)
git push -u origin main
```

## Verificacao pos-push

```bash
# Via CLI
gh repo view skillz.ci.api --web

# Ou simplesmente acesse:
# https://github.com/seu-usuario/skillz.ci.api
```

## Estrutura esperada no repositorio

```
skillz.ci.api/
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── nest-cli.json
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── yarn.lock
└── src/
    ├── app.controller.ts
    ├── app.module.ts
    ├── app.service.ts
    └── main.ts
```