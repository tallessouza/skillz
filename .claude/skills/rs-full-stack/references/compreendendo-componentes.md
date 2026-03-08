---
name: rs-full-stack-compreendendo-componentes
description: "Enforces React component design principles when creating, splitting, or refactoring components. Use when user asks to 'create a component', 'split into components', 'refactor UI', 'componentize', or 'organize React code'. Applies Lego-over-puzzle mental model: only extract components when reusable across multiple places, keep each component focused on one responsibility, reduce complexity through isolation. Make sure to use this skill whenever deciding whether to extract a new React component. Not for state management, hooks, API integration, or styling decisions."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [react, components, architecture, reusability]
---

# Compreendendo Componentes React

> Componentes sao pecas de Lego, nao de quebra-cabeca: so extraia um componente quando ele pode ser reaproveitado em lugares diferentes.

## Key concepts

Um componente React e uma peca independente da interface que tem sentido sozinha — como um pneu de carro. Pode ser simples (atomico) ou composto por outros componentes menores. A decisao de componentizar nao e "componentize tudo", mas sim "componentize o que sera reaproveitado".

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Elemento UI repetido em 2+ lugares | Extraia como componente reutilizavel |
| Elemento UI usado em apenas 1 lugar | Mantenha inline — nao crie componente so para aquilo (peca de quebra-cabeca) |
| Componente ficando grande e complexo | Quebre em componentes menores, cada um com responsabilidade isolada |
| Arquivo com 200+ linhas de JSX | Identifique blocos logicos e extraia componentes focados |
| Botao/input/card usado em toda a aplicacao | Componente obrigatorio — reutilizacao direta |

## How to think about it

### Lego vs Quebra-cabeca

Quebra-cabeca: cada peca ocupa uma posicao especifica e so funciona ali. Criar um componente que so serve em um lugar e como criar uma peca de quebra-cabeca — nao compensa.

Lego: pecas podem ser encaixadas em posicoes diferentes, com outras pecas, em contextos diferentes. Um bom componente React funciona assim — voce cria uma vez e usa em varios lugares.

### Carro como analogia de composicao

Um carro e composto por componentes (motor, pneu, volante). Alguns componentes dependem de outros. Cada um tem uma funcionalidade clara. Voce pode examinar e manter cada peca separadamente sem entender o carro inteiro. Aplicacoes React funcionam da mesma forma.

## Beneficios da componentizacao

| Beneficio | Por que importa |
|-----------|----------------|
| Reutilizacao de codigo | Crie 1 botao, use em 20 lugares |
| Produtividade | Desenvolva mais rapido reaproveitando pecas |
| Isolamento de responsabilidade | Cada componente cuida do seu contexto |
| Legibilidade | Codigo separado e organizado e mais facil de ler |
| Reducao de complexidade | Componentes focados sao mais simples que arquivos monoliticos |
| Arquivos menores | Impacta positivamente no carregamento da aplicacao |
| Padronizacao | Componentes reutilizaveis forcam consistencia visual e comportamental |

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Tudo deve ser componentizado | So componentize o que sera reaproveitado ou esta complexo demais |
| Componente = arquivo separado apenas | Componente e uma unidade logica com responsabilidade propria |
| Componentizar e perda de tempo | Componentizar corretamente acelera desenvolvimento e manutencao |
| Um componente deve ser pequeno | Um componente deve ser focado — tamanho e consequencia, nao objetivo |

## Code example

```jsx
// Componente reutilizavel (Lego) — usado em multiplos lugares
function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>
}

// Composicao de componentes
function App() {
  return (
    <div>
      <Button label="Salvar" onClick={() => console.log('save')} />
      <Button label="Cancelar" onClick={() => console.log('cancel')} />
    </div>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Duvida se deve extrair componente | Pergunte: "isso sera usado em outro lugar?" — se sim, extraia |
| Componente com muitas responsabilidades | Quebre em subcomponentes focados |
| Codigo JSX repetido em 2+ arquivos | Extraia imediatamente como componente compartilhado |
| Elemento unico e simples | Mantenha inline, nao over-engineer |


## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Componente criado mas nao aparece na tela | Nao foi importado ou usado no JSX pai | Importe e inclua `<MeuComponente />` no JSX do componente pai |
| Componente nao recebe dados | Props nao foram passadas ou desestruturadas | Passe props no JSX pai e desestruture no componente filho |
| Arquivo ficou grande demais | Muitas responsabilidades em um unico componente | Identifique blocos logicos e extraia componentes focados |
| Componente duplicado em varios lugares | Nao foi extraido para pasta compartilhada | Mova para `components/` e importe de la |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre Lego vs quebra-cabeca, analogia do carro, e quando componentizar
- [code-examples.md](references/code-examples.md) — Exemplos praticos de componentizacao com antes/depois