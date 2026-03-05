---
name: rs-angular-intro-deploy-netlify
description: "Generates Netlify deployment configuration for Angular applications. Use when user asks to 'deploy Angular app', 'configure Netlify', 'publish Angular project', 'setup deploy for Angular', or 'create netlify.toml'. Applies correct build command, publish directory with /browser path, and SPA redirects. Make sure to use this skill whenever deploying any Angular application to Netlify. Not for non-Angular frameworks, Vercel, or other hosting platforms."
---

# Deploy de Aplicacao Angular no Netlify

> Configure o projeto Angular para deploy no Netlify com build de producao, publish directory correto e redirects SPA.

## Prerequisites

- Projeto Angular funcional com `ng build` operacional
- Repositorio Git com remote no GitHub
- Conta no Netlify (gratuita)

## Steps

### Step 1: Criar netlify.toml na raiz do projeto

```toml
[build]
  command = "ng build --configuration production"
  publish = "dist/{nome-do-projeto}/browser"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 2: Verificar o publish path correto

Consultar `angular.json` no campo `outputPath` para confirmar o caminho exato. Angular gera uma subpasta `browser` dentro de `dist/{projeto}/`, porque o publish deve incluir `/browser`.

### Step 3: Testar build localmente

```bash
ng build --configuration production
```

Verificar que a pasta `dist/{nome-do-projeto}/browser` contem `index.html` e os assets.

### Step 4: Commit e push

```bash
git add .
git commit -m "chore: add netlify deploy configuration"
git push
```

### Step 5: Configurar no Netlify

1. Acessar netlify.com → Sign up / Login
2. Conectar conta GitHub e autorizar Netlify
3. Selecionar o repositorio
4. Netlify detecta automaticamente as configuracoes do `netlify.toml`
5. Clicar em Deploy

## Output format

Arquivo `netlify.toml` na raiz do projeto com:
- Build command de producao
- Publish directory apontando para `dist/{projeto}/browser`
- Redirect SPA catch-all para `index.html`

## Error handling

- Se build falhar com warning de budget: verificar `angular.json` → `budgets` e ajustar limites ou otimizar bundle
- Se deploy resultar em 404 nas rotas: confirmar que o bloco `[[redirects]]` esta presente no `netlify.toml`
- Se pagina em branco apos deploy: verificar que o publish path inclui `/browser` — Angular gera essa subpasta automaticamente

## Verification

- Acessar URL gerada pelo Netlify
- Navegar entre rotas da aplicacao (SPA routing deve funcionar)
- Testar funcionalidades principais em producao

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `publish = "dist/{projeto}"` (sem /browser) | `publish = "dist/{projeto}/browser"` |
| `ng build` sem `--configuration production` | `ng build --configuration production` |
| Omitir redirects em SPA Angular | Incluir `[[redirects]]` para catch-all |
| Hardcodar o path sem verificar `angular.json` | Consultar `outputPath` no `angular.json` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
