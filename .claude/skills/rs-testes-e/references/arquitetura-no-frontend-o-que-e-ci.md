---
name: rs-testes-arquitetura-frontend-ci
description: "Applies Continuous Integration concepts and best practices when setting up CI pipelines, configuring GitHub Actions, or discussing deployment strategies. Use when user asks to 'setup CI', 'create a pipeline', 'configure GitHub Actions', 'add automated tests to CI', or 'explain CI vs CD'. Ensures correct understanding of CI/CD/CD distinction and pipeline requirements. Make sure to use this skill whenever creating or reviewing CI configurations. Not for application code, unit test writing, or infrastructure provisioning."
---

# Continuous Integration (CI)

> CI é a prática de integrar e validar automaticamente alterações de código de múltiplos desenvolvedores em um repositório compartilhado, várias vezes por dia.

## Key concept

CI não é apenas juntar código — é validar essa união. Cada integração é verificada por build automatizado e testes automatizados para detectar erros o mais rápido possível. Sem CI, problemas de integração só aparecem dias ou semanas depois. Com CI, aparecem em minutos.

A analogia: uma banda onde cada músico compõe sua parte em estúdios separados sem nunca ouvir o outro. No dia do show, tentam tocar juntos pela primeira vez — o resultado é desastroso. CI é o ensaio contínuo.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Pipeline sem testes | Pipeline sem sentido — erros vão quebrar em outro lugar em vez de serem detectados no CI |
| Dev novo no time sem lefthook configurado | CI garante que validações rodam independente do setup local |
| Dúvida entre CI e CD | CI = validar código (foco no dev). CD = entregar código (foco no ambiente) |
| Merge gigante com conflitos | CI incentiva integrações frequentes, reduzindo tamanho e risco de conflitos |
| "Dev coda, DevOps faz deploy" | Errado. "You build it, you run it" — quem codou opera |

## CI vs CD vs CD

| Conceito | Foco | O que faz | Deploy para produção |
|----------|------|-----------|---------------------|
| **CI** (Continuous Integration) | Desenvolvedor | Build + testes → artefato validado (ex: imagem Docker) | Não |
| **CD** (Continuous Delivery) | Ambiente | Envia artefato para homologação automaticamente | Manual (botão) |
| **CD** (Continuous Deployment) | Usuário final | Cada alteração que passa nos testes vai direto para produção | Automático |

## Componentes de uma pipeline CI

| Componente | Descrição | Exemplos |
|-----------|-----------|----------|
| Versionamento | Sistema de controle de código | Git + GitHub/GitLab/Bitbucket |
| Scripts de automação | Comandos de build e teste | `npm test`, `npm run build`, `npm run lint` |
| Orquestrador | Ferramenta que executa a pipeline | GitHub Actions, GitLab CI, Jenkins, Azure DevOps |
| Ambiente de execução | Runners/agents que rodam os comandos | Containers Docker |

## Impactos positivos

1. **Feedback rápido** — descobre que algo quebrou em minutos, não em semanas
2. **Autonomia** — time corrige problemas de build sem depender de terceiros
3. **Confiança** — time não tem medo de fazer merge quando testes passam na pipeline
4. **Velocidade** — menos tempo resolvendo conflitos, mais tempo entregando funcionalidades
5. **Cultura de testes** — CI obriga o time a escrever testes (pipeline sem testes não faz sentido)
6. **Padronização** — todo código passa pelo mesmo critério: linters, segurança, padrões, testes, build
7. **Qualidade de vida** — menos bugs em produção = menos chamados de madrugada

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| CI é coisa de DevOps | CI é responsabilidade de todo dev — "you build it, you run it" |
| Pipeline CI sem testes funciona | É um script que vai quebrar em outro lugar — perde o sentido |
| CD sempre é deploy automático | Continuous Delivery tem botão manual; Continuous Deployment é automático |
| Lefthook local é suficiente | Dev pode pular hooks locais; CI garante validação independente do setup |
| CI só roda testes | CI inclui build, linters, checagem de segurança, padrões de projeto e testes |

## Limitations

- CI não substitui code review humano — apenas automatiza validações objetivas
- CI não garante qualidade de UX ou decisões de produto
- Pipeline lenta pode virar gargalo — otimize tempo de execução
- CI sem testes bem escritos dá falsa sensação de segurança

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-o-que-e-ci/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-o-que-e-ci/references/code-examples.md)
