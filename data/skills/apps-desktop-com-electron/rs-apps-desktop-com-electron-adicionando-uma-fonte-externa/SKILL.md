---
name: rs-electron-fonte-externa-csp
description: "Applies Content Security Policy (CSP) configuration when adding external fonts or styles to Electron apps. Use when user asks to 'add Google Fonts to Electron', 'fix CSP error', 'load external font', 'content security policy refused to load', or 'style-src font-src directive'. Guides through CSP directives (style-src, font-src, default-src) to allow external domains. Make sure to use this skill whenever configuring external resources in Electron apps. Not for web-only apps, Node.js servers, or browser extensions."
---

# Fonte Externa + CSP no Electron

> Ao carregar recursos externos no Electron, configure as diretivas CSP para cada tipo de recurso, permitindo apenas os dominios necessarios.

## Rules

1. **Preconnect links no topo do head** — coloque `<link rel="preconnect">` logo apos o meta charset, porque acelera a resolucao DNS antes do carregamento da fonte
2. **Link da fonte como ultimo elemento antes de fechar o head** — mantem organizacao e garante que metas de seguranca ja foram processados
3. **Cada tipo de recurso tem sua diretiva CSP** — `style-src` para estilos, `font-src` para fontes, `script-src` para scripts, porque misturar tudo em `default-src` e menos seguro
4. **Adicione apenas o dominio necessario** — `fonts.googleapis.com` para estilos, `fonts.gstatic.com` para arquivos de fonte, porque CSP granular reduz superficie de ataque
5. **Use DevTools para diagnosticar erros CSP** — View > Toggle Developer Tools mostra exatamente qual diretiva bloqueou qual recurso, porque a mensagem de erro indica a diretiva e o dominio

## How to write

### CSP meta tag com fontes externas

```html
<head>
  <meta charset="UTF-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <meta
    http-equiv="Content-Security-Policy"
    content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com"
  />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
</head>
```

### Aplicando a fonte

```css
body {
  font-family: 'Inter', sans-serif;
}
```

## Example

**Before (CSP bloqueando fonte externa):**

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
/>
<!-- Erro: Refused to load the stylesheet because it violates CSP directive style-src -->
```

**After (CSP configurado corretamente):**

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com"
/>
<!-- Fonte carrega sem erros -->
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Erro `Refused to load the stylesheet` | Adicione o dominio em `style-src` |
| Erro `Refused to load the font` | Crie diretiva `font-src` com o dominio ou adicione em `default-src` |
| Nao sabe qual dominio adicionar | Abra Network no DevTools, veja o dominio da requisicao que falhou |
| Precisa de multiplas fontes externas | Adicione cada dominio separado por espaco na diretiva correspondente |
| Quer carregar imagens externas | Use diretiva `img-src` com o dominio |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `default-src *` (permite tudo) | Diretivas especificas por tipo de recurso |
| Colocar todos os dominios em `default-src` | Usar `style-src`, `font-src`, `script-src` separadamente |
| Desabilitar CSP inteiramente | Adicionar apenas os dominios necessarios |
| Ignorar erros no console do DevTools | Ler a mensagem — ela indica exatamente a diretiva e dominio necessarios |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
