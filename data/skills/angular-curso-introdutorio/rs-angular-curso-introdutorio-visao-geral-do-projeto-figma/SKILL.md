---
name: rs-angular-intro-visao-geral-figma
description: "Guides Angular component identification from Figma designs when planning a new Angular project. Use when user asks to 'identify components', 'plan Angular layout', 'break down a design', 'analyze Figma', or 'structure Angular pages'. Applies rules: reusable elements become components, page-specific content stays inline, shared UI (navbar) is always a component. Make sure to use this skill whenever starting a new Angular project from a design mockup. Not for CSS styling, state management, or backend logic."
---

# Identificacao de Componentes Angular a partir do Figma

> Antes de codar, identifique todos os componentes analisando repeticao e reuso no design.

## Rules

1. **Cada pagina e um componente** — no Angular, cada tela distinta do Figma vira um componente de pagina, porque o router precisa de um componente por rota
2. **Elementos que repetem em varias paginas viram componentes isolados** — navbar, footer, sidebar, porque criar um componente permite reuso sem duplicacao de HTML/CSS/TS
3. **Itens de lista que repetem viram componentes** — se o mesmo card/item aparece N vezes na lista, extraia um componente para o item, porque isso permite reutilizar o template com dados diferentes via Input
4. **Conteudo especifico de uma unica pagina pode ficar inline** — se nao repete em lugar nenhum, desenvolva direto no componente da pagina, porque criar componente sem reuso e over-engineering
5. **Identifique estados diferentes da mesma tela** — formularios com botoes habilitados/desabilitados sao a mesma pagina com estados diferentes, nao componentes separados
6. **Cada componente Angular tem seu proprio HTML, TypeScript e CSS** — essa separacao e a base da arquitetura de componentes

## Decision Framework

| O que voce ve no Figma | Decisao |
|------------------------|---------|
| Elemento presente em TODAS as paginas (navbar, footer) | Componente isolado + fixo no layout raiz |
| Item que se repete em uma lista | Componente isolado para o item |
| Conteudo unico de uma pagina | Desenvolver direto na pagina |
| Mesma tela com botoes habilitados/desabilitados | Um componente com logica de estado |
| Elemento que aparece em 2+ paginas | Componente isolado reutilizavel |

## How to Identify

### Passo 1: Contar as paginas
Percorra todas as telas do Figma. Cada tela distinta = 1 componente de pagina.

### Passo 2: Identificar elementos fixos
Elementos que aparecem em todas as paginas (ex: navbar) = componentes compartilhados.

### Passo 3: Identificar repeticoes dentro de uma pagina
Itens de lista identicos = componente do item.

### Passo 4: Identificar estados
Telas que sao a mesma pagina com estados diferentes (habilitado/desabilitado, vazio/preenchido) = mesmo componente com logica condicional.

## Example

**Projeto: Gerador de Certificados**

**Analise do Figma:**
```
Paginas identificadas (5 componentes de pagina):
1. Lista de certificados (vazia)
2. Lista de certificados (com itens)
3. Formulario para gerar certificado
4. Visualizacao do certificado gerado
5. Download do certificado

Componentes reutilizaveis:
- Navbar (presente em todas as paginas)
- Item da lista de certificados (repete N vezes)
- Item da lista de atividades (repete N vezes no formulario)

Conteudo inline (nao vira componente):
- Conteudo da pagina de lista vazia (unico)
- Formulario de geracao (unico, estados controlados por logica)
- Certificado renderizado (aparece so em uma tela)
```

**Estrutura resultante:**
```
src/app/
├── components/
│   ├── navbar/           # Fixo em todas as paginas
│   ├── certificate-item/ # Item da lista de certificados
│   └── activity-item/    # Item da lista de atividades
├── pages/
│   ├── certificate-list/ # Pagina da lista
│   ├── generate/         # Pagina do formulario
│   └── certificate-view/ # Pagina do certificado gerado
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Duvida se deve ser componente ou inline | Se aparece 1 vez, comece inline. Extraia depois se necessario |
| Design tem 2 estados da mesma tela | Mesmo componente, use condicional para estados |
| Elemento compartilhado entre 2+ paginas | Sempre componente isolado |
| Lista com itens identicos | Componente para o item, nunca copiar HTML |

## Anti-patterns

| Nao faca | Faca em vez disso |
|----------|-------------------|
| Criar componente para cada elemento visual | So criar componente se repete ou e compartilhado |
| Duplicar HTML da navbar em cada pagina | Criar componente navbar e usar no layout raiz |
| Criar componentes separados para cada estado do formulario | Um componente com logica de habilitacao/desabilitacao |
| Comecar a codar sem identificar componentes | Analisar o Figma primeiro, listar componentes, depois codar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
