# Code Examples: Colocando o Projeto no GitHub

## Fluxo completo — Projeto novo para GitHub

```bash
# 1. Iniciar versionamento
git init

# 2. Verificar arquivos que serão adicionados
git status

# 3. Adicionar todos os arquivos ao staging
git add .

# 4. Verificar staging (tudo deve estar verde)
git status

# 5. Criar primeiro commit
git commit -m "v1 do projeto"

# 6. Conectar ao repositório remoto
git remote add origin https://github.com/seu-usuario/seu-projeto.git

# 7. Enviar para o GitHub
git push -u origin main
```

## Variações do commit inicial

```bash
# Mensagem simples
git commit -m "v1 do projeto"

# Mensagem com conventional commits
git commit -m "feat: initial project setup"

# Mensagem descritiva
git commit -m "chore: initial commit with React project structure"
```

## Quando a branch local é master (não main)

```bash
# Renomear branch local para main
git branch -M main

# Depois fazer push normalmente
git push -u origin main
```

## Quando o remote já existe

```bash
# Verificar remotes configurados
git remote -v

# Atualizar URL do remote existente
git remote set-url origin https://github.com/seu-usuario/novo-repo.git

# Ou remover e adicionar novamente
git remote remove origin
git remote add origin https://github.com/seu-usuario/novo-repo.git
```

## Quando criou repo com README por engano

```bash
# Opção 1: Forçar push (CUIDADO — sobrescreve o remoto)
git push -u origin main --force

# Opção 2: Pull com rebase e depois push
git pull origin main --rebase
git push -u origin main

# Opção 3: Permitir históricos não relacionados
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## Verificações úteis

```bash
# Ver remote configurado
git remote -v
# origin  https://github.com/usuario/projeto.git (fetch)
# origin  https://github.com/usuario/projeto.git (push)

# Ver branch atual
git branch
# * main

# Ver último commit
git log --oneline -1
# a1b2c3d v1 do projeto

# Ver status após push
git status
# On branch main
# Your branch is up to date with 'origin/main'.
# nothing to commit, working tree clean
```

## Adicionando arquivos seletivamente (alternativa ao git add .)

```bash
# Adicionar arquivo específico
git add src/App.tsx

# Adicionar pasta inteira
git add src/

# Adicionar por extensão
git add *.css

# Adicionar interativamente (escolher hunks)
git add -p
```

## Configuração git (se for a primeira vez)

```bash
# Configurar nome e email (necessário antes do primeiro commit)
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# Verificar configuração
git config --list
```

## Criando .gitignore antes do push

```bash
# Para projetos React/Node.js, certifique-se de ter .gitignore com:
cat .gitignore
# node_modules/
# dist/
# .env
# .env.local
```