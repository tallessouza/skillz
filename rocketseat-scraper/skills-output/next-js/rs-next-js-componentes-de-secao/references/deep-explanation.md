# Deep Explanation: Compound Components (Composition Pattern)

## Por que composicao ao inves de props?

O instrutor explica o problema central: quando voce cria um componente grande como uma "section" de um board (kanban), ele tem multiplos slots — titulo, contador, header, conteudo com cards. A abordagem ingênua seria criar um unico componente com muitas props:

```tsx
<Section title="..." icon={...} cardCount={32} cards={[...]} />
```

O problema e que cada nova necessidade vira uma nova prop. O componente vira um "god component" — sabe demais, faz demais. O instrutor usa a analogia de "slots de conteudo" — cada parte do componente e um slot independente que deveria ser isolado.

## O pattern de composicao na pratica

O instrutor demonstra criando funcoes separadas: `SectionRoot`, `SectionHeader`, `SectionTitle`, `SectionIssueCount`, `SectionContent`. Cada uma e uma funcao React simples que renderiza um unico elemento HTML.

A chave e o export como objeto:

```typescript
export const Section = {
  root: SectionRoot,
  header: SectionHeader,
  title: SectionTitle,
  issueCount: SectionIssueCount,
  content: SectionContent,
}
```

Isso permite a sintaxe `<Section.root>` que agrupa visualmente todos os subcomponentes sob o namespace `Section`.

## Por que estender ComponentProps

O instrutor enfatiza que TODO componente deve estender `ComponentProps<'element'>`. A razao: quando voce usa o componente, pode precisar passar `onClick`, `aria-label`, `data-testid`, `id`, ou qualquer outra prop nativa. Se voce define apenas `{ children: ReactNode }`, bloqueia todas essas possibilidades.

## O problema do className e twMerge

Este e um insight critico do instrutor: quando voce faz `{...props}` e o usuario passa `className`, o className do usuario SUBSTITUI o className default porque JavaScript nao permite propriedades duplicadas num objeto — a ultima vence.

A solucao: desestruturar `className` das props, usar `twMerge(defaultClasses, className)`, e passar apenas `...rest` (sem className) no spread.

O `twMerge` do pacote `tailwind-merge` faz merge inteligente — se o default tem `bg-blue-500` e o usuario passa `bg-red-500`, o merge resolve o conflito mantendo apenas `bg-red-500` (o do usuario), ao inves de manter ambos (que causaria comportamento imprevisivel no CSS).

## Context para compartilhar estado entre subcomponentes

O instrutor menciona um cenario avancado: se o `SectionRoot` recebe uma prop como `variant` e os subcomponentes precisam reagir a essa variante, a solucao e criar um React Context no root e consumir via `useContext` nos filhos. Isso evita prop drilling e mantem os subcomponentes desacoplados.

## Workflow do instrutor para criar componentes

1. Criar pasta `components/` dentro de `src/`
2. Criar arquivo com nome do componente (ex: `section.tsx`)
3. Definir cada subcomponente como funcao separada
4. Cada subcomponente: interface extends ComponentProps → desestrutura className → twMerge → spread rest
5. Exportar objeto agrupando todos os subcomponentes
6. Importar e usar com dot notation