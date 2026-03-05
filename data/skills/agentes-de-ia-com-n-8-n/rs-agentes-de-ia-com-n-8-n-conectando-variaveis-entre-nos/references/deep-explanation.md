# Deep Explanation: Conectando Variáveis entre Nós

## O modelo mental: Entrada-Processamento-Saída

O instrutor enfatiza repetidamente o padrão **entrada → processamento → saída** como a forma correta de pensar sobre cada nó no n8n. Cada nó é uma unidade isolada que:

1. **Recebe dados** (entrada) do nó anterior
2. **Processa** esses dados conforme sua configuração
3. **Produz uma saída** que o próximo nó pode consumir

Esse padrão se repete em cadeia: a saída de um nó vira a entrada do próximo. O instrutor demonstra isso com três nós:
- **Webhook** → entrada: requisição HTTP do usuário → saída: body com campo `moeda`
- **Set/Variável** → entrada: body do webhook → saída: variável `moeda` extraída
- **HTTP Request** → entrada: variável `moeda` → saída: dados da API de cotação

## Por que as variáveis "somem" ao conectar nós

Quando você conecta dois nós que já foram executados separadamente, o n8n **não preserva o histórico de execução** na nova conexão. Isso confunde iniciantes que esperam ver os dados imediatamente após arrastar a conexão.

A solução é o botão **"Execute Previous Node"** — ele re-executa o nó anterior no contexto da conexão atual, populando o painel de input com dados reais que podem ser arrastados.

## APIs "marotas" simplificam o trabalho

O instrutor descobriu que a API de cotação aceita tanto `USD-BRL` quanto apenas `USD`, interpretando automaticamente BRL como moeda de destino. Isso eliminou a necessidade de concatenar strings ou manipular variáveis.

**Lição implícita:** Antes de construir lógica complexa de manipulação de dados, teste a API com o formato mais simples. Muitas APIs são mais flexíveis do que a documentação sugere.

## Modo Desenvolvimento vs Modo Produção

- **Desenvolvimento:** execução visual dentro do editor do n8n, com dados visíveis em cada nó
- **Produção:** URL de produção chamada externamente (Postman, aplicação real), sem visualização inline

O workflow precisa estar **salvo** e com o webhook em **modo produção ativo** para funcionar externamente. O instrutor demonstra que em produção, o webhook retorna apenas "workflow was started" sem os dados processados — isso porque a **saída do webhook não foi configurada**, que é justamente o próximo passo da automação.

## O problema da saída não configurada

Mesmo com todo o pipeline funcionando (webhook captura → variável extraída → HTTP request executa), o resultado final não volta para quem chamou o webhook. O n8n separa a **execução interna** (que funciona) da **resposta ao chamador** (que precisa ser explicitamente configurada).

Isso é um conceito fundamental: no n8n, os dados fluem para frente entre nós, mas a **resposta ao trigger** (webhook) precisa de configuração específica — geralmente um nó "Respond to Webhook" no final do fluxo.

## Renomeando nós e o impacto nas expressões

Os nomes dos nós no n8n não são apenas visuais — eles são usados nas expressões de referência. Se o nó se chama "Webhook", a expressão é `$('Webhook').item.json.campo`. Se renomear para "Captura Moeda", a expressão muda para `$('Captura Moeda').item.json.campo`.

O instrutor menciona que "esses nomes eu posso mudar como eu quiser", mas é importante manter consistência porque renomear um nó **quebra** todas as expressões que o referenciam pelo nome antigo.