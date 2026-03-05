# Deep Explanation: Renderizando Listas com Estado Condicional

## Por que forEach e não map?

O instrutor escolhe `forEach` de forma deliberada e explica: "eu vou usar o forEach, porque eu não preciso devolver um novo array". Essa é a distinção semântica fundamental:

- **map** — transforma um array em outro array. Retorna algo.
- **forEach** — executa um efeito colateral para cada item. Não retorna nada.

Quando o objetivo é criar elementos DOM e inseri-los na página, isso é um **side-effect**. Não estamos criando um novo array de dados — estamos modificando o DOM. Portanto, `forEach` é a escolha correta.

Usar `map` sem consumir o retorno é um anti-pattern porque:
1. Aloca um array desnecessário na memória
2. Confunde quem lê o código (espera-se que o retorno seja usado)
3. Linters como ESLint flagam com `no-unused-expressions`

## Desestruturação no callback

O instrutor desestrutura diretamente no parâmetro: `({ hour, available })`. Isso evita:

```javascript
// Sem desestruturação — repetitivo
opening.forEach((item) => {
  li.textContent = item.hour
  const cls = item.available ? ... : ...
})

// Com desestruturação — limpo
opening.forEach(({ hour, available }) => {
  li.textContent = hour
  const cls = available ? ... : ...
})
```

A desestruturação documenta quais propriedades do objeto são relevantes para aquele bloco de código.

## classList.add vs className

O instrutor usa `classList.add` em duas chamadas separadas:

```javascript
li.classList.add("hour")
li.classList.add(available ? "hour-available" : "hour-unavailable")
```

Isso é preferível a `className` porque:
1. **Não sobrescreve** — className substitui todas as classes, classList adiciona
2. **Separação de responsabilidades** — classe estrutural (`hour`) adicionada separadamente da classe de estado
3. **Seguro para múltiplas chamadas** — classList.add é idempotente

## textContent vs innerHTML

O instrutor usa `li.textContent = hour`. Isso é importante porque:
1. **Segurança** — textContent não interpreta HTML, prevenindo XSS
2. **Performance** — textContent não dispara o parser HTML
3. **Semântica** — o horário é texto puro, não HTML

## Padrão de construção: selecionar container → iterar → criar → adicionar

O fluxo do instrutor segue um padrão claro:

1. **Selecionar o container** uma vez fora do loop (`document.getElementById("hours")`)
2. **Iterar** sobre os dados (`opening.forEach`)
3. **Criar** o elemento (`document.createElement`)
4. **Configurar** classes e conteúdo
5. **Adicionar** ao container (`hours.append(li)`)

Selecionar o container fora do loop evita N queries ao DOM desnecessárias.

## Classes condicionais com ternário

O padrão `available ? 'hour-available' : 'hour-unavailable'` é usado quando existem exatamente dois estados visuais. O instrutor mostra no HTML de referência que:

- Horários disponíveis têm a classe `hour-available` (provavelmente com estilo visual ativo)
- Horários indisponíveis têm a classe `hour-unavailable` (provavelmente com estilo desabilitado/cinza)

A lógica de disponibilidade neste ponto é baseada apenas no horário atual (horários passados ficam indisponíveis). O instrutor menciona que depois será adicionada verificação baseada em agendamentos existentes.

## append vs appendChild

O instrutor usa `append` em vez de `appendChild`. A diferença:

- `appendChild` — API antiga, aceita apenas um Node, retorna o node
- `append` — API moderna, aceita múltiplos nodes e strings, não retorna nada

Para este caso são equivalentes, mas `append` é a API recomendada para código moderno.