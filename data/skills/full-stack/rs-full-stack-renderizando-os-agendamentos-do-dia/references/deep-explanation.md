# Deep Explanation: Renderizando Agendamentos por Período

## Por que separar load e show?

O instrutor enfatiza a separação de responsabilidades criando arquivos distintos dentro da pasta `schedules/`:
- `load.js` — responsável por buscar dados da API
- `show.js` — responsável por renderizar no DOM

A frase-chave: "tá vendo como que é legal ir fazendo separado, né, então a gente vai reaproveitando bastante coisa". O benefício direto é que `scheduleShow` pode ser chamada de qualquer lugar que tenha uma lista de agendamentos — não está acoplada ao fetch.

## Estratégia de limpeza antes de preenchimento

Antes de popular as listas, o instrutor limpa todos os três containers:
```javascript
periodMorning.innerHTML = ""
periodAfternoon.innerHTML = ""
periodNight.innerHTML = ""
```

Isso garante que ao recarregar (ex: mudar a data selecionada), os agendamentos anteriores não permanecem na tela. É um padrão fundamental para listas dinâmicas que podem ser atualizadas múltiplas vezes durante o ciclo de vida da página.

## Remoção de exemplos estáticos do HTML

Um passo importante mostrado na aula: o instrutor remove os `<li>` de exemplo que estavam hardcoded no HTML, comentando-os. A ideia é que o HTML inicial fique vazio e o JavaScript popule dinamicamente. Isso evita o flash de conteúdo estático antes dos dados reais carregarem.

## Distribuição condicional por período

A lógica de distribuição é simples e eficaz:
- `hour <= 12` → manhã
- `hour > 12 && hour <= 18` → tarde
- `else` → noite

O instrutor extrai apenas a hora com `dayjs(schedule.when).hour()` para simplificar a comparação. Não precisa de um campo `period` na API — a hora já contém a informação necessária.

## Construção elemento por elemento

O padrão é consistente:
1. `createElement` para cada tag necessária (li, strong, span, img)
2. Preencher conteúdo com `textContent` (não innerHTML — mais seguro)
3. Adicionar atributos com `setAttribute` (data-id, src, alt)
4. Adicionar classes com `classList.add`
5. Montar a árvore com `append` (aceita múltiplos filhos) ou `appendChild`
6. Inserir no container correto

## Ícone de cancelamento

O instrutor cria um elemento `img` para o ícone de cancelar:
- `classList.add("cancel-icon")` para estilização via CSS existente
- `setAttribute("src", "./src/assets/cancel.svg")` para a imagem
- `setAttribute("alt", "Cancelar")` como boa prática de acessibilidade

O `data-id` no item pai permite que, futuramente, ao clicar no ícone, seja possível identificar qual agendamento cancelar.

## Try/catch na renderização

O instrutor envolve toda a lógica de renderização em try/catch com:
- `alert()` para feedback visual ao usuário
- `console.log(error)` para debugging do desenvolvedor

Isso protege contra erros inesperados como dados mal formatados da API ou elementos DOM não encontrados.

## dayjs como facilitador

O instrutor destaca: "muito bom o dayjs né, porque a gente tem muitos métodos aqui pra trabalhar com data e com hora". Dois usos distintos:
- `dayjs(schedule.when).format("HH:mm")` — formata para exibição (ex: "20:00")
- `dayjs(schedule.when).hour()` — extrai apenas a hora como número para comparação