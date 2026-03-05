---
name: rs-full-stack-github-pages-publicacao
description: "Applies GitHub Pages deployment workflow and cross-browser fix patterns when user asks to 'publish site', 'deploy to GitHub Pages', 'fix horizontal scroll', 'github.dev editing', or 'setup pages'. Covers overflow-x fix, cache debugging, and README best practices. Make sure to use this skill whenever deploying static sites to GitHub Pages or fixing post-deploy layout bugs. Not for CI/CD pipelines, Vercel/Netlify deploys, or backend deployments."
---

# Publicacao no GitHub Pages e Ajustes Pos-Deploy

> Publique no GitHub Pages, use github.dev para correcoes rapidas, e corrija problemas de layout que so aparecem em producao.

## Prerequisites

- Repositorio no GitHub (publico ou com GitHub Pages habilitado)
- Branch `main` com o codigo pronto

## Steps

### Step 1: Habilitar GitHub Pages

1. Abrir Settings do repositorio no GitHub
2. Ir em **Pages** (menu lateral)
3. Selecionar branch `main` como source
4. Clicar **Save**
5. Aguardar o link ser gerado (pode levar alguns minutos)

### Step 2: Verificar o deploy

Abrir o link gerado e testar em desktop e mobile. Problemas comuns que so aparecem em producao:

```css
/* Scroll horizontal indesejado — adicionar em html E body */
html, body {
  overflow-x: hidden;
}
```

### Step 3: Correcoes rapidas via github.dev

Pressionar a tecla `.` (ponto final) no teclado enquanto estiver na pagina do repositorio no GitHub. O URL muda de `github.com` para `github.dev`, abrindo um VS Code no navegador. Editar, commitar e fazer push diretamente.

### Step 4: Validar com cache desabilitado

1. Abrir DevTools (F12)
2. Aba **Network** → marcar **Disable cache**
3. Recarregar a pagina (Ctrl+Shift+R)

### Step 5: Criar README profissional

Incluir no README:
- Menu de navegacao com links para secoes
- Screenshot/imagem do projeto
- Tecnologias utilizadas
- Link para o deploy (GitHub Pages)
- Licenca

## Output format

Site publicado em `https://{usuario}.github.io/{repositorio}/` com README completo.

## Error handling

- Se o scroll horizontal persistir: verificar se `overflow-x: hidden` esta no `body` alem do `html`, porque nem todos os navegadores respeitam apenas no `html`
- Se alteracoes nao aparecem apos deploy: desabilitar cache no DevTools e forcar hard refresh
- Se GitHub Pages nao gera o link: verificar se o repositorio esta publico ou se o plano permite Pages em repos privados

## Verification

- Abrir o link em desktop e mobile
- Verificar ausencia de scroll horizontal
- Confirmar que README aparece formatado na pagina do repositorio

## Heuristics

| Situacao | Acao |
|----------|------|
| Bug so aparece em producao | Comparar CSS local vs servido, verificar cache |
| Correcao rapida de 1 arquivo | Usar github.dev (tecla `.`) |
| Layout quebra em navegador especifico | Nao existe bala de prata — ajustar caso a caso |
| Projeto sem README | Criar antes de compartilhar — e a primeira impressao |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `overflow: hidden` no html apenas | `overflow-x: hidden` no `html` E no `body` |
| Ignorar diferenca entre navegadores | Testar em Chrome, Edge, Firefox e mobile |
| Publicar sem README | Adicionar README com screenshot e tecnologias |
| Ficar recarregando esperando cache limpar | Desabilitar cache no DevTools |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre overflow, cache e github.dev
- [code-examples.md](references/code-examples.md) — Exemplos de CSS fix e README template