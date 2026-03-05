---
name: rs-angular-debugando-angular-dev-tools
description: "Guides debugging Angular applications using Angular DevTools browser extension. Use when user asks to 'debug Angular app', 'inspect components', 'view component tree', 'check injected services', 'analyze component inputs', or 'understand Angular app structure'. Applies component inspection, dependency injection tree analysis, and input property debugging. Make sure to use this skill whenever debugging or analyzing Angular component hierarchies. Not for console.log debugging, breakpoint debugging, or non-Angular frameworks."
---

# Debugando com Angular DevTools

> Utilize o Angular DevTools para inspecionar a arvore de componentes, servicos injetados e fluxo de dados sem alterar codigo.

## Quando usar

| Situacao | Angular DevTools resolve? |
|----------|--------------------------|
| Entender hierarquia de componentes | Sim — arvore visual completa |
| Verificar valor atual de um @Input | Sim — mostra valores em tempo real |
| Descobrir quais services estao injetados | Sim — lista com origem da instancia |
| Ver arvore de injecao de dependencia | Sim — aba Injector Tree |
| Inspecionar rotas da aplicacao | Sim — aba Router Tree |
| Debugar logica interna de um metodo | Nao — use console.log ou breakpoints |

## Instalacao

1. Abrir Chrome Web Store
2. Buscar "Angular DevTools"
3. Instalar a extensao
4. Reiniciar o navegador

## Como usar

### Abrir o DevTools

```
Botao direito → Inspecionar → Aba "Angular"
```

A aba Angular so aparece se a aplicacao Angular estiver rodando em modo de desenvolvimento.

### Inspecionar componentes

1. Abrir a aba Angular no DevTools
2. Navegar pela arvore de componentes (AppHeader, AppMainContent, etc.)
3. Clicar em um componente para ver detalhes

### O que cada secao mostra ao selecionar um componente

| Secao | Informacao |
|-------|-----------|
| Servicos injetados | Lista de services com origem da instancia |
| Inputs | Nome do @Input, estrutura e valores atuais |
| Propriedades internas | Variaveis privadas como referencias a services |

### Abas disponiveis

| Aba | Funcao |
|-----|--------|
| Components | Arvore de componentes com propriedades |
| Profiler | Analise de performance de change detection |
| Injector Tree | Arvore visual de injecao de dependencia |
| Router Tree | Arvore de rotas (se a app tiver rotas) |

## Heuristics

| Situacao | Acao |
|----------|------|
| Componente nao mostra propriedades | Componente esta vazio ou so tem template |
| Precisa entender fluxo de dados pai→filho | Inspecionar @Input do componente filho |
| Precisa saber de onde vem um service | Abrir servicos injetados e verificar origem |
| Precisa documentar arquitetura de componentes | Usar Injector Tree para visualizar conexoes |

## Anti-patterns

| Evite | Faca em vez disso |
|-------|-------------------|
| Adicionar console.log so para ver valor de Input | Inspecionar Input direto no DevTools |
| Adivinhar hierarquia de componentes | Abrir arvore de componentes no DevTools |
| Nao saber quais services um componente usa | Verificar secao de servicos injetados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
