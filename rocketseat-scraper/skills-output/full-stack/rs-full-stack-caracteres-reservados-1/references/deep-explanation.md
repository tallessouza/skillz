# Deep Explanation: Caracteres Reservados no HTML

## Por que caracteres reservados existem

HTML usa `<` e `>` como delimitadores de tags. Quando o parser do browser encontra `<` seguido de uma letra (sem espaco), ele interpreta como inicio de tag. Isso significa que qualquer texto que contenha esse padrao sera "engolido" pelo parser.

O instrutor demonstra isso diretamente: ao tentar escrever `<p>` dentro de um paragrafo, o browser interpreta como uma nova tag `<p>` ao inves de exibir o texto literal.

## O mecanismo de entidades HTML

Entidades HTML sao sequencias que comecam com `&` e terminam com `;`. O browser substitui a entidade pelo caractere correspondente **apos** o parsing de tags, garantindo que o caractere apareca como texto.

- `&lt;` → `<` (less than)
- `&gt;` → `>` (greater than)
- `&amp;` → `&` (ampersand)

## O problema do escape em cadeia

O instrutor mostra um caso sutil: quando voce quer exibir a propria entidade `&gt;` como texto na tela (nao o caractere `>`), voce precisa escapar o `&` da entidade:

```
Voce quer exibir: &gt;
Voce escreve:     &amp;gt;
Browser renderiza: &gt;
```

Isso acontece porque o browser processa `&amp;` → `&`, resultando em `&gt;` visivel na tela (sem converter para `>`).

## Quando o escape NAO e necessario

O instrutor destaca um ponto importante: `<` e `>` sozinhos, sem formar o padrao de tag (ex: com espaco depois), nao causam problema:

```html
<p>Se x < 10 entao...</p>    <!-- funciona (espaco apos <) -->
<p>Use a tag <p> para...</p>  <!-- QUEBRA (formato de tag) -->
```

O problema especifico e quando `<` + letra formam o padrao que o parser reconhece como tag. Mesmo assim, a boa pratica e sempre escapar para evitar surpresas.

## A tag `<code>`

O instrutor apresenta `<code>` como a forma semantica de representar trechos de codigo inline. Ela aplica fonte monospacada (geralmente Courier ou similar) e sinaliza para leitores de tela e crawlers que aquele trecho e codigo.

## Contexto pratico

O instrutor reconhece que na pratica isso e raramente necessario — "dificilmente voce vai ter um problema com isso". O caso de uso principal e quando voce esta escrevendo documentacao ou tutoriais que precisam mostrar tags HTML como texto.