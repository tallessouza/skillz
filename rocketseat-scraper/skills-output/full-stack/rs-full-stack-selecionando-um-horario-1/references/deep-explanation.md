# Deep Explanation: Selecao de Horario com Click

## Por que o padrao Remove-All-Add-One?

O instrutor usa uma abordagem deliberada: mesmo sabendo que apenas um item tera a classe `hour-selected`, ele remove de TODOS antes de adicionar ao clicado. Isso parece redundante mas e uma decisao de engenharia:

1. **Defensivo por design** — se por qualquer bug dois itens ficarem selecionados, o proximo click corrige automaticamente
2. **Simplicidade** — nao precisa rastrear qual era o anterior, nao precisa de variavel de estado
3. **Previsibilidade** — o resultado e sempre o mesmo independente do estado anterior

## Separacao de responsabilidades em arquivos

O projeto Hair Day segue um padrao de modularizacao por funcionalidade:
- `hours.load.js` — carrega e renderiza os horarios
- `hours.click.js` — gerencia interacao de click

O instrutor chama `hoursClick()` DEPOIS do `forEach` que renderiza os itens no `hours.load.js`. Isso e critico: os elementos precisam existir no DOM antes de adicionar event listeners.

## Workflow de desenvolvimento do instrutor

1. **Primeiro verifica o CSS** — o instrutor vai ao `form.css` e encontra a classe `hour-selected` ja pronta
2. **Testa no DevTools** — clica com botao direito no elemento, inspeciona, e adiciona a classe manualmente para ver o resultado visual
3. **So entao codifica** — sabendo exatamente como deve ficar, implementa o JavaScript

Esse fluxo "visualizar antes de codificar" e uma pratica valiosa: voce valida o design antes de escrever logica.

## querySelectorAll com classe especifica

O instrutor usa `document.querySelectorAll(".hour-available")` em vez de pegar todos os `<li>` da lista. Isso filtra automaticamente os horarios indisponiveis, que tem uma classe diferente. O usuario nao deve conseguir interagir com horarios ja ocupados.

## event.target vs parametro nomeado

O instrutor nomeia o parametro do callback como `selected` e acessa `selected.target`. O `target` e o elemento real que disparou o evento. Em listas simples onde o `<li>` e o elemento clicavel direto, `event.target` funciona bem. Em estruturas mais complexas (com spans/divs dentro do li), pode ser necessario usar `event.currentTarget` ou delegacao de eventos.

## A informacao do horario selecionado sera usada depois

O instrutor menciona que alem do feedback visual, essa informacao sera necessaria para enviar nos dados do agendamento. A classe `hour-selected` serve como "fonte de verdade" no DOM — quando o usuario clicar no botao de agendar, o codigo pode buscar `document.querySelector(".hour-selected")` para saber qual horario foi escolhido.