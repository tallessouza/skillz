# Deep Explanation: Capturando Valor de Input com JavaScript

## Por que `getElementById` e não `querySelector`?

O instrutor escolhe `getElementById` deliberadamente, mesmo conhecendo alternativas como `querySelector` e `getElementsByClassName`. A razão é pedagógica e prática:

- `getElementById` é o método mais antigo e universal — funciona em qualquer browser
- É semanticamente claro: "estou buscando pelo id"
- É marginalmente mais rápido que `querySelector("#id")` porque não precisa parsear um seletor CSS
- O instrutor menciona que vai usar "um pouco de cada" ao longo do projeto para fixar as alternativas

## O evento `input` vs `change` vs `keyup`

O instrutor usa especificamente o evento `"input"`. Isso é intencional:

- **`input`**: Dispara a cada alteração no valor — digitação, colar, autocomplete, speech-to-text. É o mais abrangente.
- **`change`**: Só dispara quando o campo perde foco (blur) após ter sido alterado. Não serve para feedback em tempo real.
- **`keyup`/`keydown`**: Disparam por tecla, mas não capturam colar com mouse ou autocomplete do browser.

O instrutor demonstra digitando "Rodrigo" e "350" — os valores aparecem caractere a caractere no console, provando que o evento `input` reage imediatamente.

## `.value` é propriedade, não atributo

`amount.value` acessa a **propriedade** do elemento DOM, que reflete o estado atual. Já `amount.getAttribute("value")` retorna o atributo HTML original (o valor inicial). Para inputs, sempre use `.value`.

## Padrão de organização: `const` no topo

O instrutor cria `const amount = document.getElementById("amount")` no topo do script. Isso:

1. Evita buscar o mesmo elemento múltiplas vezes na DOM
2. Cria um "inventário" visual dos elementos que o script manipula
3. Facilita manutenção — se o id mudar, altera em um único lugar

## Convenção de nomes: inglês para código, português para comentários

O instrutor explicita sua convenção:
- Variáveis, constantes, funções → **inglês** (boa prática da indústria)
- Comentários → **português** (facilita compreensão para estudantes brasileiros)

Ele diz: "Sempre eu vou escrever os códigos, nome de variável, constante, isso eu vou escrever em inglês pra gente ter essa boa prática."

## Arrow function no addEventListener

O instrutor usa arrow function `() => {}` ao invés de `function() {}`. No contexto de event listeners simples, arrow functions são mais concisas e não criam seu próprio `this`, o que evita bugs comuns quando se trabalha com o DOM.

## O input HTML analisado

```html
<input type="text" name="amount" id="amount" placeholder="0,00" required />
```

Atributos relevantes:
- `type="text"` — aceita qualquer caractere (o instrutor menciona que depois vai filtrar para só números)
- `name="amount"` — usado em formulários para envio de dados
- `id="amount"` — usado pelo JavaScript para selecionar o elemento
- `placeholder="0,00"` — valor visual inicial (não é o value real)
- `required` — campo obrigatório para validação HTML nativa