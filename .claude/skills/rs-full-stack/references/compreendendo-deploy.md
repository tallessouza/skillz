---
name: rs-full-stack-compreendendo-deploy
description: "Applies deployment concepts when planning or executing application releases, distinguishing development from production environments. Use when user asks to 'deploy an app', 'put in production', 'release to users', 'configure production environment', or 'make app available online'. Make sure to use this skill whenever discussing deployment strategy or environment architecture. Not for CI/CD pipeline configuration, Docker setup, or infrastructure-as-code."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [deploy, production, environments, hosting]
---

# Compreendendo Deploy

> Deploy e o processo de transferir um projeto do ambiente de desenvolvimento para o ambiente de producao, tornando-o acessivel para usuarios finais.

## Key concepts

Existem dois ambientes fundamentais no ciclo de vida de uma aplicacao: desenvolvimento e producao. O ambiente de desenvolvimento e onde o programador cria, testa e itera sobre o codigo no seu computador local. O ambiente de producao e um servidor disponivel online (cloud), mantendo a aplicacao acessivel 24 horas por dia, 7 dias por semana. Deploy e o processo que conecta esses dois ambientes — pegar o que foi construido localmente e disponibilizar para usuarios reais.

## Decision framework

| Quando voce encontra | Aplique |
|---------------------|---------|
| Codigo funcionando apenas localmente | Planejar deploy para ambiente de producao |
| Usuarios precisam acessar a aplicacao | Garantir servidor cloud disponivel 24/7 |
| Multiplos clientes (mobile, web) consumindo API | Ambiente de producao com alta disponibilidade |
| Mudancas no codigo precisam ir para usuarios | Executar novo ciclo de deploy |

## How to think about it

### Ambiente de desenvolvimento
O computador local do desenvolvedor. Aqui voce cria, testa, debugga e itera. Ninguem alem de voce acessa a aplicacao neste ambiente. E o espaco seguro para experimentar.

### Ambiente de producao
Um servidor em cloud, disponivel online 24/7. E onde os usuarios finais — front-end web, mobile, outros servicos — consomem a aplicacao de fato. Este ambiente precisa de estabilidade e disponibilidade.

### O processo de deploy
O passo final: transferir o projeto do ambiente de desenvolvimento para o de producao. Depois do deploy, usuarios reais interagem com a aplicacao. E a ponte entre "funciona no meu computador" e "funciona para todo mundo".

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Deploy e so copiar arquivos para um servidor | Deploy envolve garantir que a aplicacao funcione corretamente no ambiente de producao, com configuracoes apropriadas |
| Ambiente de desenvolvimento e producao sao iguais | Sao ambientes distintos com propositos diferentes — desenvolvimento e para iteracao, producao e para disponibilidade |
| Depois do deploy o trabalho acabou | Deploy e um processo continuo — novas features e fixes requerem novos deploys |

## When to apply

- Ao finalizar o desenvolvimento de uma feature ou projeto completo
- Quando usuarios precisam acessar a aplicacao pela primeira vez
- Ao atualizar uma aplicacao ja em producao com novas mudancas
- Quando planejar a arquitetura de ambientes de um projeto

## Code example

```bash
# Fluxo basico de deploy
npm run build              # Gerar artefatos de producao
# Transferir para servidor cloud (ex: Vercel, Render, AWS)
vercel deploy --prod       # Deploy para producao na Vercel
# Verificar se aplicacao esta acessivel
curl -I https://meuapp.vercel.app
```

## Limitations

- Este conceito nao cobre COMO fazer deploy (ferramentas, plataformas, pipelines)
- Nao aborda estrategias de deploy (blue-green, canary, rolling)
- Nao inclui monitoramento pos-deploy ou rollback


## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Aplicacao funciona local mas nao em producao | Configuracoes de ambiente diferentes | Verifique variaveis de ambiente e dependencias no servidor de producao |
| Deploy falha sem mensagem clara | Logs de build nao verificados | Consulte os logs de build da plataforma de deploy para identificar o erro |
| Usuarios nao conseguem acessar a aplicacao | Servidor nao esta rodando ou porta incorreta | Verifique se o servico esta ativo e a porta esta configurada corretamente |
| Mudancas no codigo nao refletem em producao | Novo deploy nao foi executado | Execute um novo ciclo de deploy apos cada mudanca no codigo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre ambientes, analogias e contexto do deploy
- [code-examples.md](references/code-examples.md) — Exemplos praticos de cenarios de deploy