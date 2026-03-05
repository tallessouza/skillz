# Deep Explanation: Funções Degradê CSS

## Gradientes são imagens, não cores

O insight mais importante da aula: o CSS interpreta gradientes como **imagens**. Por isso a propriedade correta é `background-image`, não `background-color`. O shorthand `background` também funciona porque aceita ambos, mas se for ser explícito, use `background-image`.

Isso significa que gradientes competem com `url()` no mesmo espaço — você pode até combinar gradientes com imagens usando múltiplos backgrounds.

## Anatomia do linear-gradient

```
linear-gradient( [direção], cor1 [stop1], cor2 [stop2], ... )
```

### Direção

Duas formas de definir:

1. **Ângulos (graus):** `0deg` = de baixo para cima, `90deg` = da esquerda para direita, `180deg` = de cima para baixo. Range completo: 0 a 360 graus.

2. **Keywords:** `to right`, `to left`, `to top`, `to bottom`, e combinações como `to top right`. Mais legíveis, mas limitadas a 8 direções.

### Pontos de transição (color stops)

Quando você escreve `linear-gradient(90deg, red, blue)`, o browser distribui as cores uniformemente: red em 0%, blue em 100%, transição suave entre eles.

Ao adicionar porcentagem — `red 80%, blue` — você está dizendo: "mantenha vermelho sólido até 80% do elemento, depois faça a transição para azul nos 20% restantes". Quanto menor o espaço de transição, mais abrupta a mudança de cor.

Caso extremo: `red 50%, blue 50%` cria uma divisão sólida sem transição (útil para padrões listrados).

## Anatomia do radial-gradient

```
radial-gradient( [forma tamanho at posição], cor1 [stop1], cor2 [stop2], ... )
```

O formato padrão é uma elipse centralizada. Na forma mais simples — `radial-gradient(red, blue)` — cria um gradiente circular do centro para as bordas.

Assim como no linear, porcentagens controlam onde a transição acontece: `red 50%, blue` mantém vermelho sólido no centro até 50% do raio.

## Quando usar cada tipo

- **linear-gradient:** Transições direcionais — headers, banners, overlays sobre imagens
- **radial-gradient:** Efeitos de spotlight, brilho central, badges, botões com profundidade