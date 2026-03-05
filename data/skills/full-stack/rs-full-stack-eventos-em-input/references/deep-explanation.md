# Deep Explanation: Eventos em Input

## Modelo mental: Caixa de ferramentas

O instrutor usa a analogia de uma caixa de ferramentas: cada evento de input e uma ferramenta diferente na sua caixa. Conhecer todas as ferramentas aumenta seu repertorio e permite escolher a melhor para cada situacao. Uma ferramenta nao serve so para uma coisa — a mesma estrategia pode ser aplicada em muitos cenarios diferentes, dependendo da criatividade e do contexto.

## Os tres eventos fundamentais

### keydown — O capturador universal

`keydown` dispara quando **qualquer tecla** e pressionada, sem excecao. Isso inclui:
- Letras e numeros
- Modificadores: Ctrl, Shift, Alt, Meta
- Teclas especiais: Escape, Arrow keys, Tab, Enter
- Teclas de funcao: F1-F12

**Caso revelador do instrutor:** Ao digitar "Rodrigo" com Shift+R, o keydown capturou **dois eventos** — primeiro o Shift, depois o R. Isso demonstra que keydown e literal: cada tecla fisica pressionada gera um evento.

**Quando usar:** Atalhos de teclado, jogos, captura de teclas especiais, qualquer caso onde voce precisa saber EXATAMENTE o que o usuario apertou.

### keypress — O filtro de caracteres

`keypress` dispara apenas quando uma tecla que **produz um caractere** e pressionada. Isso significa:
- Letras, numeros, pontuacao, espaco: SIM
- Ctrl, Shift, Alt: NAO (ignorados silenciosamente)

**Caso revelador do instrutor:** Ao apertar Shift repetidamente, nenhum evento foi disparado. Ao apertar Ctrl, nenhum evento. Apenas ao digitar caracteres imprimiveis o evento dispara. O espaco tambem conta como caractere.

**Nota importante:** `keypress` esta tecnicamente deprecated na especificacao, mas ainda e amplamente suportado. O evento `input` e a alternativa moderna para muitos casos de uso similares. O instrutor ensina `keypress` porque e fundamental entender o conceito de filtragem de teclas.

**Quando usar:** Validacao de entrada em tempo real, contagem de caracteres, formatacao durante digitacao.

### change — O observador de resultado final

`change` dispara **apenas quando o usuario sai do input** (evento de blur) E o valor mudou. Isso e fundamentalmente diferente dos outros dois:
- NAO dispara durante a digitacao
- Dispara quando o usuario clica fora, aperta Tab, ou muda o foco

**Caso revelador do instrutor:** Digitou "Rodrigo" e nenhum evento apareceu. Ao apertar Tab (saindo do input), ai sim o evento disparou. Voltou ao input, digitou "Goncalves", apertou Tab novamente, e o evento disparou de novo.

**Quando usar:** Salvar dados apos edicao, validacao final antes de processar, envio de analytics sobre mudancas.

## Formas de registrar eventos

O instrutor demonstrou tres formas equivalentes:

### 1. addEventListener (recomendada)
```javascript
input.addEventListener("keydown", (event) => { ... })
```
Permite multiplos listeners, pode ser removido com `removeEventListener`.

### 2. Propriedade on* com funcao anonima
```javascript
input.onchange = function() { ... }
```
Simples, mas sobrescreve listeners anteriores.

### 3. Propriedade on* com funcao nomeada
```javascript
function inputChange() { ... }
input.onchange = inputChange
```
Reutilizavel, testavel, mas ainda sobrescreve listeners anteriores.

## Insight do instrutor sobre maestria

"Quanto mais voce conhece das possibilidades do JavaScript, e como se voce estivesse adicionando mais ferramentas a sua disposicao em uma caixa que voce consegue acessar e consegue usar a melhor ferramenta para cada situacao."

A mensagem central: nao basta conhecer UM evento. Dominar JavaScript significa conhecer TODOS os eventos e saber qual usar em cada contexto. A diferenca entre um iniciante e um especialista nao e saber mais — e ter mais ferramentas disponiveis para escolher a certa.