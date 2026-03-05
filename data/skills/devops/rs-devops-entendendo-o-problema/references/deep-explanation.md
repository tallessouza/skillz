# Deep Explanation: Gerenciamento Efêmero de Logs em Containers

## O problema central

Quando saimos do ambiente local (docker-compose) para ambientes como Kubernetes, a maneira convencional de persistir dados via volumes nao e tao simples de gerenciar. O instrutor destaca que, embora funcione, nao e trivial e nao e tao seguro.

## Efemeridade como principio

O instrutor enfatiza que efemeridade e "a palavra da vez" quando se trabalha com containers. Isso significa:

- Tudo que um container salva localmente e **perdido** quando o container deixa de existir
- Isso e por design, nao e um bug — containers sao descartaveis

## A analogia com S3

O instrutor faz uma analogia importante: assim como a boa pratica para salvar arquivos em containers e mandar para o S3 ou banco de dados externo ao cluster, logs seguem exatamente o mesmo principio. O container se mantem efemero, e o que passa por ele e persistido em "algum lugar terceiro".

## PV (Persistent Volume) — quando funciona e quando nao

O instrutor reconhece que PV com claim funciona e e boa pratica **dependendo do contexto**. Porem, para logs:
- A volumetria e muito grande
- Sao dados sensiveis
- O ideal e manter a efemeridade do servico de log

## Separacao de responsabilidades

O fluxo descrito pelo instrutor:
1. **Loki** — faz ingestao dos logs (efemero)
2. **Ferramenta de storage** — persiste os dados (duravel)
3. No ambiente local, a ferramenta de storage tambem roda como container com volume, mas isso e aceitavel apenas para desenvolvimento

## Contexto do modulo

Esta aula e introdutoria ao conceito. O instrutor menciona que:
- A ferramenta de storage que sera configurada trabalha com um conceito "extremamente famoso" aplicavel a outros contextos alem de logs
- A ferramenta nao e muito famosa em si, mas o conceito por tras dela sim
- Nas proximas aulas sera feita a configuracao hands-on

## Conexao com aulas anteriores

O instrutor referencia que ja passaram por:
- Configuracoes do Prometheus
- Metricas
- Mimir (storage de metricas)

Agora o foco muda para a camada de **logs** dentro da stack de observabilidade.