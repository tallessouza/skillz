# Deep Explanation: Deploy com AWS AppRunner via CI/CD

## Por que AppRunner e nao ECS/EKS?

O AppRunner abstrai toda a infraestrutura de containers. Voce nao precisa configurar clusters, task definitions, load balancers ou auto-scaling groups. Para aplicacoes simples que rodam em container, e a opcao com menor overhead operacional na AWS.

O AppRunner suporta dois modos:
- **Source-based:** voce passa runtime + build command + start command (sem container)
- **Image-based (boa pratica):** voce passa a imagem do container — toda configuracao ja esta no Dockerfile

A abordagem image-based e preferivel porque o Dockerfile e a fonte de verdade. Nao ha divergencia entre o que roda local e o que roda em producao.

## A jornada de migracoes do modulo

O instrutor enfatiza que o modulo propositalmente passou por migracoes:
1. Comecou com Docker Hub → migrou para ECR
2. Comecou com tokens expostos → migrou para OpenID Connect
3. Comecou com docker-compose local → migrou para AppRunner

Isso reflete o dia-a-dia real: voce raramente comeca com a arquitetura ideal. O importante e saber migrar incrementalmente.

## OpenID Connect vs Token exposto

A configuracao de OIDC levou mais tempo que simplesmente expor um token como secret. Mas o OIDC e a boa pratica porque:
- Tokens sao credenciais de longa duracao (risco se vazarem)
- OIDC gera credenciais temporarias por execucao
- AWS recomenda OIDC para GitHub Actions

O instrutor destaca: "economizaria tempo, mas em detrimento da boa pratica."

## Como funciona o fluxo de outputs entre steps

GitHub Actions usa `$GITHUB_OUTPUT` para passar dados entre steps:

```yaml
# Step A: gera valor
echo "tag=abc123" >> $GITHUB_OUTPUT

# Step B: consome valor
${{ steps.step-a-id.outputs.tag }}
```

O step `login-ecr` da AWS ja exporta `registry` automaticamente por default. O step `generate-tag` exporta `tag` manualmente. O step `build-docker-img` combina ambos para montar a URI completa da imagem e exporta como `img`.

Essa cadeia permite que o step de deploy referencie a imagem exata que foi buildada e pushada, sem hardcode.

## Combinacoes validas de CPU/memoria no AppRunner

O AppRunner nao aceita qualquer combinacao. Exemplo:
- 1 vCPU → minimo 2 GB RAM (1 GB causa erro)
- 2 vCPU → 3 GB ou 4 GB
- 4 vCPU → 8 GB ou 12 GB

O erro e descritivo ("does not accept 1vcpu and 1gb"), mas so aparece em runtime do pipeline. Consulte a documentacao oficial para combinacoes validas.

## O problema do "operation in progress"

Quando o AppRunner esta processando um deploy, ele rejeita novos deploys. Isso acontece especialmente:
- No primeiro deploy (criacao do servico demora mais)
- Quando voce faz push rapido apos um push anterior

O pipeline reporta erro, mas nao e um problema real — apenas timing. Solucoes:
1. Adicionar wait/check antes do deploy
2. Configurar concurrency no workflow para evitar execucoes paralelas
3. Adicionar retry com backoff

## CI OK != CD OK != App OK

O instrutor destaca tres niveis de sucesso:
1. **CI (build + push):** imagem foi construida e enviada ao ECR ✓
2. **CD (deploy):** AppRunner recebeu a imagem e criou o deployment ✓
3. **App saudavel:** a aplicacao de fato iniciou e responde na porta ✓

No exemplo da aula, CI e CD deram certo, mas a app falhou porque tentou conectar a um MySQL que nao existia no ambiente do AppRunner. O hostname `mysql` era valido no docker-compose (nome do container), mas invalido em producao.

## Funcao de compensacao

O instrutor menciona brevemente o conceito de "funcao de compensacao": se o deploy falha, voce poderia disparar um evento no pipeline para desfazer o push da imagem. Nao e comum, mas e um pattern valido para pipelines criticos (similar ao conceito de sagas em microsservicos).