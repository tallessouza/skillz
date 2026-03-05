# Deep Explanation: Logs e Acompanhamento

## Por que a pipeline pode mentir sobre o sucesso do deploy

O instrutor explica um problema sutil: quando voce deploya no AppRunner via GitHub Actions sem configurar espera, a pipeline encerra com sucesso assim que o comando de deploy e enviado. Mas o deploy em si ainda esta em andamento ("operation in progress"). Isso significa que voce pode ter um pipeline verde no GitHub enquanto o servico esta falhando no AppRunner.

A solucao e a flag `waitForServiceStabilitySeconds`, que trava o step da pipeline ate que o AppRunner confirme que o servico esta estavel (health check passou, trafego redirecionado). Se o deploy falhar, a pipeline tambem falhara — dando visibilidade real do estado.

## O ciclo de vida do deploy no AppRunner

1. Pipeline envia imagem para ECR
2. AppRunner inicia o deploy (operation in progress)
3. Health check comeca a sondar a porta configurada (ex: 3000)
4. Se health check passa: "application successfully started"
5. Trafego e redirecionado: "routing traffic to application"
6. Servico fica como "Running"

Ate o passo 5, a URL retorna 404 — isso e normal e esperado. O delay entre o inicio do deploy e o redirecionamento de trafego e o motivo pelo qual `waitForServiceStabilitySeconds` existe.

## Rerun sem commit

O instrutor destaca que para re-executar um deploy que falhou por motivos externos (como "operation in progress" de um deploy anterior), nao e necessario fazer um novo commit. Basta usar "Rerun all jobs" no GitHub Actions. Isso reusa a mesma imagem e configuracao.

## Rastreabilidade via tags no ECR

Ao taguear imagens com o commit hash, voce cria rastreabilidade direta: olhando o ECR, sabe exatamente qual commit esta deployado. A tag `latest` serve como conveniencia para referencia rapida. O instrutor mostra no ECR como as tags ficam organizadas e como casar o que esta deployado com o commit correspondente.

## Impacto no tempo do pipeline

O instrutor mostra concretamente: sem a espera, o step levava ~1min14s. Com `waitForServiceStabilitySeconds: 180`, passou para ~3min20s. Desses, ~2min17s foram de espera pelo AppRunner estabilizar. O timeout de 3 minutos foi suficiente, mas aplicacoes maiores podem precisar de mais.

## Observabilidade built-in do AppRunner

O AppRunner fornece sem configuracao adicional:
- **Event logs**: eventos do ciclo de vida do servico (deploy iniciou, health check passou, etc)
- **Application logs**: tudo que o container escreve em stdout/stderr (ex: logs do NestJS)
- **Metricas**: contagem de requisicoes por status HTTP (2XX, 4XX, 5XX), latencia, instancias ativas
- **Tracing**: configuravel para quem precisa de observabilidade mais profunda

Por baixo dos panos, o AppRunner usa CloudWatch — entao todos esses dados estao acessiveis tambem la, com capacidade de queries avancadas.

## Custom domains

O AppRunner fornece uma URL padrao (ex: `xxxxx.us-east-1.awsapprunner.com`). Para usar um dominio proprio, ha duas opcoes:
1. Configurar "Custom Domain" diretamente no AppRunner
2. Usar Route 53 como DNS e apontar para o servico

Em ambos os casos, o AppRunner expoe os apontamentos DNS necessarios.

## Licao de casa do instrutor

1. **Mover secrets para GitHub Secrets** — informacoes sensiveis como tokens e credenciais nao devem ficar no codigo
2. **Otimizar docker push** — ao inves de dois pushes separados (commit hash + latest), usar `docker push --all-tags` em um unico comando