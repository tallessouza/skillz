# Code Examples: Deploy Next.js na Vercel

## Preparacao do repositorio para deploy

### Verificar status do repositorio

```bash
# Verificar se tem mudancas pendentes
git status

# Verificar branch atual
git branch --show-current
# Output: migration-to-app-router (ou sua branch de feature)
```

### Fazer push da branch de feature

```bash
# Adicionar e commitar mudancas
git add .
git commit -m "feat: complete migration to app router"

# Enviar para o repositorio remoto
git push origin migration-to-app-router
```

### Criar PR e fazer merge via GitHub CLI

```bash
# Criar pull request
gh pr create --base main --head migration-to-app-router \
  --title "Migration to App Router" \
  --body "Complete migration from pages to app router"

# Fazer merge (apos review)
gh pr merge --merge
```

### Criar PR e fazer merge via interface GitHub

1. Acessar o repositorio no GitHub
2. Clicar em "Compare & pull request" (aparece automaticamente apos push)
3. Revisar os commits incluidos
4. Clicar em "Create pull request"
5. Clicar em "Merge pull request" → "Confirm merge"

## Deploy na Vercel — Passo a passo visual

### Via Dashboard (metodo manual mostrado na aula)

```
1. Acessar vercel.com → Login com GitHub
2. Dashboard → "Add New" → "Project"
3. Selecionar repositorio da lista (mais recente aparece primeiro)
4. Framework Preset: Next.js (detectado automaticamente)
5. Environment Variables: adicionar se necessario
6. Clicar "Deploy"
```

### Via CLI (metodo alternativo mencionado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (na raiz do projeto)
vercel

# Deploy direto para producao
vercel --prod
```

## Configuracao de variaveis de ambiente

### No dashboard da Vercel

```
Settings → Environment Variables

Exemplo:
Key: DATABASE_URL
Value: postgresql://user:pass@host:5432/db
Environments: Production, Preview, Development
```

### Via CLI

```bash
# Adicionar variavel
vercel env add DATABASE_URL production

# Listar variaveis
vercel env ls
```

## Verificacao pos-deploy

### Acessar a aplicacao deployada

```
# URL de producao (formato padrao)
https://{nome-do-projeto}.vercel.app

# URL de preview (gerada por PR)
https://{nome-do-projeto}-{hash}-{username}.vercel.app
```

### Verificar build logs

```
Dashboard → Projeto → Deployments → Selecionar deploy → Build Logs
```

Exemplo de output de build bem-sucedido:
```
Cloning github.com/user/project...
Installing dependencies...
Running "next build"...

Route (app)                    Size     First Load JS
┌ ○ /                          5.2 kB   89.1 kB
├ ○ /blog                      3.1 kB   87 kB
├ ● /blog/[slug]               4.8 kB   88.7 kB
└ ○ /about                     2.9 kB   86.8 kB

✓ Compiled successfully
```

### Verificar runtime logs

```
Dashboard → Projeto → Logs (ou Deployments → Functions)
```

Exemplo de runtime logs:
```
GET /           200  12ms
GET /blog       200  15ms
GET /blog/1     200  18ms
GET /blog/2     200  16ms
```

## Deploy automatico (fluxo padrao em producao)

Apos a primeira configuracao, o fluxo se torna automatico:

```
git push origin main
# → Vercel detecta push automaticamente
# → Inicia build
# → Deploy em producao se build for bem-sucedido

git push origin feature-branch
# → Se PR aberta, Vercel cria deploy de preview
# → URL de preview disponivel nos checks da PR no GitHub
```