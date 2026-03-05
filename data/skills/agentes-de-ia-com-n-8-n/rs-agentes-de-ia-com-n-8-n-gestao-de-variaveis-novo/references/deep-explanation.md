# Deep Explanation: Gestao de Variaveis no n8n

## Principio fundamental: Entrada, Processamento, Saida

O instrutor reforça repetidamente que **cada bloco/node no n8n segue o padrao entrada → processamento → saida**. Isso nao e apenas organizacao — e o modelo mental correto para entender como dados fluem no n8n.

No caso do Edit Fields:
- **Entrada:** todos os dados vindos do node anterior (body, headers, params, execution mode, etc.)
- **Processamento:** mapear e armazenar apenas o campo necessario (ex: `moeda`) em uma variavel nomeada
- **Saida:** uma variavel limpa com seu valor respectivo, pronta para o proximo node

## Por que nao conectar diretamente?

O gatilho (Webhook, por exemplo) traz uma quantidade enorme de dados — headers, body, parametros, modo de execucao, etc. O HTTP Request seguinte precisa apenas de um ou dois valores. Conectar diretamente:
1. Polui o contexto do proximo node
2. Torna dificil debugar (qual campo veio de onde?)
3. Quebra o principio de responsabilidade unica de cada node

## Duas formas de referenciar dados

### 1. `$json` — Sempre o no anterior
O objeto `$json` e um atalho interno do n8n que referencia automaticamente a **saida do no imediatamente anterior**. Voce escreve `$json.` e o autocomplete mostra tudo que esta disponivel.

Exemplo: `$json.body.moeda` → pega o campo `moeda` dentro de `body` do output do no anterior.

### 2. `$('NomeDoNo')` — Qualquer no pelo nome
Quando o dado que voce precisa nao esta no no imediatamente anterior (por exemplo, esta 3 nos atras), voce usa a sintaxe `$('NomeDoNo')`. A estrutura muda levemente:

```
$('Webhook').item.json.body.moeda
```

Note o `.item.json` intermediario — isso e necessario porque quando voce referencia por nome, precisa navegar pela estrutura completa do item.

## O autocomplete como ferramenta de exploracao

O instrutor demonstra que ao abrir `{{ }}` e digitar `$json.`, o n8n mostra todas as opcoes disponiveis (body, execution mode, headers, parametros). Da mesma forma, `$('` lista todos os nodes disponíveis. Isso elimina a necessidade de memorizar estruturas — use o autocomplete para explorar.

## Fixed vs Expression

No Edit Fields, cada campo pode ser:
- **Fixed:** valor literal, hardcoded (ex: "USD-BRL")
- **Expression:** valor dinamico vindo de outro node (ex: `{{ $json.body.moeda }}`)

O n8n indica visualmente: campos em modo Expression ficam com cor diferente e mostram o valor resolvido em tempo real. O instrutor destaca que ao arrastar um campo do painel esquerdo, o n8n automaticamente converte para Expression.