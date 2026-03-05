# Code Examples: Secao Customer Story

## Estrutura de arquivos

```
components/
  CustomerStorySection/
    CustomerStorySection.tsx
    index.ts
public/
  customer-01.png
  customer-02.png
```

## Barrel export (index.ts)

```typescript
export { CustomerStorySection } from "./CustomerStorySection"
```

## Componente completo

```tsx
import Image from "next/image"
import { PT_Sans_Caption } from "next/font/google"

const ptSansCaption = PT_Sans_Caption({
  subsets: ["latin"],
  weight: "700",
})

const customerStories = [
  {
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: {
      name: "Annette Bones",
      role: "CEO",
      avatar: "/customer-01.png",
    },
  },
  {
    content:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    author: {
      name: "Jacob Jones",
      role: "CTO",
      avatar: "/customer-02.png",
    },
  },
]

export const CustomerStorySection = () => {
  return (
    <section className="container py-8 md:py-10 flex items-center">
      <div className="flex flex-col items-center gap-12">
        <h2 className={`${ptSansCaption.className} text-heading-xl text-gray-100`}>
          Quem utiliza a prova
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
          {customerStories.map((customerStory) => (
            <div
              key={customerStory.author.name}
              className="flex flex-col gap-6 rounded-lg bg-gray-800 p-6 md:p-12"
            >
              <p className="text-balance text-gray-200">{customerStory.content}</p>

              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={customerStory.author.avatar}
                    alt={customerStory.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <strong className="text-sm text-gray-200">
                    {customerStory.author.name}
                  </strong>
                  <span className="text-xs text-gray-300">
                    {customerStory.author.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

## Integracao na page

```tsx
import { CustomerStorySection } from "@/components/CustomerStorySection"

export default function Home() {
  return (
    <>
      {/* outras seccoes */}
      <CustomerStorySection />
      {/* outras seccoes */}
    </>
  )
}
```

## Adicionando um novo cliente (demonstracao de escalabilidade)

Para adicionar um terceiro depoimento, basta adicionar um objeto ao array:

```typescript
const customerStories = [
  // ... itens existentes
  {
    content: "Novo depoimento aqui...",
    author: {
      name: "Sarah Wilson",
      role: "VP of Engineering",
      avatar: "/customer-03.png",
    },
  },
]
```

Zero mudancas no JSX. O novo card aparece automaticamente.

## Variacao com tipagem TypeScript

```typescript
interface Author {
  name: string
  role: string
  avatar: string
}

interface CustomerStory {
  content: string
  author: Author
}

const customerStories: CustomerStory[] = [
  // ... objetos com autocomplete e validacao de tipos
]
```

## Aplicando o mesmo padrao em outras seccoes (refatoracao sugerida)

Se uma seccao anterior tinha:

```tsx
// ANTES: copy-paste
<div className="grid md:grid-cols-3">
  <FeatureCard icon={<Icon1 />} title="Feature 1" description="..." />
  <FeatureCard icon={<Icon2 />} title="Feature 2" description="..." />
  <FeatureCard icon={<Icon3 />} title="Feature 3" description="..." />
</div>
```

Refatore para:

```tsx
// DEPOIS: data-driven
const features = [
  { icon: <Icon1 />, title: "Feature 1", description: "..." },
  { icon: <Icon2 />, title: "Feature 2", description: "..." },
  { icon: <Icon3 />, title: "Feature 3", description: "..." },
]

<div className="grid md:grid-cols-3">
  {features.map((feature) => (
    <FeatureCard key={feature.title} {...feature} />
  ))}
</div>
```