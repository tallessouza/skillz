# Deep Explanation: Navegacao por Abas no Next.js App Router

## Por que layout e nao componente solto?

O Diego cria o layout dentro de `[org-slug]/layout.tsx` especificamente para que header e tabs persistam em todas as paginas daquela organizacao. No App Router do Next.js, o layout nao re-renderiza quando voce navega entre paginas filhas — apenas o `children` muda. Isso significa que a navegacao por abas fica instantanea, sem flickering.

## O pattern asChild do Radix

O `asChild` e uma feature do Radix UI (usado pelo shadcn/ui) que permite composicao de componentes. Quando voce coloca `asChild` no `<Button>`, ele nao renderiza um `<button>` HTML — em vez disso, passa todos os seus estilos e props para o filho direto. Isso resolve o problema semantico de ter um `<button>` dentro de um `<a>`, ou vice-versa.

O Diego explica: "o componente que eu colocar dentro deles, que no caso vai ser o link do next, vai receber os estilos do botao e as funcionalidades do botao, porem nao vai ser um botao, vai continuar sendo um link."

## NavLink como utility reutilizavel

O Diego menciona que tem o NavLink "em praticamente todos os meus projetos". E um pattern universal: um wrapper sobre o `<Link>` do Next.js que adiciona consciencia de rota ativa via `usePathname()`.

A escolha de usar `data-current` como data attribute em vez de classes condicionais e intencional — permite que o estilo seja controlado via Tailwind com `data-[current=true]:` sem logica JavaScript no className.

## Server vs Client component

O componente `Tabs` em si e um server component (pode usar `getCurrentOrg()` que acessa cookies no servidor). Apenas o `NavLink` precisa ser client component porque usa `usePathname()`. Essa separacao e importante: mantem o minimo possivel no client bundle.

O Diego nota: "como isso aqui e um server component, eu posso buscar isso atraves do nosso metodo getCurrentOrg. Se nao fosse um server component, eu poderia utilizar o useParams tambem."

## Estilizacao com border-transparent

O truque de `border border-transparent` garante que todos os botoes ocupem o mesmo espaco, evitando layout shift quando o ativo recebe `border-border`. Sem o `border-transparent`, adicionar borda ao item ativo faria ele "pular" 1-2px.

## Funcionalidade sobre visual

O Diego e explicito: "nessa aplicacao o foco nao e tanto no visual assim, tem outras aplicacoes que a gente vai muito mais a fundo no visual, e muito mais na funcionalidade em si." Isso reflete uma decisao pragmatica — tabs funcionais com estilizacao minima mas efetiva (ghost variant, muted-foreground, border highlight).

## Consistencia de largura

O `max-w-[1200px]` e repetido em tres lugares: header, tabs nav, e main content. Isso garante que tudo se alinha verticalmente. O Diego copia o valor do header para manter consistencia.