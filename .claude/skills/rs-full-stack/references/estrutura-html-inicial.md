---
name: rs-full-stack-estrutura-html-inicial
description: "Applies HTML structuring methodology when converting a visual design (Figma/mockup) into semantic HTML. Use when user asks to 'create HTML from design', 'structure a page', 'convert layout to HTML', 'build HTML skeleton', or 'start a new page from Figma'. Follows design-to-tag mapping, semantic sectioning, and Emmet shortcuts. Make sure to use this skill whenever building HTML structure from any visual reference. Not for CSS styling, JavaScript logic, or backend code."
---

# Estrutura HTML a partir de Design

> Leia o design visualmente, identifique blocos semanticos, e mapeie cada bloco para a tag HTML correta antes de escrever qualquer codigo.

## Rules

1. **Analise o layout antes de codar** — observe caixas, agrupamentos e hierarquia visual no design, porque a estrutura HTML deve refletir a estrutura visual
2. **Mapeie elementos do Figma para tags semanticas** — `container` → `div`, `main` → `<main>`, secoes nomeadas → `<section>`, porque o Figma frequentemente ja sugere a semantica
3. **Use IDs descritivos em ingles** — `#page`, `#about`, `#ingredients`, `#preparation`, porque pratica ingles tecnico e melhora legibilidade
4. **Use Emmet para produtividade** — `section#about` + Tab cria `<section id="about"></section>`, porque acelera a escrita sem erros
5. **Escolha tags pela semantica do conteudo** — titulo → `h1`/`h2`, paragrafo → `p`, lista de itens → `ul > li`, porque semantica correta melhora acessibilidade e SEO
6. **Nao se preocupe com perfeicao inicial** — construa o esqueleto primeiro, refine depois, porque iteracao e mais eficiente que perfeccionismo

## Steps

### Step 1: Leitura visual do design

Olhe o layout e identifique:
- Imagem de fundo vs conteudo principal
- Caixa centralizada (container)
- Secoes distintas dentro do container
- Hierarquia de titulos, textos e listas

### Step 2: Mapeamento design → tags

| Elemento visual | Tag HTML |
|----------------|----------|
| Caixa externa envolvente | `div#page` |
| Area principal de conteudo | `<main>` |
| Imagem destacada | `<img>` |
| Bloco tematico (sobre, ingredientes) | `<section id="nome">` |
| Titulo principal | `<h1>` |
| Subtitulos de secao | `<h2>` |
| Texto corrido | `<p>` |
| Lista de itens | `<ul>` com `<li>` |
| Quebra de linha dentro de paragrafo | `<br>` |

### Step 3: Construir o esqueleto com Emmet

```html
<!-- div#page + Tab -->
<div id="page">
  <img src="" alt="">

  <main>
    <section id="about">
      <h1>Titulo da Pagina</h1>
      <p>Descricao com <br> quebras de linha</p>
    </section>

    <section id="ingredients">
      <h2>Ingredientes</h2>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    </section>

    <section id="preparation">
      <h2>Modo de Preparo</h2>
      <p>Instrucoes com <br><br> quebras duplas entre etapas</p>
    </section>
  </main>
</div>
```

### Step 4: Preencher conteudo do design

Copie textos do Figma para dentro das tags correspondentes. Use `<br>` para quebras visuais dentro de um mesmo paragrafo.

### Step 5: Verificar no navegador

Use Live Server (extensao VS Code) para visualizar em tempo real:
- Clique em "Go Live" no rodape do VS Code
- Acesse `127.0.0.1:5500`
- Qualquer mudanca no HTML aparece automaticamente

## Heuristics

| Situacao | Faca |
|----------|------|
| Figma tem camadas nomeadas | Use os nomes como IDs das tags |
| Figma nao tem nomes claros | Analise visualmente: caixa = div, secao = section |
| Texto com quebras visuais | Use `<br>` dentro de `<p>`, nao multiplos `<p>` |
| Lista de itens similares | Sempre `<ul>` + `<li>`, nunca paragrafos separados |
| Conteudo principal da pagina | Envolva com `<main>` |

## Anti-patterns

| Nunca faca | Faca instead |
|------------|-------------|
| Comecar codando sem analisar o layout | Leia o design inteiro primeiro, identifique blocos |
| Usar `<div>` para tudo | Use tags semanticas: `main`, `section`, `h1-h6`, `ul` |
| Escrever IDs em portugues | Use ingles tecnico: `#ingredients` nao `#ingredientes` |
| Criar cada item de lista como `<p>` | Use `<ul><li>` para listas |
| Tentar perfeicao no primeiro commit | Construa o esqueleto, commite, refine depois |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e forma de pensar ao mapear design para HTML
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com atalhos Emmet e variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-estrutura-html-inicial/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-estrutura-html-inicial/references/code-examples.md)
