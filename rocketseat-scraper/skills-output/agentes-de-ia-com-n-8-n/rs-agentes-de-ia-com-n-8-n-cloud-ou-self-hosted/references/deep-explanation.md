# Deep Explanation: Cloud ou Self-hosted

## Por que o self-hosted popularizou o n8n

O n8n tem uma Community Edition gratuita que pode ser instalada em infraestrutura propria. Isso eliminou a barreira de entrada — qualquer pessoa com um servidor pode ter automacoes ilimitadas sem pagar SaaS. Essa e a principal razao da popularidade do n8n comparado a concorrentes pagos.

## A armadilha do "gratis"

O instrutor compartilha experiencia propria: ja rodou projetos grandes no n8n self-hosted, incluindo uma plataforma SaaS de comunicacao e automacao. O que aconteceu? Demandas de infraestrutura comecaram a surgir.

O cenario problematico:
- VPS unica rodando n8n + banco de dados + processamentos
- Volume alto de execucoes consome memoria e CPU
- VPS cai → n8n cai → todas as automacoes param
- Se os processos sao criticos (ex: area de vendas), isso e catastrofico

A licao: "gratis" no software nao significa "gratis" no total. O custo se transfere para infraestrutura, manutencao e risco.

## Precos do cloud (na epoca da gravacao)

- **Starter:** R$150/mes — 2.500 execucoes
- **Pro:** R$313/mes — 10.000 execucoes
- **Enterprise:** ~R$4.167/mes — 40.000 execucoes

O salto de 10k para 40k execucoes e desproporcional em custo. O instrutor destaca que os precos e o site mudam frequentemente.

## Variaveis globais

A Community Edition (self-hosted gratis) nao tem variaveis globais. O instrutor menciona que nao e obrigatorio — da pra contornar de outras formas — mas e uma funcionalidade "bem interessante que faz total diferenca" nos planos pagos.

## Analogia do custo real

O instrutor coloca na balanca:
- R$30/mes de VPS + conhecimento de Linux + Docker + manutencao + risco de downtime
- vs R$150-300/mes do cloud onde "eles resolvem toda a questao de infraestrutura"

Para empresas sem equipe de infra, pagar o cloud e mais barato que o prejuizo de um downtime ou o custo de aprender/contratar infra.

## Escalar self-hosted

Quando o volume cresce, self-hosted exige:
- Separar banco de dados da aplicacao (nao rodar tudo na mesma VPS)
- Considerar AWS ou similar (versatil mas caro)
- Pensar em alta disponibilidade e redundancia

Isso pode facilmente superar o custo do cloud, anulando a vantagem do "gratis".