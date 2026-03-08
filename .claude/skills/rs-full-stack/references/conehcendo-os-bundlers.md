---
name: rs-full-stack-conhecendo-os-bundlers
description: "Introduces bundler concepts when user asks about 'bundlers', 'webpack', 'vite', 'esbuild', 'module bundling', 'dependency graph', or 'build tools'. Applies mental model of dependency resolution and packing phases. Make sure to use this skill whenever discussing frontend build pipelines or why bundlers exist. Not for configuring specific bundler tools or writing bundler plugins."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [bundlers, webpack, vite, javascript, build-tools]
---

# Conhecendo os Bundlers

> Bundlers agrupam e empacotam arquivos e suas dependencias em um ou mais pacotes para otimizar o carregamento da pagina.

## Key concepts

Um bundler resolve um problema fundamental: o navegador precisa carregar muitos arquivos JavaScript separados, cada um com suas dependencias. Em vez de forcar o navegador a fazer dezenas de requisicoes HTTP, o bundler analisa toda a arvore de dependencias e gera um unico arquivo (ou poucos arquivos otimizados) que o navegador consegue processar eficientemente.

O processo acontece em **duas etapas distintas**: resolucao de dependencias (dependency resolution) e empacotamento (packing).

## Decision framework

| Quando voce encontra | Aplique |
|---------------------|---------|
| Multiplos `<script>` tags no HTML | Considere um bundler para agrupar em um unico arquivo |
| Imports entre arquivos JS | O bundler vai mapear esse grafo automaticamente |
| Projeto crescendo em complexidade | Bundler garante que dependencias transitivas sao resolvidas |
| Performance de carregamento ruim | Bundler reduz requisicoes HTTP agrupando arquivos |

## How to think about it

### Fase 1: Resolucao de Dependencias (Dependency Resolution)

O bundler parte do **arquivo de entrada** (entry point — geralmente o arquivo principal da aplicacao) e percorre todas as importacoes recursivamente. Ele constroi um **grafo de dependencias**: um mapa de qual arquivo depende de qual.

```
entry.js
├── moduleA.js
│   ├── utilsA.js
│   └── utilsB.js
├── moduleB.js
│   └── utilsB.js (ja mapeado, nao duplica)
└── moduleC.js
```

O bundler analisa: "entry importa A, B e C. A importa utilsA e utilsB. B importa utilsB. C nao importa ninguem." Esse mapa completo e a resolucao de dependencias.

### Fase 2: Empacotamento (Packing)

Com o grafo completo, o bundler pega todos os arquivos mapeados e os integra em um unico pacote de saida. O resultado sao ativos estaticos que o navegador consegue processar e carregar.

```html
<!-- Antes: 4 requisicoes separadas -->
<script src="moduleA.js"></script>
<script src="moduleB.js"></script>
<script src="moduleC.js"></script>
<script src="entry.js"></script>

<!-- Depois: 1 unica requisicao -->
<script src="bundle.js"></script>
```

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Bundler so junta arquivos um atras do outro | Bundler resolve dependencias transitivas, elimina duplicatas e gera um grafo completo antes de empacotar |
| Bundler e so para projetos grandes | Qualquer projeto com imports entre arquivos se beneficia da resolucao de dependencias |
| O bundle.js e uma copia simples dos arquivos | O bundler integra os modulos respeitando o grafo de dependencias, garantindo ordem correta de execucao |

## When to apply

- Ao iniciar qualquer projeto frontend com multiplos arquivos JS
- Ao explicar por que frameworks modernos (React, Vue, Angular) usam bundlers por padrao
- Ao debugar problemas de carregamento onde dependencias nao estao sendo resolvidas
- Ao decidir entre carregar scripts individuais vs usar um build tool

## Limitations

- Este modelo mental cobre o conceito fundamental — bundlers modernos (Webpack, Vite, esbuild, Rollup) adicionam features como code splitting, tree shaking, hot module replacement e lazy loading que vao alem do empacotamento basico
- Bundlers nao sao a unica solucao: ES Modules nativos do navegador e import maps sao alternativas para projetos simples


## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Bundle nao gerado | Entry point nao configurado corretamente | Verifique que o arquivo de entrada esta correto na configuracao do bundler |
| Dependencia nao encontrada no bundle | Import nao resolvido pelo bundler | Confirme que o pacote esta instalado e o caminho de importacao esta correto |
| Bundle muito grande | Sem code splitting ou tree shaking | Configure code splitting e verifique se tree shaking esta ativo no bundler |
| Erro de modulo ao carregar no navegador | Arquivo nao processado pelo bundler | Confirme que todos os arquivos passam pelo pipeline do bundler |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre grafos de dependencia, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Exemplos visuais de antes/depois com variacoes de estrutura