# Code Examples: Comandos Basicos para Repositorio Local Git

## Exemplo 1: Fluxo completo do zero

```bash
# Criar e entrar no diretorio do projeto
mkdir meu-app
cd meu-app

# Inicializar repositorio Git
git init
# Output: Initialized empty Git repository in /home/user/meu-app/.git/

# Criar alguns arquivos
echo "# Meu App" > README.md
echo "console.log('hello')" > index.js

# Verificar estado
git status
# Output:
# Untracked files:
#   README.md
#   index.js

# Adicionar tudo ao stage
git add .

# Verificar novamente — agora estao no stage
git status
# Output:
# Changes to be committed:
#   new file: README.md
#   new file: index.js

# Criar primeiro ponto na historia
git commit -m "create initial project with README and entry point"

# Ver historico
git log
# Output:
# commit abc123...
# Author: User <user@email.com>
# Date: ...
#
#     create initial project with README and entry point
```

## Exemplo 2: Adicao seletiva de arquivos

```bash
# Modificar varios arquivos
echo "body { margin: 0 }" > styles.css
echo "updated content" >> README.md
echo "SECRET_KEY=abc123" > .env

# Verificar o que mudou
git status
# Output:
# Changes not staged for commit:
#   modified: README.md
# Untracked files:
#   styles.css
#   .env

# Adicionar apenas o que queremos (NÃO o .env)
git add styles.css
git add README.md

# Verificar — .env nao esta no stage
git status
# Output:
# Changes to be committed:
#   modified: README.md
#   new file: styles.css
# Untracked files:
#   .env

# Commitar apenas os arquivos selecionados
git commit -m "add base styles and update README"
```

## Exemplo 3: Consultar historico com git log

```bash
# Log padrao (completo)
git log

# Log resumido (uma linha por commit)
git log --oneline
# Output:
# def456 add base styles and update README
# abc123 create initial project with README and entry point

# Log com grafo (util quando houver branches)
git log --oneline --graph
```

## Exemplo 4: Verificacao antes de cada commit

```bash
# SEMPRE antes de commitar:
git status

# Se tudo estiver correto no stage:
git commit -m "fix header alignment on mobile"

# Se precisar adicionar mais:
git add src/header.css
git commit -m "fix header alignment on mobile"
```

## Variacoes de git add

```bash
# Adicionar um arquivo especifico
git add index.js

# Adicionar uma pasta inteira
git add src/

# Adicionar todos os arquivos modificados e novos
git add .

# Adicionar apenas arquivos ja rastreados (ignorar novos)
git add -u

# Adicionar por padrao (todos os .js)
git add *.js
```

## Mensagens de commit — boas vs ruins

```bash
# RUINS — vagas, nao descrevem o ponto na historia
git commit -m "changes"
git commit -m "fix"
git commit -m "update"
git commit -m "wip"

# BOAS — descritivas, ate 50 caracteres
git commit -m "add user login validation"
git commit -m "fix cart total calculation"
git commit -m "remove unused API endpoints"
git commit -m "update README with setup instructions"
```