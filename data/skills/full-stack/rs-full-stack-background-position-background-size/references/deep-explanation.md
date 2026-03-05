# Deep Explanation: Background-Position e Background-Size

## O modelo mental dos eixos

Background-position trabalha com dois eixos independentes:

- **Eixo X (horizontal):** aceita `left`, `center`, `right`, valores em px, %, etc.
- **Eixo Y (vertical):** aceita `top`, `center`, `bottom`, valores em px, %, etc.

Quando usado como shorthand, a ordem é **X primeiro, Y segundo**: `background-position: right bottom` significa "direita no horizontal, embaixo no vertical".

### A "inteligência" do browser

O CSS tem uma heurística interessante: se você escrever `background-position: bottom center`, o browser entende que `bottom` não faz sentido no eixo X (horizontal), então ele **reorganiza automaticamente** — interpreta como `center bottom` (X=center, Y=bottom).

Isso funciona, mas depender desse comportamento é ruim porque:
- Confunde outros desenvolvedores lendo o código
- Pode gerar bugs sutis com valores numéricos que são ambíguos
- A intenção do código fica obscura

**Regra:** sempre escreva na ordem correta (X, Y) mesmo que o browser consiga corrigir.

### Valor único

Quando você usa apenas um valor — `background-position: center` — ele é aplicado para **ambos os eixos** simultaneamente. Isso é um atalho útil para centralização total.

## Contain vs Cover — Quando usar cada um

### Contain

`contain` significa "caiba dentro do espaço disponível". A imagem:
- Escala para o **maior tamanho possível** sem cortar
- Pode deixar **espaços vazios** nas laterais ou em cima/embaixo
- **Toda a imagem é visível**

Use quando: logotipos, ícones decorativos, imagens que não podem ser cortadas.

### Cover

`cover` significa "cubra todo o espaço". A imagem:
- Escala para cobrir **100% do container**
- Pode **cortar partes** da imagem se a proporção não bater
- **Nenhum espaço vazio** sobra

Use quando: hero sections, banners, fundos decorativos onde o visual importa mais que mostrar a imagem inteira.

### Analogia do instrutor

O instrutor usa a metáfora de "cobertura" — cover literalmente cobre o espaço. Se precisa passar do tamanho, passa. Se sobra dos lados, tudo bem. O objetivo é não deixar espaço descoberto.

Contain é o oposto: o objetivo é não perder nenhuma parte da imagem, mesmo que sobre espaço.

## Tamanhos fixos vs relativos

- **Fixos (`200px`):** a imagem terá exatamente 200px — não responsivo
- **Relativos (`100%`):** 100% do espaço do container — responsivo mas pode distorcer
- **Keywords (`contain`, `cover`):** inteligentes, mantêm proporção — preferíveis na maioria dos casos

## Background-repeat e position

O instrutor destaca um ponto importante: `background-repeat` por padrão é `repeat`. Isso significa que a imagem se repete em ambos os eixos. Para que `background-position` tenha efeito visível e previsível, é fundamental desativar a repetição com `no-repeat` primeiro.