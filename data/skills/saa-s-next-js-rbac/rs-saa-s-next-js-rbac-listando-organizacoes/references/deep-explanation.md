# Deep Explanation: Listando Organizações

## Por que uma função HTTP separada?

O instrutor demonstra um padrão consistente: cada endpoint da API tem sua própria função em `src/http/`. Não existe um "api service" monolítico. `getOrganizations` é separada de `getProfile` porque são recursos distintos, com tipos de retorno distintos e ciclos de vida independentes.

## Server Components assíncronos — o padrão do Next.js App Router

O componente `OrganizationSwitcher` é transformado em `async function`. Isso é um padrão fundamental do App Router: componentes no servidor podem ser assíncronos e fazer `await` diretamente. Não há necessidade de `useEffect`, `useState`, ou loading states manuais para esse caso.

O instrutor simplesmente faz:
```tsx
const { organizations } = await getOrganizations()
```

Direto no corpo do componente. O Next.js cuida de suspense e streaming automaticamente.

## O padrão `asChild` do Radix UI

O `DropdownMenuItem` do Radix (usado pelo shadcn/ui) aceita a prop `asChild`. Isso faz com que o componente delegue a renderização ao filho direto, preservando toda a lógica de acessibilidade e interação do dropdown, mas usando o elemento filho como container.

Isso é essencial quando se quer que um item de dropdown seja um `<Link>` do Next.js — o link precisa ser o elemento real renderizado para que a navegação client-side funcione, mas o comportamento de dropdown (fechar ao clicar, navegação por teclado) precisa ser mantido.

## Navegação por slug

O instrutor usa `/org/${organization.slug}` como href. Isso é intencional para SaaS multi-tenant:
- Slugs são legíveis na URL (`/org/acme-admin` vs `/org/clk3j4h5k0001`)
- Facilitam compartilhamento de links
- São melhores para SEO
- O slug já vem do backend, preparado para uso em URLs

## Testando permissões com seed data

Um insight prático do instrutor: o seed do banco cria o mesmo usuário com roles diferentes em cada organização (admin, member, billing). Os nomes das organizações refletem a role (`acme-inc-admin`, `acme-member`, `acme-billing`), facilitando o teste visual de permissões no frontend sem precisar trocar de usuário.

## Tratamento de avatar nulo

O `avatarUrl` pode ser `null` — nem toda organização tem avatar. O instrutor faz uma verificação condicional simples antes de renderizar o componente de avatar. Não há fallback complexo ou placeholder; simplesmente não renderiza se não existir.