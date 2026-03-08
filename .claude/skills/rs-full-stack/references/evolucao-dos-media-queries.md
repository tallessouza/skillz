---
name: rs-full-stack-evolucao-dos-media-queries
description: "Validates CSS Media Queries Level 5 adoption and feature research workflow. Use when user asks to 'check browser support', 'use media queries', 'range syntax CSS', 'prefers-color-scheme', or 'is this CSS feature supported'. Applies W3C spec research and caniuse.com validation before adopting new CSS features. Make sure to use this skill whenever adopting modern CSS media query syntax or researching CSS feature compatibility. Not for general CSS layout, flexbox, grid, or non-media-query CSS features."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-responsive
  tags: [css, media-queries, responsive, browser-support, caniuse]
---

# Evolucao dos Media Queries

> Antes de usar qualquer feature moderna de CSS, valide no W3C spec o nivel de maturidade e no caniuse.com o suporte real dos browsers.

## Key concepts

CSS Media Queries evolui em niveis (Levels) no W3C. O Level 5 esta em desenvolvimento desde 2021 e introduz sintaxes modernas como Range Syntax e `prefers-color-scheme`. Features podem existir na spec mas nao ter suporte universal — por isso a validacao em duas fontes e obrigatoria.

## Decision framework

| Quando encontrar | Faca |
|-----------------|------|
| Feature nova de Media Query | Consulte w3.org/TR para ver o Level e status do draft |
| Quer usar Range Syntax (`width >= 768px`) | Verifique caniuse.com — suporte ~89%+, seguro desde 2022 |
| Suporte global >= 95% no caniuse | Adote sem fallback |
| Suporte global 85-95% no caniuse | Adote com fallback para sintaxe classica |
| Suporte global < 85% no caniuse | Nao adote em producao, use sintaxe classica |
| `prefers-color-scheme` | Suporte excelente, pode usar tranquilamente |

## How to research

### 1. Verificar a spec oficial
Acesse `w3.org/TR/mediaqueries-5/` para Media Queries Level 5. Observe:
- **Editor's Draft** — versao mais recente (pode mudar)
- **Working Draft** — versao publicada oficialmente
- **Historico de versoes** — estabilidade da feature

### 2. Validar suporte no caniuse.com
```
caniuse.com → buscar feature → verificar:
- % global de suporte
- Quais versoes dos browsers principais suportam
- Se browsers descontinuados sao os unicos sem suporte
```

### 3. Regra de adocao

```css
/* Range Syntax (Level 5) — suportado desde 2022 */
@media (width >= 768px) {
  /* moderno, legivel */
}

/* Sintaxe classica (fallback) */
@media (min-width: 768px) {
  /* compativel com browsers antigos */
}
```

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Se esta na spec do W3C, posso usar | Specs tem niveis de maturidade — draft nao significa suportado |
| Range Syntax e experimental | Funciona em todos os browsers modernos desde 2022 |
| Preciso de ingles para acompanhar CSS | Nao precisa, mas quem le ingles acessa a fonte primaria e aprende features antes |
| 89% de suporte global e pouco | Se os 11% restantes sao browsers descontinuados, e seguro adotar |

## When to apply

- Ao decidir entre sintaxe classica (`min-width`) e moderna (`width >=`) de media queries
- Ao adotar qualquer feature CSS nova em projeto de producao
- Ao revisar codigo que usa features modernas sem verificacao de suporte

## Limitations

- Specs do W3C mudam — o que e draft hoje pode ser alterado amanha
- Dados do caniuse sao globais — seu publico especifico pode ter distribuicao diferente de browsers
- Suporte de browser nao garante comportamento identico entre implementacoes

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Range syntax `(width >= 768px)` nao funciona | Browser muito antigo (pre-2022) | Usar fallback classico `(min-width: 768px)` |
| `prefers-color-scheme` nao detecta tema | Browser nao suporta ou SO sem tema escuro ativo | Verificar suporte no caniuse e configuracao do SO |
| Media query nao aplica estilos | Sintaxe com erro ou falta viewport meta tag | Verificar `<meta name="viewport">` no HTML e sintaxe da query |
| Comportamento diferente entre browsers | Implementacoes variam em features novas | Consultar caniuse.com para confirmar suporte especifico |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre niveis do W3C, analogias e pesquisa de features
- [code-examples.md](references/code-examples.md) — Todos os exemplos de Range Syntax e prefers-color-scheme com variacoes