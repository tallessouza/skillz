# Deep Explanation: Roteamento e Layouts no Next.js App Router

## Por que o App Router mudou tudo

No antigo Pages Router, cada arquivo dentro de `pages/` automaticamente virava uma rota. Isso significava que voce nao podia colocar componentes auxiliares dentro da pasta de rotas sem criar rotas indesejadas.

O App Router inverte essa logica: somente arquivos com nomes reservados (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `template.tsx`) tem significado especial. Qualquer outro arquivo — componentes, hooks, utils — pode existir dentro de `app/` sem criar rotas.

## Arquivos especiais do App Router

- **`page.tsx`** — Define uma pagina. O nome da pasta pai determina o segmento da URL.
- **`layout.tsx`** — Envolve todas as paginas e sub-layouts abaixo. Persiste entre navegacoes (nao re-renderiza).
- **`loading.tsx`** — UI de loading com Suspense automatico.
- **`error.tsx`** — Error boundary automatico.
- **`not-found.tsx`** — Pagina 404 customizada.
- **`template.tsx`** — Similar ao layout, mas re-renderiza a cada navegacao.

## Como o encadeamento de layouts funciona

O Next.js compoe layouts de fora para dentro automaticamente:

```
app/layout.tsx (root)
  └── app/(dashboard)/layout.tsx
        └── app/(dashboard)/users/page.tsx
```

Resulta em:
```tsx
<RootLayout>
  <DashboardLayout>
    <UsersPage />
  </DashboardLayout>
</RootLayout>
```

O Diego destaca que isso e poderoso porque voce nao precisa gerenciar essa composicao manualmente. O Next faz o encadeamento automatico.

## Route Groups — A sacada que resolve organizacao

O problema classico: voce quer agrupar rotas por contexto (autenticadas vs publicas) mas nao quer que o nome do grupo apareca na URL.

Sem route groups:
- `app/dashboard/users/page.tsx` → URL: `/dashboard/users`
- `app/noauth/signin/page.tsx` → URL: `/noauth/signin` (feio!)

Com route groups:
- `app/(dashboard)/users/page.tsx` → URL: `/users`
- `app/(auth)/signin/page.tsx` → URL: `/signin`

As parenteses dizem ao Next: "esta pasta e organizacional, nao um segmento de URL."

## Insight do Diego: Componentes dentro de `app/`

O Diego tem uma preferencia clara sobre onde colocar componentes:

- **`components/`** (raiz): Componentes reutilizaveis entre varias paginas. Botoes, inputs, cards genericos.
- **Dentro de `app/`**: Componentes que pertencem a um contexto especifico de paginas. Como o Next ignora arquivos que nao sao `page.tsx`/`layout.tsx`/etc, voce pode ter componentes auxiliares junto das paginas que os usam.

Isso e uma mudanca de mentalidade em relacao ao Pages Router, onde tudo dentro de `pages/` virava rota.

## Por que o Diego nao larga mais file-based routing

O Diego menciona que mesmo quando cria aplicacoes sem Next.js, ele usa file-based routing (por exemplo, com TanStack Router). O padrao de organizar rotas por pastas, com layouts encadeados e route groups, se provou tao produtivo que ele adotou em todo projeto web.

A razao principal: a estrutura de pastas SE TORNA a documentacao das rotas. Voce olha a arvore de arquivos e sabe exatamente quais rotas existem e como elas se relacionam.

## Demonstracao pratica: Movendo para route group

O Diego demonstrou ao vivo:
1. Criou pasta `(board)` dentro de `app/`
2. Moveu `page.tsx` para dentro de `(board)/`
3. A aplicacao continuou funcionando na mesma URL
4. Criou `layout.tsx` dentro de `(board)/` com um header
5. Criou `test/page.tsx` dentro de `(board)/`
6. Ambas as paginas compartilharam o mesmo layout com header

Isso prova que route groups permitem layouts compartilhados sem afetar URLs.