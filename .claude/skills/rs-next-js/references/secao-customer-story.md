---
name: rs-next-js-secao-customer-story
description: "Enforces data-driven component patterns when building repeated UI sections in Next.js/React. Use when user asks to 'create a section with cards', 'build a testimonials section', 'add customer stories', 'create repeated components', or 'build a landing page section'. Applies rules: extract data arrays above component, iterate with .map(), never copy-paste JSX for similar items, keep data separate from presentation. Make sure to use this skill whenever generating repeated UI elements in React/Next.js. Not for API data fetching, server components, or database queries."
---

# Separacao de Dados e Apresentacao em Componentes Repetidos

> Quando multiplos elementos de UI compartilham a mesma estrutura, defina os dados como array de objetos e itere com .map() — nunca copie e cole JSX.

## Rules

1. **Extraia dados para um array acima do componente** — defina um array de objetos com todos os dados variaveis, porque isso centraliza manutencao e permite adicionar itens sem tocar no JSX
2. **Itere com .map() em vez de duplicar JSX** — um unico bloco de JSX mapeado substitui N copias identicas, porque elimina inconsistencias e reduz superficie de bugs
3. **Use key unica e estavel** — prefira um campo unico do objeto (name, id) como key, porque indices numericos causam problemas de reconciliacao no React
4. **Mantenha dados tipados** — defina a estrutura do objeto (content, author.name, author.role, author.avatar) de forma consistente em todos os itens do array
5. **Imagens em /public com nomes padronizados** — use convencao `customer-01.png`, `customer-02.png`, porque facilita automacao e previne conflitos de nomes
6. **Refatore seccoes anteriores com o mesmo principio** — se identificar copy-paste de cards em outras seccoes, aplique a mesma estrategia de array + .map()

## How to write

### Array de dados acima do componente

```typescript
const customerStories = [
  {
    content: "Depoimento do cliente aqui...",
    author: {
      name: "Annette Bones",
      role: "CEO",
      avatar: "/customer-01.png",
    },
  },
  {
    content: "Outro depoimento aqui...",
    author: {
      name: "Jacob Jones",
      role: "CTO",
      avatar: "/customer-02.png",
    },
  },
]
```

### Iteracao no JSX

```tsx
<div className="grid gap-8 md:grid-cols-2">
  {customerStories.map((story) => (
    <div key={story.author.name} className="flex flex-col gap-6 rounded-lg bg-gray-800 p-6 md:p-12">
      <p className="text-balance text-gray-200">{story.content}</p>
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image src={story.author.avatar} alt={story.author.name} fill className="object-cover" />
        </div>
        <div className="flex flex-col">
          <strong className="text-sm text-gray-200">{story.author.name}</strong>
          <span className="text-xs text-gray-300">{story.author.role}</span>
        </div>
      </div>
    </div>
  ))}
</div>
```

## Example

**Before (copy-paste de cards):**
```tsx
export const CustomerStorySection = () => (
  <section>
    <h2>Quem utiliza</h2>
    <div className="grid md:grid-cols-2">
      <div className="rounded-lg bg-gray-800 p-6">
        <p>Depoimento da Annette...</p>
        <Image src="/customer-01.png" alt="Annette" fill />
        <strong>Annette Bones</strong>
        <span>CEO</span>
      </div>
      <div className="rounded-lg bg-gray-800 p-6">
        <p>Depoimento do Jacob...</p>
        <Image src="/customer-02.png" alt="Jacob" fill />
        <strong>Jacob Jones</strong>
        <span>CTO</span>
      </div>
    </div>
  </section>
)
```

**After (data-driven):**
```tsx
const customerStories = [
  { content: "Depoimento da Annette...", author: { name: "Annette Bones", role: "CEO", avatar: "/customer-01.png" } },
  { content: "Depoimento do Jacob...", author: { name: "Jacob Jones", role: "CTO", avatar: "/customer-02.png" } },
]

export const CustomerStorySection = () => (
  <section>
    <h2>Quem utiliza</h2>
    <div className="grid md:grid-cols-2">
      {customerStories.map((story) => (
        <div key={story.author.name} className="rounded-lg bg-gray-800 p-6">
          <p>{story.content}</p>
          <Image src={story.author.avatar} alt={story.author.name} fill />
          <strong>{story.author.name}</strong>
          <span>{story.author.role}</span>
        </div>
      ))}
    </div>
  </section>
)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| 2+ cards com mesma estrutura | Extraia array de dados + .map() |
| Adicionar novo item no futuro | Apenas adicione objeto ao array, sem tocar no JSX |
| Seccao anterior tem cards duplicados | Refatore com a mesma estrategia |
| Dados vem de API | Mesmo padrao, mas array vem de fetch em vez de constante |
| Array estatico pequeno (2-3 itens) | Ainda vale extrair — escalabilidade e legibilidade |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Copiar bloco JSX inteiro para cada card | Array de dados + `.map()` |
| Key como index do array (`key={i}`) | Key como campo unico (`key={story.author.name}`) |
| Dados hardcoded inline no JSX | Array de objetos acima do componente |
| Nomes de imagem genericos (`img1.png`) | Nomes padronizados (`customer-01.png`) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-secao-customer-story/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-secao-customer-story/references/code-examples.md)
