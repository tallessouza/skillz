# Deep Explanation: Faixa Rotativa CSS

## Por que 3 camadas (banner > scroller > rolling)?

O instrutor estrutura em 3 níveis com responsabilidades distintas:

- **banner**: É o container externo que existe na página. Define o espaço visual (padding-block: 2.5rem), garante que nada transborde (overflow: hidden), e no futuro recebe o gradiente animado de fundo.
- **scroller**: É a "janela" visível. Também tem overflow: hidden como dupla garantia. Define seu próprio padding interno (1rem) para o conteúdo respirar.
- **rolling**: É o elemento que de fato se move. Usa display: flex + gap para alinhar as imagens lado a lado, e recebe a animação de translateX.

A separação é importante porque se o elemento animado fosse o mesmo do overflow: hidden, o clipping e a animação entrariam em conflito.

## O cálculo do translateX(-132px)

Este é o ponto mais delicado. O instrutor explicou que fez cálculos:

1. Cada bloco SVG tem uma largura fixa
2. O gap entre eles é 1.5rem = 24px (em base 16)
3. Largura do bloco + gap = ~133px
4. Mas ao testar, 133px causava um "pulinho" perceptível no reset da animação
5. **132px** foi o valor que eliminou o pulo visual

**Por que isso funciona**: Quando a animação vai de `transform: translateX(0)` até `translateX(-132px)` e reseta, o próximo elemento duplicado está exatamente na posição onde o primeiro estava. O olho humano não percebe o reset porque a posição é idêntica.

**Analogia do instrutor**: É como uma esteira rolante — quando um item sai de um lado, outro idêntico já está entrando do outro. Se o espaçamento estiver errado por 1px, você vê o "pulo".

## Por que duplicar elementos manualmente?

O instrutor reconhece explicitamente que com JavaScript seria mais fácil:
- JS poderia medir a viewport, calcular quantas cópias são necessárias, e duplicar automaticamente
- Com CSS puro, não há como contar ou duplicar dinamicamente
- A solução é colocar cópias suficientes no HTML para que a viewport nunca fique "vazia"

Trade-off aceito: HTML um pouco verboso em troca de zero JavaScript.

## A técnica do background-size: 400%

Esta é a sacada para animar gradientes:

1. Um `linear-gradient` por padrão ocupa 100% do elemento
2. Se o gradient ocupa 100%, mover `background-position` não faz nada — não há "espaço" sobrando
3. Ao definir `background-size: 400%`, o gradiente fica 4x maior que o container
4. Agora `background-position` pode "deslizar" o gradiente dentro do espaço visível

**Analogia**: Imagine uma folha de papel colorida 4x maior que a janela. Você pode deslizar a folha atrás da janela e ver cores diferentes. Se a folha fosse do mesmo tamanho da janela, deslizar não mudaria nada.

## O keyframe do gradiente: por que só 50%?

```css
@keyframes bg-gradient {
  50% { background-position: 100% 50%; }
}
```

- **0%** (implícito): position está em `50% 50%` (definido no estilo base)
- **50%**: position vai para `100% 50%` — o gradiente desliza para a direita
- **100%** (implícito): volta para `50% 50%` — desliza de volta

Isso cria um efeito de **ida e volta** em uma única definição de keyframe. O `ease` timing function suaviza as extremidades, dando sensação orgânica.

O eixo Y (segundo valor, 50%) permanece fixo o tempo todo — só o eixo X se move.

## CSS vs JavaScript para este efeito

O instrutor é honesto: "no futuro com JavaScript vai ser muito mais simples de resolver". Mas o desafio pedagógico era fazer com CSS puro.

**Quando usar CSS puro (esta técnica):**
- Landing pages simples
- Poucos elementos no banner
- Viewport previsível
- Zero dependência de JS é requisito

**Quando migrar para JavaScript:**
- Muitos elementos dinâmicos
- Precisa adaptar a viewports muito variadas
- Conteúdo do banner vem de API
- Precisa de controles (pause, velocidade, direção)