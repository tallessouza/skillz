# Deep Explanation: Gerenciamento de Dicionarios e Validacao em SignalR Hubs

## Por que TryRemove ao inves de TryGetValue

O instrutor identifica um padrao importante: quando voce analisa TODOS os cenarios de uso de uma funcao de leitura e percebe que em 100% dos casos a intencao e remover o valor apos le-lo, voce deve substituir o GET por um REMOVE direto.

No caso especifico, a funcao `GetCodeByConnectionId` era usada em apenas dois cenarios:
1. **Perda de conexao** — o usuario desconectou, precisa avisar o outro lado e limpar
2. **Excecao desconhecida** — algo deu errado, precisa limpar

Em ambos os casos, apos obter o codigo, o proximo passo seria remover do dicionario. Entao o instrutor propoe: por que nao fazer o remove direto e retornar o valor removido?

Isso e diferente do dicionario de `code → connection`, onde existe o cenario legitimo de apenas LER (quando alguem informa um codigo e voce quer recuperar as informacoes para altera-las). La o GET faz sentido. Aqui nao.

## O problema da sobrescrita concorrente

O cenario problematico e sutil:
1. Pessoa A gera codigo "ABC123"
2. Pessoa B usa "ABC123" → seus dados sao armazenados como `ConnectingUserId`
3. Pessoa B espera aprovacao de A
4. Pessoa C usa "ABC123" (codigo ainda valido no dicionario)
5. **SEM validacao:** dados de C sobrescrevem dados de B
6. Quando A aprova, aprova C (que chegou por ultimo), nao B (que chegou primeiro)

A solucao e simples: verificar `ConnectingUserId.HasValue` antes de processar. Se ja tem alguem esperando, retorne erro.

O instrutor opta por reutilizar o enum `InvalidCode` ao inves de criar um novo, justificando que nao ha necessidade de tratativa diferenciada no frontend — basta uma mensagem diferente.

## Nomenclatura de services

O raciocinio do instrutor: quando voce tem multiplos hubs, precisa identificar rapidamente qual service atende qual hub. `CodeConnectionService` nao deixa claro. `UserConnectionsService` espelha `UserConnectionsHub` e cria uma convencao de nomeacao previsivel.

## Limpeza em todos os pontos de saida

O instrutor enfatiza que a limpeza deve acontecer em TODOS os pontos onde o fluxo encerra:
- **OnDisconnectedAsync** — perda de conexao
- **Filtro de excecao** — erro desconhecido
- **ConfirmCodeJoin** — aprovacao bem-sucedida
- **CancelCodeJoin** — cancelamento

Em cada um desses pontos, ambos os dicionarios devem ser limpos. O descarte do valor retornado (usando `_`) e aceitavel quando voce nao precisa do valor, apenas da remocao.