# Deep Explanation: Animando o Título com Slide Up + Bounce

## Modelo mental: a caixa-janela

O instrutor pensa na div como uma **caixa com limites físicos**. Dentro dela, os spans são empilhados verticalmente (cada um é `display: block`). A caixa tem `overflow: hidden` e altura exata de uma linha de texto — funciona como uma janela que só mostra um item por vez.

A largura usa `min-content`: o browser calcula qual é a maior palavra interna e usa essa largura. Isso evita valores fixos e se adapta automaticamente ao conteúdo.

O `vertical-align: bottom` garante que a caixa inline-block se alinhe pela base com o texto ao redor ("sua vida mais ___").

## Por que inline-block?

O instrutor explica o raciocínio: precisa que a div fique **em linha** com o texto ("sua vida mais"), mas também precisa de **propriedades block** (altura e largura). `inline-block` é exatamente essa combinação — fica em linha mas aceita dimensões.

## Estratégia da timeline

O instrutor cronometrou a animação de referência: ~6 segundos para o ciclo completo. Com 3 palavras, cada uma ocupa ~33% da timeline.

### Segmentos estáticos vs transições

A timeline não é dividida igualmente em 3 partes. Cada palavra tem:
- **Período estático** (~22% de duração): a palavra fica visível e parada
- **Período de transição** (~11% de duração): o bounce acontece aqui

```
0%────22% | 23%──32% | 33%────55% | 56%──65% | 66%────88% | 89%──100%
 estático  transição   estático    transição   estático    transição
 (radical)  (bounce)  (divertida)  (bounce)   (saudável)   (bounce)
```

## O truque do loop infinito

Este é o insight mais valioso da aula. O problema: quando a animação chega em 100% e volta para 0%, há um "pulo" visível — o texto volta de saudável para radical instantaneamente.

**Solução:** duplicar o primeiro elemento (`radical`) no final da lista HTML. O último keyframe (100%) posiciona no radical duplicado. Quando a animação reseta para 0%, já está mostrando radical — a transição é **imperceptível**.

O instrutor demonstrou isso ao vivo: primeiro sem a duplicação (pulo visível), depois com (loop perfeito). Ele até desafiou o espectador a perceber a transição — é impossível.

## Bounce: tentativa e erro

O instrutor foi honesto: **não calculou os valores de bounce matematicamente**. Foi tentativa e erro. A linha de raciocínio:

1. A palavra sobe um pouco além da posição final (overshoot): `calc(-5rem - 15px)`
2. Volta um pouco abaixo da posição final (undershoot): `calc(-5rem + 10px)`
3. Sobe de novo, menos que antes: `calc(-5rem - 5px)`
4. Desce de novo, menos que antes: `calc(-5rem + 5px)`
5. Estabiliza na posição exata: `-5rem`

O padrão é uma **oscilação decrescente**: 15px → 10px → 5px → 5px → 0. Isso imita um amortecimento físico natural.

### Por que calc() e não valores fixos?

Cada palavra tem uma posição base diferente (0, -5rem, -10rem, -15rem). O `calc()` permite expressar: "posição base ± offset do bounce". Isso torna o padrão replicável — basta trocar a base.

## Replicando o bounce para cada transição

O instrutor usou multi-cursor (Cmd+D / Ctrl+D) para replicar o bloco de bounce, trocando apenas:
- A posição base (de -5rem para -10rem, -15rem)
- As porcentagens da timeline (23-29 → 56-62 → 89-95)

Cada bloco de bounce segue o mesmo padrão de offsets, só muda a base.

## Cores por nth-child

Cada span recebe cor via `nth-child`:
- 1º (radical): azul sky-mid
- 2º (divertida): rosa joy-mid
- 3º (saudável): verde mid
- 4º (radical duplicado): mesma cor do 1º — essencial para o truque do loop

## Observação sobre processo

O instrutor enfatizou que **não é trivial**. Ele próprio fez bastante tentativa e erro. A mensagem pedagógica: animações CSS complexas não saem perfeitas de primeira — o processo iterativo é normal e esperado.