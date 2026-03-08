---
name: rs-full-stack-publicando-o-projeto
description: "Configures publishing static HTML/CSS projects to GitHub Pages. Use when user asks to 'deploy to GitHub Pages', 'publish my site', 'host on GitHub', 'make my project live', or 'share my project online'. Covers repository setup, GitHub Pages activation, and README presentation. Make sure to use this skill whenever deploying a static frontend project to GitHub. Not for CI/CD pipelines, custom domains, or server-side deployments."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: git-github
  tags:
    - github-pages
    - deploy
    - static-site
    - portfolio
---

# Publicando Projeto no GitHub Pages

> Publique projetos estaticos no GitHub Pages com repositorio bem apresentado para maximizar visibilidade.

## Prerequisites

- Git instalado e configurado
- Conta no GitHub com autenticacao configurada
- GitHub CLI (`gh`) instalado — se nao disponivel, use comandos git + interface web
- Projeto estatico (HTML/CSS/JS) pronto para deploy

## Steps

### Step 1: Criar repositorio no GitHub

```bash
# Criar repositorio publico (recomendado para portfolio)
gh repo create "nome-do-projeto" --public --source=. --push

# Se preferir privado (pode mudar depois)
gh repo create "nome-do-projeto" --private --source=. --push
```

Usar repositorio **publico** porque facilita compartilhamento e visibilidade no portfolio.

### Step 2: Habilitar GitHub Pages

```bash
# Via CLI
gh api repos/{owner}/{repo}/pages -X POST -f "build_type=legacy" -f "source[branch]=main" -f "source[path]=/"
```

Ou via interface web:
1. Settings → Pages
2. Source: selecionar branch `main`
3. Folder: `/ (root)`
4. Save

### Step 3: Configurar About do repositorio

1. Na pagina do repositorio, clicar no icone de engrenagem ao lado de "About"
2. Marcar "Use your GitHub Pages website" para preencher o link automaticamente
3. Adicionar descricao do projeto

### Step 4: Criar README apresentavel

```markdown
# Nome do Projeto

![Preview do projeto](./screenshot.png)

## Sobre

Descricao do projeto explicando o que faz e tecnologias usadas.

## Tecnologias

- HTML5
- CSS3

## Deploy

Acesse: [Link do GitHub Pages](https://usuario.github.io/nome-do-projeto)
```

Referencia de qualidade: repositorios da [Skillz Education](https://github.com/skillz-education) — README com imagem, titulo, descricao detalhada e instrucoes.

### Step 5: Verificar deploy

Aguardar 2-5 minutos apos habilitar Pages, depois acessar:
```
https://{usuario}.github.io/{nome-do-repositorio}
```

## Output format

- Repositorio publico no GitHub com Pages habilitado
- README com preview visual e descricao
- Link acessivel para compartilhamento

## Error handling

- Se o site nao carrega apos 5 minutos: verificar na aba Actions se o deploy completou
- Se pagina mostra 404: confirmar que `index.html` esta na raiz do branch configurado
- Se repositorio esta privado e precisa mudar: Settings → Danger Zone → Change visibility

## Verification

- Acessar o link do GitHub Pages e confirmar que o site carrega corretamente
- Verificar que o README aparece formatado na pagina do repositorio
- Confirmar que o link no About esta correto

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre apresentacao de projetos e portfolio
- [code-examples.md](references/code-examples.md) — Templates de README e configuracoes detalhadas

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Pagina mostra 404 apos habilitar Pages | `index.html` nao esta na raiz do branch configurado | Mova `index.html` para a raiz ou ajuste a pasta em Settings → Pages |
| Deploy nao completa apos 5 minutos | Erro no build do GitHub Actions | Verifique a aba Actions no repositorio para ver logs de erro |
| Repositorio privado nao permite GitHub Pages gratis | GitHub Pages gratuito requer repositorio publico | Mude para publico ou use GitHub Pro |

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-publicando-o-projeto/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-publicando-o-projeto/references/code-examples.md)
