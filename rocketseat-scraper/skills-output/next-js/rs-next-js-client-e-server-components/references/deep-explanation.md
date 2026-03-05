# Deep Explanation: Client e Server Components

## O modelo mental do instrutor

No Next.js com App Router, **todo componente e server component por padrao**. Isso e uma mudanca fundamental em relacao ao Pages Router (Next 14 para tras). Server components podem ser `async` e usar `await` diretamente — isso permite data fetching no servidor sem hooks.

## Por que `"use client"` e uma decisao de custo

Quando voce adiciona `"use client"` a um componente, **todo o JavaScript daquele componente e enviado ao navegador**. Isso inclui:
- O proprio codigo do componente
- Todas as dependencias importadas
- A logica de hidratacao do React

Se o componente e grande (um header inteiro, uma sidebar completa, uma pagina), voce esta enviando JavaScript desnecessario para partes que sao puramente visuais e nao precisam de interatividade.

## A restricao tecnica fundamental

Client components **nao podem ser async**. Isso significa:
- Sem `async function Component()`
- Sem `await` dentro do componente
- A unica forma de carregar dados e via hooks: `useEffect` + `useState`, React Query, SWR, etc.

Server components, por outro lado, podem ser `async` e fazer data fetching diretamente:
```tsx
export async function Page() {
  const data = await db.query("SELECT * FROM issues")
  return <div>{data.map(...)}</div>
}
```

## A estrategia de isolamento

O instrutor enfatiza: **isolar ao maximo** o componente que precisa de client-side. A ideia e:

1. Identifique EXATAMENTE qual parte precisa de interatividade (um hook, um `onClick`)
2. Extraia APENAS essa parte para um componente separado
3. Adicione `"use client"` SOMENTE nesse componente pequeno
4. O componente pai permanece como server component

### Exemplo concreto da aula

O header tinha:
- Um titulo (estatico — nao precisa de JS)
- Um campo de busca (usa `useRouter` — precisa de client)
- Um botao de usuario (usa `useSession` — precisa de client)

Solucao: extrair `SearchInput` e `UserButton` como client components separados, manter o `Header` como server component.

## Regra de ouro

> "Sempre que eu tenho uma parte da minha aplicacao que precisa de algum tipo de codigo client-side como um hook ou um event listener, eu tento isolar este componente ao maximo."

Isso se aplica a qualquer evento React: `onClick`, `onHover`, `onMouseOver`, `onChange` — qualquer coisa com "on" na frente.

## Composicao nao contamina

Um ponto crucial: **componentes filhos client nao transformam o pai em client**. Voce pode ter:

```
ServerComponent (sem "use client")
  ├── ClientComponent ("use client")
  ├── OutroClientComponent ("use client")
  └── SubServerComponent (sem "use client")
```

A fronteira do `"use client"` e por **componente**, nao por **arvore**. O pai continua sendo server component e nao envia JS desnecessario.

## Organizacao de pastas (padrao da aula)

```
components/
  header/
    index.tsx          # Server Component (pai)
    search-input.tsx   # Client Component (isolado)
    user-button.tsx    # Client Component (isolado)
```

Ao mover o header para uma pasta, o instrutor usou `header/index.tsx` para manter a importacao limpa (`import { Header } from "./header"`). Tambem mencionou que `header/header.tsx` funcionaria igualmente.