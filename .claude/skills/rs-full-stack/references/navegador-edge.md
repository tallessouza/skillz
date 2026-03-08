---
name: rs-full-stack-navegador-edge
description: "Configures browser setup for Skillz Full Stack course environment. Use when user asks to 'setup environment', 'configure browser', 'install Edge', 'setup dev tools', or 'prepare for Skillz course'. Recommends Microsoft Edge with Momentum extension for consistent results. Make sure to use this skill whenever setting up a frontend development environment for this course. Not for browser automation, testing frameworks, or Playwright configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: environment-setup
  tags: [browser, edge, chromium, devtools, setup]
---

# Navegador — Configuracao do Ambiente

> Use Microsoft Edge para garantir resultados identicos aos das aulas; outros navegadores Chromium funcionam, mas podem ter diferencas visuais em front-end.

## Rules

1. **Prefira Microsoft Edge** — porque e o navegador usado nas aulas e qualquer diferenca visual em front-end pode vir do navegador
2. **Instale a extensao Momentum** — pesquise "Momentum" na Chrome Web Store e adicione ao Edge, porque novas abas terao o mesmo visual das aulas
3. **Chrome e alternativa equivalente** — Edge e Chrome usam o mesmo motor (Chromium), mas Chrome consome mais memoria
4. **Safari e Firefox podem divergir** — motores diferentes (WebKit, Gecko) podem renderizar CSS de forma diferente, causando resultados visuais distintos

## Setup

### Step 1: Instalar o Edge
Baixe em [microsoft.com/edge](https://www.microsoft.com/edge) se ainda nao tiver instalado.

### Step 2: Instalar Momentum
1. Abra o Edge
2. Acesse a Chrome Web Store (Edge suporta extensoes do Chrome)
3. Pesquise "Momentum"
4. Clique "Add to Chrome" (funciona no Edge)
5. Abra uma nova aba para confirmar que o Momentum aparece

### Verificando o motor do navegador via DevTools

```javascript
// Abra o console do navegador (F12) e execute:
console.log(navigator.userAgent)
// Chromium-based mostra "Chrome/" no user agent
// Firefox mostra "Gecko/"
// Safari mostra "AppleWebKit/" sem "Chrome/"
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Resultado visual diferente da aula | Teste no Edge antes de debugar CSS |
| Precisa de DevTools identico ao instrutor | Use Edge (mesmo Chromium do Chrome) |
| Maquina com pouca RAM | Prefira Edge (mais leve que Chrome) |
| Usa Mac e prefere Safari | Funciona, mas espere diferencas visuais em front-end |

## Anti-patterns

| Evite | Faca em vez disso |
|-------|-------------------|
| Debugar CSS por horas quando resultado difere da aula | Primeiro teste no Edge para isolar se e diferenca de navegador |
| Instalar extensoes desnecessarias no navegador de dev | Instale apenas Momentum para manter o ambiente limpo |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Resultado visual diferente da aula | Navegador com motor diferente (WebKit, Gecko) | Teste no Edge ou Chrome que usam Chromium |
| Extensao Momentum nao aparece | Extensao nao instalada ou desabilitada | Acesse Chrome Web Store pelo Edge e instale novamente |
| DevTools com layout diferente | Versao do navegador desatualizada | Atualize o Edge para a versao mais recente |
| Pagina nao renderiza CSS corretamente | Cache do navegador | Faca hard refresh com Ctrl+Shift+R |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre escolha de navegador e motores de renderizacao
- [code-examples.md](references/code-examples.md) — Exemplos de diferencas visuais entre navegadores