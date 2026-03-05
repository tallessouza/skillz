---
name: rs-full-stack-publicando-github-despedida
description: "Guides publishing static projects to GitHub and deploying with GitHub Pages. Use when user asks to 'publish to GitHub', 'deploy with GitHub Pages', 'host my static site', or 'make my project live'. Covers git commit workflow, GitHub Pages configuration from settings, and repository best practices like README and descriptions. Make sure to use this skill whenever deploying a simple static frontend project. Not for CI/CD pipelines, custom domains, or server-side deployments."
---

# Publicando no GitHub com GitHub Pages

> Projetos estaticos (HTML/CSS/JS) vao do commit ao deploy publico em menos de 5 minutos usando GitHub Pages.

## Steps

### Step 1: Preparar o repositorio local

```bash
# Remover configuracoes de desenvolvimento (zoom, debug, etc.)
# Commitar com mensagem descritiva
git add .
git commit -m "feat: finalize project for production"
```

### Step 2: Publicar no GitHub

```bash
# Se ainda nao tem remote configurado
gh repo create nome-do-projeto --public --source=. --push

# Se ja tem remote
git push origin main
```

Publicar como **public** porque GitHub Pages gratuito exige repositorio publico.

### Step 3: Configurar GitHub Pages

1. Abrir o repositorio no GitHub
2. **Settings** → **Pages**
3. Source: selecionar branch `main`
4. Pasta: `/ (root)` (ou `/docs` se aplicavel)
5. **Save**
6. Aguardar ~1 minuto para o deploy

### Step 4: Adicionar descricao e README

```bash
# Adicionar descricao no repositorio
gh repo edit --description "Projeto para treinar animacoes CSS na trilha Full Stack Rocketseat"

# Adicionar link do GitHub Pages como website
gh repo edit --homepage "https://usuario.github.io/nome-do-projeto"
```

Criar um README com imagem do projeto e link funcionando.

## Output format

Repositorio publico com:
- Codigo commitado e limpo (sem configs de debug)
- GitHub Pages ativo servindo o site
- Descricao preenchida no repositorio
- README com preview visual do projeto

## Verification

```bash
# Verificar se o site esta no ar
curl -I https://usuario.github.io/nome-do-projeto
# Esperar HTTP 200
```

## Error handling

- Se GitHub Pages nao aparece em Settings: verificar se o repositorio e publico
- Se o site mostra 404 apos deploy: aguardar 2-3 minutos, GitHub Pages demora no primeiro deploy
- Se o CSS nao carrega: verificar se os caminhos dos arquivos sao relativos (sem `/` absoluto)

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto so tem HTML/CSS/JS | GitHub Pages direto da branch main |
| Projeto usa build step (React, Next) | Precisa de GitHub Actions ou branch gh-pages |
| Quer dominio customizado | Configure CNAME no GitHub Pages settings |
| README vazio | Adicione screenshot, descricao e link do deploy |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Publicar com configs de debug (zoom, console.log) | Limpar antes de commitar |
| Deixar repositorio sem descricao | Sempre preencher descricao e homepage |
| README padrao vazio | README com imagem do projeto e link |
| Commitar e nao verificar se o deploy funcionou | Abrir o link e testar no navegador |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre GitHub Pages e boas praticas de publicacao
- [code-examples.md](references/code-examples.md) — Exemplos completos de README e configuracoes