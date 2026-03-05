---
name: rs-angular-estrutura-projeto
description: "Applies Angular project structure knowledge when navigating, creating, or configuring Angular projects. Use when user asks to 'create angular project', 'setup angular', 'configure angular.json', 'add dependency', or asks 'what is this file for' in an Angular context. Maps every file and folder to its purpose and ownership. Make sure to use this skill whenever the user is confused about Angular project files or generating new Angular projects. Not for React, Vue, or non-Angular frameworks."
---

# Estrutura do Projeto Angular

> Conheca cada arquivo e pasta de um projeto Angular para navegar com confianca e saber onde configurar cada aspecto da aplicacao.

## Key concept

Um projeto Angular gerado pelo CLI segue uma estrutura padrao onde cada arquivo tem um dono claro: o Angular CLI, o npm, o TypeScript, ou o desenvolvedor. Saber quem gerencia cada arquivo evita editar o que nao deve ser editado e agiliza a localizacao de configuracoes.

## Decision framework

| Quando voce precisa | Onde ir |
|---------------------|---------|
| Configurar build, serve, test, assets, schematics | `angular.json` |
| Adicionar/remover dependencias | `package.json` via `npm install` |
| Configurar TypeScript (app) | `tsconfig.app.json` |
| Configurar TypeScript (testes) | `tsconfig.spec.json` |
| CSS global (todas as paginas) | `src/styles.css` |
| CSS de um componente | `src/app/{componente}.component.css` |
| HTML base da aplicacao | `src/index.html` (raramente editar) |
| Bootstrap da aplicacao | `src/main.ts` (raramente editar) |
| Rotas da aplicacao | `src/app/app.routes.ts` |
| Providers globais (HTTP, etc) | `src/app/app.config.ts` |
| Assets estaticos (imagens, icones) | `public/` |
| Ignorar arquivos no Git | `.gitignore` |

## How to think about it

### Camada de configuracao (raiz)

Arquivos na raiz sao configuracoes — voce quase nunca edita manualmente:

- **`angular.json`** — Coracao da aplicacao. O CLI le este arquivo para saber como fazer serve, build e test. Configura schematics (como gerar componentes), assets, environments, e CSS global.
- **`tsconfig.*.json`** (3 arquivos) — Configuracoes TypeScript. `tsconfig.json` e base, `.app.json` para a app, `.spec.json` para testes.
- **`package.json`** — Gerenciado pelo npm. Contem scripts (`ng serve`, `ng build`, `ng test`) e duas categorias de dependencias.
- **`package-lock.json`** — Nunca editar manualmente. O npm gerencia versoes exatas de todas as dependencias (e dependencias das dependencias).

### dependencies vs devDependencies

- **dependencies** — Vao para o bundle final de producao (Angular core, RxJS, bibliotecas de UI)
- **devDependencies** — Apenas para desenvolvimento (TypeScript, Karma, ferramentas de teste). O navegador nao precisa delas.

### Camada de codigo (`src/`)

```
src/
├── index.html          # HTML base — carrega <app-root>
├── main.ts             # Bootstrap da aplicacao
├── styles.css          # CSS global (classes disponiveis em todos componentes)
└── app/
    ├── app.component.ts       # Classe do componente raiz
    ├── app.component.html     # Template do componente raiz
    ├── app.component.css      # Estilos escopados ao componente raiz
    ├── app.component.spec.ts  # Testes unitarios do componente raiz
    ├── app.config.ts          # Providers globais (HttpClient, rotas)
    └── app.routes.ts          # Configuracao de rotas
```

### Scripts npm vs Angular CLI

Os scripts no `package.json` delegam para o Angular CLI **local** do projeto (nao o global):

| Script | Comando real | Funcao |
|--------|-------------|--------|
| `npm run start` | `ng serve` | Serve a app no navegador (dev) |
| `npm run build` | `ng build` | Gera codigo final (HTML/JS/CSS puro) |
| `npm run test` | `ng test` | Executa testes unitarios |

O CLI local esta em `node_modules/.bin/ng` — nao confundir com uma instalacao global.

### Pastas que voce nao edita manualmente

| Pasta | Motivo |
|-------|--------|
| `node_modules/` | Gerenciada pelo npm. Nunca alterar arquivos aqui. Deletar e reinstalar se necessario. |
| `.angular/` | Cache interno do Angular CLI |
| `.vscode/` | Configuracoes do editor |

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| `ng serve` usa o CLI global | Usa o CLI **local** instalado em `node_modules` |
| `node_modules` deve ir pro Git | Nunca — esta no `.gitignore`, recria com `npm install` |
| `angular.json` precisa ser editado sempre | Raramente — o CLI gerencia a maioria das configuracoes |
| CSS no `styles.css` e escopado | E **global** — disponivel em todos os componentes |
| CSS no `*.component.css` e global | E **escopado** — apenas para aquele componente |

## When to apply

- Ao criar um novo projeto Angular e precisar entender a estrutura gerada
- Ao decidir onde colocar uma configuracao (angular.json vs tsconfig vs package.json)
- Ao adicionar assets estaticos (usar `public/`)
- Ao diferenciar dependencias de producao vs desenvolvimento
- Ao gerar componentes com `ng generate` e querer customizar via schematics

## Limitations

- Esta skill cobre a estrutura padrao do Angular CLI (standalone, sem NgModules legado)
- Projetos com NX, monorepos ou configuracoes customizadas podem ter estrutura diferente
- Nao cobre configuracoes avancadas de `angular.json` (budgets, SSR, service workers)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
