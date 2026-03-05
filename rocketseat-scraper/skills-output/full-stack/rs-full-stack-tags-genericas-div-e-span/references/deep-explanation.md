# Deep Explanation: Tags Genéricas Div e Span

## O modelo mental: caixas e fluxo

O instrutor usa a analogia de **pai e filhos** para explicar div: imagine uma caixa grande (div) que contém outras caixas menores dentro dela. Cada div é um "pai" que pode ter "filhos" — outros elementos HTML aninhados.

### Fluxo de bloco (div)

O comportamento padrão da div é **bloco**. Isso significa:
- A div ocupa **do início até o final** da linha horizontal disponível — "todinho", como o instrutor enfatiza
- O próximo elemento é **empurrado para baixo**, criando uma nova linha visual
- Duas divs em sequência ficam uma embaixo da outra, nunca lado a lado (sem CSS)

Visualmente:
```
[==========DIV 1==========]
[==========DIV 2==========]
```

### Fluxo em linha (span)

O span tem comportamento **em linha** (inline). Isso significa:
- Vários spans ficam **um ao lado do outro** na mesma linha
- Não quebram para a próxima linha (a menos que o espaço horizontal acabe)
- Comportam-se como texto corrido

Visualmente:
```
[SPAN 1][SPAN 2][SPAN 3]
```

## Por que existem elementos "sem significado"?

O instrutor reforça várias vezes: div e span **não têm significado semântico**. Então por que usá-los?

Porque às vezes você precisa de **estrutura** sem **semântica**. Você quer:
1. Agrupar elementos para aplicar CSS (layout, cores, espaçamento)
2. Criar ganchos para JavaScript (selecionar, manipular, animar)
3. Organizar visualmente sem adicionar significado ao documento

É exatamente por isso que o instrutor diz: "eu vou usar atributos como classes, atributos como id, atributos como data" — esses atributos compensam a falta de semântica nativa.

## Quando NÃO usar div/span

Se o conteúdo tem significado, use o elemento semântico apropriado:

| Significado | Elemento correto | NÃO use |
|-------------|-----------------|---------|
| Navegação | `<nav>` | `<div class="nav">` |
| Cabeçalho da página | `<header>` | `<div class="header">` |
| Seção temática | `<section>` | `<div class="section">` |
| Artigo independente | `<article>` | `<div class="article">` |
| Texto enfático | `<em>` | `<span class="italic">` |
| Texto importante | `<strong>` | `<span class="bold">` |

Div e span são o **último recurso estrutural** — use quando nenhum elemento semântico se encaixa.

## Edge case: aninhamento

Uma regra implícita que o instrutor não detalha mas é fundamental:
- **Div pode conter div e span** (bloco contém tudo)
- **Span NÃO deve conter div** (inline não deve conter bloco)

Em HTML5 existem exceções técnicas, mas como regra prática: blocos dentro de inline causam comportamentos inesperados e devem ser evitados.