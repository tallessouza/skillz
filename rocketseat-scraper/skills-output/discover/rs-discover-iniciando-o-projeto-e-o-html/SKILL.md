---
name: rs-discover-iniciando-projeto-html
description: "Enforces correct HTML5 project initialization and document structure when starting a new web project. Use when user asks to 'create an HTML file', 'start a web project', 'setup index.html', 'initialize HTML boilerplate', or 'create a webpage'. Applies rules: index.html naming convention, correct lang attribute, understanding of head vs body, proper indentation with Prettier, viewport meta configuration. Make sure to use this skill whenever generating HTML boilerplate or explaining HTML document structure. Not for CSS styling, JavaScript logic, or advanced HTML semantics."
---

# Estrutura Inicial de um Projeto HTML

> Todo projeto web comeca com um `index.html` bem estruturado, onde `head` configura o invisivel e `body` exibe o visivel.

## Rules

1. **Nomeie o arquivo como `index.html`** — `index` e o padrao da web ha decadas, significa "indice" e servidores o servem automaticamente como pagina principal
2. **Use Emmet para gerar o boilerplate** — digite `!` + Enter no VS Code para gerar a estrutura completa, porque evita erros manuais e garante todas as meta tags essenciais
3. **Configure `lang="pt-BR"` no elemento raiz** — porque isso define a linguagem do documento para acessibilidade e SEO
4. **Entenda head como configuracao invisivel** — meta tags, charset, viewport sao configuracoes que o usuario nao ve, mas afetam como a pagina funciona
5. **Entenda body como conteudo visivel** — tudo que o usuario ve na pagina fica dentro do `body`
6. **Mantenha identacao consistente com Prettier** — porque identacao mostra hierarquia pai-filho e facilita saber onde tags abrem e fecham conforme o projeto cresce

## How to write

### Estrutura base gerada pelo Emmet

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <!-- conteudo visivel aqui -->
  </body>
</html>
```

### Hierarquia do documento

```
html (Root Element / Document Element)
├── head (configuracoes invisiveis)
│   ├── meta charset="UTF-8"        → caracteres especiais (til, cedilha)
│   ├── meta http-equiv             → compatibilidade navegadores antigos
│   ├── meta name="viewport"        → adaptacao a diferentes dispositivos
│   └── title                       → unica tag do head visivel (aba do navegador)
└── body (conteudo visivel / viewport)
```

## Example

**Before (sem identacao, dificil de ler):**
```html
<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title></head><body></body></html>
```

**After (com identacao e lang correto):**
```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
  </body>
</html>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo projeto web | Crie `index.html` com Emmet (`!` + Enter) |
| Projeto em portugues | Altere `lang="en"` para `lang="pt-BR"` |
| Pagina nao adapta no celular | Verifique se `meta viewport` existe no `head` |
| Codigo HTML bagunçado | Configure Prettier + Format On Save |
| Caracteres estranhos na pagina | Verifique `meta charset="UTF-8"` no `head` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `pagina.html` ou `meusite.html` | `index.html` (padrao universal) |
| `lang="en"` em site brasileiro | `lang="pt-BR"` |
| Escrever boilerplate manualmente | Usar Emmet: `!` + Enter |
| Codigo sem identacao | Prettier + Format On Save habilitado |
| Remover meta viewport | Manter para responsividade mobile |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre cada meta tag, analogias viewport e terminologia DOM
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes