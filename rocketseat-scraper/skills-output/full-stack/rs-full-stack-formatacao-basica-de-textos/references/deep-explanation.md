# Deep Explanation: Formatacao Basica de Textos

## Semantica vs Aparencia

O ponto central da aula e que cada tag de formatacao tem um **proposito especifico** — nao se trata apenas de como o texto aparece visualmente:

- `<strong>` = **importancia** (visualmente: negrito)
- `<em>` = **enfase** (visualmente: italico — "texto deitadinho", como o instrutor descreve)
- `<mark>` = **relevancia** (visualmente: fundo amarelo)
- `<s>` = **conteudo nao mais valido** (visualmente: riscado — strikethrough)

### Por que isso importa?

1. **Acessibilidade:** Leitores de tela interpretam `<strong>` e `<em>` diferente de `<b>` e `<i>`. Um leitor de tela pode mudar a entonacao ao encontrar `<em>`.

2. **SEO:** Motores de busca dao peso semantico para `<strong>` — conteudo dentro dessa tag e considerado mais importante.

3. **Manutencao:** Codigo semantico comunica intencao. Outro dev sabe que `<strong>` significa "isso e importante" enquanto `<b>` pode ser apenas estilo.

## Tag `<s>` vs `<del>`

O instrutor menciona `<s>` como "strikethrough" — texto que "nao deveria estar ali" ou "ja nao e mais relevante". Existe uma distincao importante:

- `<s>` — conteudo que nao e mais relevante ou preciso (ex: preco antigo)
- `<del>` — conteudo que foi removido de um documento (edicao/revisao)

Ambos aparecem riscados visualmente, mas o significado semantico e diferente.

## Combinacoes validas

Tags de formatacao podem ser combinadas:

```html
<p>Isso e <strong><em>muito importante e enfatico</em></strong>.</p>
```

A ordem de aninhamento nao muda o resultado visual, mas por convencao coloca-se a tag de maior escopo por fora.

## Quando NAO usar essas tags

- Nao use `<strong>` em paragrafos inteiros — se tudo e importante, nada e importante
- Nao use `<mark>` para estilizar — use CSS para cores de fundo decorativas
- Nao use `<em>` para nomes de livros/filmes — use `<cite>`
- Nao use `<s>` para indicar erro do usuario — use mensagens de validacao