# Code Examples: Colocando o Projeto no GitHub

## Fluxo completo demonstrado na aula

### 1. Criar repositório no GitHub (via interface web)

```
GitHub.com → Perfil → "+" → New repository
  Nome: rocket-log-deploy
  Visibilidade: Private
  README: NÃO (deixar vazio)
  License: NÃO
  .gitignore: NÃO (já existe no projeto)
→ Create repository
```

### 2. Inicializar git e fazer primeiro commit

```bash
# Inicializar repositório git local
git init

# Adicionar todos os arquivos (respeitando .gitignore)
git add .

# Commit com conventional commit
git commit -m "chore: deploy config"
```

### 3. Conectar e enviar ao GitHub

```bash
# Adicionar remote (HTTPS)
git remote add origin https://github.com/usuario/rocket-log-deploy.git

# Enviar para o GitHub com tracking
git push -u origin main
```

## Variação: usando GitHub CLI

```bash
# Criar repo direto do terminal (alternativa à interface web)
gh repo create rocket-log-deploy --private --source=. --remote=origin

# Commit e push
git add .
git commit -m "chore: deploy config"
git push -u origin main
```

## Variação: usando SSH em vez de HTTPS

```bash
# Remote com SSH (não pede senha a cada push)
git remote add origin git@github.com:usuario/rocket-log-deploy.git
git push -u origin main
```

## .gitignore típico para projeto Node.js

```gitignore
# Dependências
node_modules/

# Build artifacts
build/
dist/

# Variáveis de ambiente
.env

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db
```

## Cenário: arquivo sensível commitado por engano

```bash
# Remover .env do tracking (sem deletar o arquivo local)
git rm --cached .env

# Garantir que está no .gitignore
echo ".env" >> .gitignore

# Commitar a correção
git add .gitignore
git commit -m "fix: remove .env from tracking"

# Se já fez push, o arquivo ainda existe no histórico
# Para projetos sérios, rotacione as secrets expostas
git push
```

## Cenário: repo criado com README (conflito no push)

```bash
# Se git push falhar com "rejected - non-fast-forward"
git pull --rebase origin main

# Agora o push funciona
git push -u origin main
```

## Cenário: verificar se remote foi configurado corretamente

```bash
# Listar remotes configurados
git remote -v
# Esperado:
# origin  https://github.com/usuario/rocket-log-deploy.git (fetch)
# origin  https://github.com/usuario/rocket-log-deploy.git (push)
```

## Cenário: mudar URL do remote

```bash
# Se errou a URL
git remote set-url origin https://github.com/usuario/url-correta.git

# Verificar
git remote -v
```

## Verificação pós-push

```bash
# Verificar status limpo
git status
# Esperado: "nothing to commit, working tree clean"

# Verificar que o remote está conectado
git log --oneline origin/main
# Deve mostrar o commit "chore: deploy config"
```