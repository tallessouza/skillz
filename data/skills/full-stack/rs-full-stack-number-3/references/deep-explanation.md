# Deep Explanation: Tipo Number em JavaScript

## Por que ponto e nao virgula?

O instrutor demonstra diretamente no console: ao escrever `7,5` no `console.log`, o JavaScript interpreta como **dois argumentos separados** — o numero `7` e o numero `5` — porque a virgula e o separador de argumentos em funcoes. Isso acontece porque `console.log(7, 5)` imprime `7 5`, nao `7.5`.

Essa e uma convencao universal nas linguagens de programacao, nao apenas JavaScript. O ponto (`.`) e o separador decimal padrao.

## Analogia visual do instrutor

O instrutor destaca que o console do navegador usa **cores diferentes** para tipos diferentes:
- Numeros aparecem em uma cor (geralmente azul)
- Strings aparecem em outra cor (geralmente preta ou vermelha)

Isso e uma dica visual rapida para identificar se voce acidentalmente colocou aspas ao redor de um numero, transformando-o em string.

## As tres variantes de Number

JavaScript nao distingue entre inteiros e floats no sistema de tipos — tudo e `number`. Internamente usa IEEE 754 double-precision (64-bit), mas para o desenvolvedor:

1. **Inteiro positivo:** `5`, `100`, `999`
2. **Inteiro negativo:** `-5`, `-100`
3. **Float (numero real):** `7.5`, `125.70`, `3.14`

Todos retornam `"number"` quando verificados com `typeof`.

## NaN — Not a Number

O instrutor demonstra: `12.5 / "meuNome"` retorna `NaN`. Isso acontece porque JavaScript tenta coercion de tipo, falha, e em vez de lancar um erro, retorna o valor especial `NaN`.

Pontos criticos sobre NaN:
- `typeof NaN === "number"` — ironicamente, NaN e do tipo number
- `NaN !== NaN` — NaN nao e igual a si mesmo (unico valor em JS com essa propriedade)
- Use `Number.isNaN()` para verificacao precisa, nao `isNaN()` global (que faz coercion)

## Quando NaN aparece na pratica

- Dividir numero por string nao-numerica
- `parseInt("abc")`
- `Math.sqrt(-1)`
- Operacoes aritmeticas com `undefined`

## Edge cases importantes

- `0.1 + 0.2 !== 0.3` — imprecisao de ponto flutuante (IEEE 754)
- Para valores monetarios em producao, considere trabalhar em centavos (inteiros) ou usar bibliotecas como `dinero.js`
- `Infinity` e `-Infinity` tambem sao do tipo `number`