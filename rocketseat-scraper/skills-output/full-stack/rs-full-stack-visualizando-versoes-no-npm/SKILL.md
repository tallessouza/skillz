---
name: rs-full-stack-visualizando-versoes-no-npm
description: "Guides NPM package version inspection and selection when choosing library versions, evaluating dependencies, or auditing packages. Use when user asks to 'install a package', 'check npm versions', 'pick a library version', 'evaluate a dependency', or 'update a package'. Covers npmjs.com navigation, GitHub repo analysis, issue tracking, version tags (latest/next), and download stats interpretation. Make sure to use this skill whenever selecting or evaluating npm package versions. Not for publishing packages, creating libraries, or configuring private registries."
---

# Visualizando Versoes no NPM

> Antes de instalar qualquer dependencia, inspecione suas versoes, comunidade e saude no npmjs.com e GitHub.

## Key concept

Toda biblioteca no NPM tem um ciclo de versoes visivel publicamente. A versao com tag `latest` e a estavel e mais utilizada. A tag `next` indica a proxima versao planejada, disponibilizada para testes da comunidade. Escolher a versao certa exige verificar popularidade (downloads), atividade (issues/PRs recentes) e estabilidade (tag latest vs next).

## Decision framework

| Quando voce encontra | Faca |
|---------------------|------|
| Precisa instalar uma dependencia | Verifique no npmjs.com a versao `latest` e o volume de downloads |
| Versao `next` disponivel | Use apenas para testar — nao em producao, porque a comunidade ainda esta reportando bugs |
| Poucas issues abertas e releases recentes | Sinal positivo de manutencao ativa |
| Muitas issues abertas sem resposta ha meses | Avalie alternativas — biblioteca pode estar abandonada |
| Projeto sem site oficial | Use o README do GitHub como documentacao principal |
| Duvida sobre compatibilidade TypeScript | Verifique no npmjs.com se tem badge de tipagem TS |

## Como inspecionar um pacote

### 1. Navegue ate o npmjs.com
Acesse `npmjs.com` e pesquise pelo nome do pacote (ex: "express"). A pagina mostra:
- **README** com instrucoes de instalacao e exemplos
- **Suporte a TypeScript** (badge de tipagem)
- **Downloads semanais** com grafico temporal
- **Versao atual**, tamanho, licenca, numero de arquivos

### 2. Analise o repositorio no GitHub
Clique no link do repositorio para verificar:
- **Contribuidores** — muitos contribuidores indica comunidade ativa
- **Issues** — filtre por `open`, `closed`, labels como `bug` ou `performance`
- **Historico de discussoes** — veja como o time responde e resolve problemas
- **Dependencias** da propria biblioteca

### 3. Verifique as versoes
Na aba de versoes do npmjs.com:
- **Historico completo** com datas de publicacao
- **Tags** — `latest` (estavel) e `next` (proxima versao planejada)
- **Distribuicao de uso** — quantas pessoas usam cada versao nos ultimos 7 dias

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto novo em producao | Instale a versao `latest` (sem especificar versao) |
| Precisa de feature especifica da proxima versao | Instale com `npm install pacote@next` e teste extensivamente |
| Versao major nova disponivel (ex: 4.x → 5.x) | Verifique breaking changes antes de migrar |
| Biblioteca com poucos downloads (<1K/semana) | Avalie alternativas mais populares |
| Precisa auditar seguranca | Verifique issues com label `security` no GitHub |

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Versao `next` e a melhor porque e mais nova | `next` e pre-release para testes — `latest` e a estavel |
| Versao antiga para de funcionar quando sai nova | Versoes antigas continuam disponiveis e funcionais |
| Toda correcao gera uma nova versao | Varias correcoes se acumulam ate o time decidir lancar uma versao |
| Pacote sem site oficial e mal documentado | Muitos pacotes usam README do GitHub como documentacao completa |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `npm install pacote@next` em producao | `npm install pacote` (instala latest) |
| Instalar sem verificar versao e downloads | Consultar npmjs.com antes de instalar |
| Ignorar issues abertas do repositorio | Verificar saude do projeto no GitHub |
| Assumir que a versao mais alta e a melhor | Verificar qual tag e `latest` vs `next` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre o ecossistema NPM, open source e ciclo de versoes
- [code-examples.md](references/code-examples.md) — Comandos de instalacao e exemplos praticos de selecao de versao