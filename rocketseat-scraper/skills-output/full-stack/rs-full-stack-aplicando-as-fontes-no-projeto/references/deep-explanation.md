# Deep Explanation: Tipografia Web com Google Fonts e Variáveis CSS

## Por que `font: inherit` nos headings?

O instrutor (Mayk) explica um conceito fundamental que muitos desenvolvedores ignoram: **headings (h1-h6) têm estilos padrão do user-agent stylesheet do navegador**. Isso significa que mesmo que você defina `font` no `body`, os headings NÃO herdam automaticamente — eles usam o estilo padrão do navegador (geralmente Times New Roman bold com tamanhos específicos).

Ao declarar `font: inherit` nos headings, você está dizendo: **"Esqueça o padrão do navegador, mantenha as fontes herdadas conforme eu for criando as coisas."**

### O cenário real que justifica essa decisão

Mayk mostra o design do portal de notícias onde existem **cards/caixinhas diferentes** que usam tamanhos de fonte variados. Todos usam headings (h1, h2, h3), mas em contextos visuais diferentes.

Com `font: inherit`, quando um heading está dentro de um card que tem `font: var(--h2)`, o heading herda do card — não do navegador. Isso dá **controle total** sobre a tipografia via contexto CSS, sem precisar estilizar cada heading individualmente.

### Fluxo de herança

```
:root (variáveis definidas)
  └── body (font: var(--text))
        ├── h1 (font: inherit → herda do body → --text)
        ├── .card-destaque (font: var(--h1))
        │     └── h1 (font: inherit → herda do card → --h1)
        └── .card-lateral (font: var(--h2))
              └── h2 (font: inherit → herda do card → --h2)
```

## Shorthand `font` nas variáveis

O instrutor usa a propriedade shorthand `font` que combina weight, size, line-height e family em uma única declaração:

```
font: 800 24px/135% "Archivo", sans-serif
       │    │    │        │
       │    │    │        └── font-family (com fallback)
       │    │    └── line-height
       │    └── font-size
       └── font-weight
```

Isso é mais conciso que declarar cada propriedade separadamente e garante que todos os valores são aplicados juntos (evitando estados parciais).

## Hierarquia tipográfica do projeto

O instrutor define 6 níveis baseados no design:

| Variável | Weight | Size | Line-height | Uso |
|----------|--------|------|-------------|-----|
| `--h1` | 800 (Extra Bold) | 24px | 135% | Título principal |
| `--h2` | 800 | 16px | 140% | Subtítulo |
| `--h3` | 800 | 14px | 140% | Título terciário |
| `--text-span` | 600 (Semi Bold) | 14px | 145% | Texto destacado (spans) |
| `--text` | 400 (Regular) | 16px | 140% | Texto padrão |
| `--text-sm` | 400 | 14px | 160% | Texto pequeno (small) |

Nota: o `--text` é 16px (padrão) e `--text-sm` é 14px. A line-height do small é maior (160%) para compensar o tamanho menor e manter legibilidade.

## Links: `color: inherit` vs cor fixa

O padrão `color: inherit` nos links significa que o link assume a cor do elemento pai. Quando o link está no body (cor escura), ele fica escuro. Quando está num card com cor clara, fica claro. Isso elimina a necessidade de sobrescrever cores de link em cada contexto.

O hover usa `var(--brand-color-light)` para dar feedback visual consistente com a identidade da marca.

## Google Fonts: preconnect

As linhas de preconnect são separadas do link da fonte por um motivo técnico:

1. `preconnect` para `fonts.googleapis.com` — inicia conexão com o servidor de CSS
2. `preconnect` para `fonts.gstatic.com` — inicia conexão com o servidor de arquivos de fonte

Isso permite que o navegador resolva DNS e faça handshake TLS **antes** de precisar dos recursos, economizando ~100-300ms no carregamento da fonte.

## .gitignore

O instrutor também menciona a criação do `.gitignore` para ignorar arquivos do sistema operacional (como `.DS_Store` no macOS). Isso é uma boa prática para manter o repositório limpo de arquivos específicos de cada SO.