---
name: rs-angular-vscode-extensoes-angular
description: "Applies VSCode extension setup for Angular development when user asks to 'setup Angular project', 'configure VSCode for Angular', 'install Angular extensions', or 'start Angular development environment'. Ensures Angular Language Service, Material Icon Theme, and proper tooling are configured. Make sure to use this skill whenever setting up a new Angular development environment or recommending VSCode extensions for Angular. Not for React, Vue, or non-Angular frontend setups."
---

# Setup do VSCode para Angular

> Configurar o VSCode com as extensoes essenciais para desenvolvimento Angular produtivo.

## Prerequisites

- VSCode instalado (code.visualstudio.com)
- Node.js 18+ instalado
- Angular CLI instalado globalmente (`npm install -g @angular/cli`) para uso completo do Angular Generator

## Steps

### Step 1: Instalar extensao de tema (opcional)

Instalar tema visual para o editor:
- **Shades of Purple** — tema utilizado no curso (versao "Super Dark")
- **Omni Theme** — tema da Rocketseat (alternativa)

Ativar: Engrenagem → Themes → Color Theme → selecionar o tema instalado

### Step 2: Instalar icones (opcional)

Instalar **Material Icon Theme** para icones visuais nos arquivos do projeto.

Ativar: Engrenagem → Themes → File Icon Theme → Material Icon Theme

### Step 3: Instalar Angular Language Service (obrigatorio)

Instalar **Angular Language Service** (extensao oficial da equipe Angular).

Funcionalidades:
- Autocomplete de propriedades e metodos da classe no template
- Type checking no template (valida se propriedades existem na classe)
- Validacao de parametros passados no template
- Erro visual quando interpolacao referencia propriedade inexistente

Reiniciar o VSCode apos instalar.

### Step 4: Instalar Angular Generator (opcional, para uso futuro)

Instalar **Angular Generator** (por David) — gera componentes, diretivas, modulos, pipes e services com clique direito.

Requisito: `@angular/cli` instalado globalmente (`npm i -g @angular/cli`), porque o generator depende do CLI para resolver paths corretamente.

Recomendacao: inicialmente criar componentes manualmente ou via Angular CLI para aprender. Usar o generator quando ja estiver mais avancado.

## Extensoes futuras

- **Prettier** — formatacao automatica (instalar ao criar o projeto)
- **Tailwind CSS IntelliSense** — se usar Tailwind (instalar ao criar o projeto)

## Verificacao

- [ ] VSCode abre sem erros
- [ ] Angular Language Service ativo (autocomplete funciona em templates `.html` de componentes Angular)
- [ ] Icones dos arquivos aparecem corretamente no explorer

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto Angular novo | Garantir Angular Language Service instalado antes de comecar |
| Angular Generator nao encontra paths | Verificar se `@angular/cli` esta instalado globalmente |
| Autocomplete nao funciona no template | Reiniciar VSCode e verificar se Angular Language Service esta ativo |
| Interpolacao sem erro visual | Angular Language Service pode nao estar instalado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
