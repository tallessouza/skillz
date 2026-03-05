# Deep Explanation: Tratamento de Retorno Sucesso ou Falha do Hub

## Por que nem toda resposta do Hub e sucesso

O instrutor (Wellison) destaca que o codigo inicial do app simplesmente usava a resposta do Hub como se sempre fosse dar sucesso. Na pratica, falhas acontecem — o Hub pode retornar erros de validacao, problemas de rede, ou falhas no use case. O Return Pattern usado no fluxo SignalR exige tratamento condicional explicito.

## A sequencia de 3 acoes na falha

Quando o Hub retorna falha, a ordem importa:

1. **Parar a conexao** (`_connection.Stop()`) — liberar recursos e evitar estado inconsistente
2. **Fechar a pagina** (`_navigationService.ClosePage()`) — nao ha o que fazer na tela sem dados validos, o usuario precisara tentar novamente
3. **Exibir feedback** (`ShowFailureFeedback`) — notificar o usuario sobre o que aconteceu

## Snackbar vs Pagina de Erros — decisao de design

O instrutor explica a escolha: a pagina de erros ja existente esta preparada para exibir uma **lista** de mensagens de erro. No fluxo do Hub, sempre sera **apenas uma mensagem**. O Snackbar e mais adequado — rapido, nao-intrusivo, e suficiente para uma unica mensagem.

Para diferenciar do feedback de sucesso:
- **Cor:** `GetDangerColor()` (vermelho) ao inves de `GetHighlightColor()` (azul)
- **Duracao:** 4 segundos ao inves de 3 — tempo extra para ler mensagem de erro

## Sobre duplicacao de codigo no Snackbar

O instrutor faz uma reflexao sobre o Ctrl+C/Ctrl+V entre `ShowSuccessFeedback` e `ShowFailureFeedback`. Ele diz: "depende". Se o design define que os snackbars terao configuracoes completamente diferentes, duplicar faz sentido. Se a unica diferenca e a cor, extrair para uma funcao privada e valido. A decisao depende do projeto e de como o time de design define a aparencia.

## Quando NAO tratar o resultado — o caso do Cancel

O instrutor detalha por que o comando Cancel nao precisa de tratamento condicional:

- **Se deu sucesso:** o Hub remove do dicionario e faz cleanup
- **Se deu erro:** o `UserConnectionsExceptionHubFilter` faz basicamente a mesma coisa — remove do dicionario e notifica se necessario
- O use case de cancelamento nao tem validacao que retorne mensagem de erro significativa
- A unica validacao e "codigo nao existe", e isso nao muda nada no fluxo

Conclusao: quando sucesso e falha levam ao mesmo estado final, tratamento condicional e desnecessario.

## Approve — tratamento com mensagem personalizada

No comando Approve, o tratamento de sucesso inclui uma mensagem formatada com o nome do usuario aprovado, usando `string.Format` com resource strings parametrizadas (ex: "Voce agora esta conectado com {0}"). Isso mostra o padrao de usar resources para i18n com parametros dinamicos.

## Teste com erro forcado

O instrutor demonstra uma tecnica pratica: comentar o codigo de sucesso no Hub da API e forcar um retorno de falha (`"erro de testes"`) para validar visualmente que o tratamento de erro funciona corretamente. Apos validar, descomenta e restaura o codigo original.

## GetDangerColor — extensao de Application

Antes da aula, o instrutor adicionou `GetDangerColor()` como extension method em `ApplicationExtension`. O padrao e o mesmo usado para outras cores: consultar o dicionario de resources buscando `DangerActionColorLight` ou `DangerActionColorDark` baseado no tema do dispositivo.