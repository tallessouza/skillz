# Deep Explanation: Modal com Radix UI e Intercepting Routes

## Por que Radix UI Dialog?

O instrutor escolhe Radix UI (`@radix-ui/react-dialog`) especificamente pela acessibilidade. Ao inves de construir um modal do zero com `div`s e `onClick`, o Radix fornece:

- **Focus trap**: o foco fica preso dentro do modal
- **Escape para fechar**: comportamento nativo
- **Aria attributes**: automaticamente aplicados
- **Portal**: renderiza fora da arvore DOM do componente pai

O erro que aparece quando nao tem `Dialog.Title` e justamente o Radix enforcing acessibilidade — ele exige um titulo para screen readers.

## Anatomia do Radix Dialog

A estrutura sempre segue esta hierarquia:

```
Dialog.Root
  Dialog.Portal
    Dialog.Overlay  (fundo escuro)
    Dialog.Content  (conteudo do modal)
      Dialog.Title  (obrigatorio para a11y)
      children
```

O `Dialog.Portal` renderiza o conteudo em um portal DOM, fora da arvore do componente. Isso evita problemas de z-index e overflow.

## defaultOpen vs open controlado

No caso de intercepting routes, o modal ja deve estar aberto quando a pagina renderiza. Por isso usamos `defaultOpen` ao inves de controlar com `useState`. O ciclo de vida e:

1. Usuario clica em um link → Next.js intercepta a rota
2. O slot `@modal` renderiza com o componente do modal
3. O modal ja aparece aberto (`defaultOpen`)
4. Quando fecha (Escape, click no overlay, botao voltar) → `onOpenChange(false)`
5. `router.back()` remove a rota interceptada → modal some

## router.back() como mecanismo de fechamento

O instrutor usa `router.back()` do `next/navigation` para fechar o modal. Isso e fundamental porque:

- A rota interceptada adicionou uma entrada no historico
- `router.back()` volta para a rota anterior (o board)
- O slot `@modal` para de renderizar o conteudo
- O usuario pode usar o botao voltar do navegador tambem

Se usasse `router.push("/board")` ao inves de `router.back()`, quebraria o historico de navegacao.

## Separacao Client vs Server dentro do modal

O instrutor faz uma separacao importante:

- **Modal wrapper** (`use client`): precisa de hooks (`useRouter`, `onOpenChange`)
- **IssueDetails** (server component): faz fetch de dados no servidor

Isso permite que o conteudo do modal carregue dados sem JavaScript no cliente. O modal wrapper so cuida da UI (abrir/fechar/animacao), e o conteudo e renderizado no servidor.

## sr-only para Dialog.Title

O `className="sr-only"` do Tailwind aplica:

```css
position: absolute;
width: 1px;
height: 1px;
padding: 0;
margin: -1px;
overflow: hidden;
clip: rect(0, 0, 0, 0);
white-space: nowrap;
border-width: 0;
```

O elemento existe no DOM (screen readers leeem), mas e invisivel visualmente. Isso satisfaz o requisito do Radix sem afetar o design.

## twMerge para extensibilidade

O instrutor usa `tailwind-merge` para combinar classes:

```typescript
className={twMerge(
  "fixed right-0 top-0 z-60 h-full ...",  // classes base
  className,                                 // classes do consumer
)}
```

Isso permite que quem usa o `<Modal>` passe classes extras sem conflito. Se o consumer passar `max-w-[800px]`, o `twMerge` remove o `max-w-[540px]` base automaticamente.

## Parallel Routes + Intercepting Routes

O contexto mais amplo e o padrao de Next.js:

- **Parallel Routes** (`@modal` slot no layout): renderiza UI simultanea
- **Intercepting Routes** (`(.)issues/[id]`): intercepta navegacao para mostrar no modal

Quando o usuario da F5 na pagina do modal, a intercepting route nao se aplica (e navegacao direta), entao a pagina completa e renderizada. Isso da o melhor dos dois mundos: modal para navegacao suave, pagina completa para acesso direto.

## ComponentProps para tipagem

O instrutor estende `ComponentProps<typeof Dialog.Content>` para que o modal aceite todas as props nativas do Radix Content. Isso inclui `onEscapeKeyDown`, `onPointerDownOutside`, etc., sem precisar declarar cada uma.