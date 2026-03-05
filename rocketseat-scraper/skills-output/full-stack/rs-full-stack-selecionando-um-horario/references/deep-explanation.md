# Deep Explanation: Preparando Dados do Formulário para Envio à API

## Por que early return em vez de else aninhado?

O instrutor usa o padrão de **early return** consistentemente: verifica uma condição negativa, exibe alert, e faz `return` para encerrar a função. Isso evita o "hadouken code" (ifs aninhados cada vez mais para a direita).

A lógica é: cada validação é um "portão". Se o dado não passa, a função encerra ali. Se passa, segue para o próximo portão. Quem sobrevive a todos os portões tem dados completos e válidos.

```javascript
// Portão 1: nome
if (!name) { alert("..."); return }

// Portão 2: horário
if (!hourSelected) { alert("..."); return }

// Se chegou aqui, tudo válido
```

## Por que querySelector com classe e não com data attribute?

O instrutor usa `.hour-selected` como seletor porque o projeto já usa classes CSS para marcar o estado visual do item selecionado. Quando o usuário clica em um horário, a classe `hour-selected` é adicionada ao elemento. Isso cria uma fonte única de verdade: o que está visualmente selecionado É o que o código recupera.

O retorno `null` do querySelector quando nada tem a classe é um comportamento esperado e útil — permite a verificação `if (!hourSelected)`.

## Composição de data + hora com dayjs

O instrutor separou a data (vinda do date picker) e a hora (vinda da seleção visual). A data já existe como valor do input, e a hora é extraída do texto do elemento (`innerText`).

O `split(":")` no texto "19:00" retorna `["19", "00"]` e pegando `[0]` obtém apenas "19". Depois, `dayjs(date).add(19, "hour")` soma 19 horas à data base (que começa à meia-noite), resultando no datetime correto.

O instrutor mostrou no console que o dayjs guarda internamente num formato específico, mas que dá para ver claramente a data e hora corretas.

## Geração de ID com getTime()

O instrutor usou `new Date().getTime()` que retorna milissegundos desde epoch (1 Jan 1970). É simples e suficiente para um identificador temporário no frontend. Em produção, o backend geralmente gera o ID definitivo (UUID, auto-increment, etc.), então o ID do frontend é apenas para tracking local até o servidor responder.

## O padrão try/catch envolvendo todo o submit

O instrutor envolveu toda a lógica de submit em try/catch logo no início, antes mesmo de começar as validações. O catch exibe um alert genérico para o usuário ("Não foi possível realizar o agendamento") e loga o erro real no console para debugging. Isso garante que qualquer erro inesperado (querySelector em elemento que não existe, dayjs com valor inválido, fetch falhando) seja capturado graciosamente.

## Double check de validação

O instrutor mencionou que o campo de nome já tinha `required` no HTML, mas fez a validação via JavaScript mesmo assim — um "double check". Isso é boa prática porque:
1. Validação HTML pode ser bypassada (DevTools, requests diretos)
2. A validação JS permite mensagens customizadas
3. Garante consistência de comportamento independente do navegador