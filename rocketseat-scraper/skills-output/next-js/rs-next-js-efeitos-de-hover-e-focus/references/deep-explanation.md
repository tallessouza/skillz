# Deep Explanation: Efeitos de Hover e Focus

## Por que focus-visible e nao focus?

O instrutor explica a diferenca fundamental:

- **`focus`** — dispara quando o usuario clica no elemento E quando navega por tab. Ao clicar num botao, o estilo de focus aparece, o que nao e desejado — o usuario ja sabe onde clicou.
- **`focus-visible`** — dispara APENAS quando o usuario navega por teclado (tab). E o comportamento correto para acessibilidade: mostrar onde o foco esta apenas quando a pessoa esta usando teclado.

Nas palavras do instrutor: "O Focus Visible é só quando o usuário está navegando por tab. O Focus, já por outro lado, quando o usuário clica, ele acaba também aplicando o Focus, que não é o que eu quero."

## O padrao ring completo

O ring no Tailwind cria uma "borda" ao redor do elemento usando box-shadow. O padrao completo:

1. `outline-none` — remove o outline padrao do browser
2. `focus-visible:ring-2` — cria o ring de 2px
3. `focus-visible:ring-navy-400` — cor do ring
4. `focus-visible:ring-offset-2` — espacamento entre o ring e o elemento
5. `focus-visible:ring-offset-navy-950` — cor do espaco entre ring e elemento

O instrutor destaca que o ring-offset precisa de uma cor fixa: "como ela tá um pouco distanciada do elemento, não tem como ela ser transparente nesse caso, tem que botar uma cor fixa."

## Organizacao de classes com tw-merge

O tw-merge aceita multiplos parametros string. O instrutor usa isso para organizar por responsabilidade:

```typescript
twMerge(
  "estilos-base",           // Linha 1: layout, cores, tipografia
  "hover:...",              // Linha 2: apenas hover
  "outline-none focus-visible:...", // Linha 3: apenas focus
  className,                // Props externas (override)
)
```

Isso nao e apenas estetico — facilita encontrar e modificar comportamentos especificos sem vasculhar uma string gigante.

## Opacidade em hover sobre fundos escuros

Ao aplicar hover no card (fundo navy-700), o instrutor testou `hover:bg-navy-600` e achou muito claro ("a mesma cor do botão"). A solucao foi usar opacidade:

- `hover:bg-navy-600/60` — primeira tentativa
- `hover:bg-navy-600/50` — ajuste final, "fica mais light"

Isso mantem a hierarquia visual: o card em hover nao deve ficar identico ao botao.

## Duration 150 em vez de 300

O padrao do Tailwind `transition-colors` usa 150ms por padrao, mas `duration-300` e comum. O instrutor prefere 150ms explicitamente: "Eu gosto que a duração da animação seja mais rapidinha... eu não gosto de animação demais assim no Hover, acho que fica meio estranho."

## ComponentProps pattern

O instrutor usa `ComponentProps<"button">` do React para tipar o componente, garantindo que todas as props nativas de button sejam aceitas. Destaca className separadamente para fazer merge com tw-merge, e spread do resto com `...props`.

## Replicabilidade do focus pattern

O instrutor copia o bloco de focus do button para o card: "dá para replicar isso para qualquer elemento com foco." O padrao de focus-visible e identico independente do tipo de elemento — apenas a cor do ring-offset muda conforme o background.