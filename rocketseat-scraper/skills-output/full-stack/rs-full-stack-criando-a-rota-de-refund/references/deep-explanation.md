# Deep Explanation: Criando Rotas Separadas por Contexto

## Por que separar rotas em arquivos por contexto?

O instrutor demonstra um padrão fundamental de organização de aplicações React: **separar rotas por papel/contexto do usuário**. A aplicação já tinha `auth-routes.tsx` para as telas de login e criação de conta. Agora, ao criar as rotas do funcionário (`employ-routes.tsx`), o padrão fica claro:

Cada "mundo" da aplicação tem seu próprio conjunto de rotas. Isso permite:

1. **Trocar o grupo inteiro** — Em vez de esconder/mostrar rotas individuais baseado em permissões, você simplesmente renderiza o grupo correto. É como trocar o cardápio inteiro de um restaurante dependendo se é almoço ou jantar, em vez de riscar itens individuais.

2. **Isolamento de contexto** — As rotas de auth não sabem que as rotas de employee existem, e vice-versa. Isso evita vazamento de navegação entre contextos.

3. **Catch-all por contexto** — Cada grupo tem seu próprio wildcard `*` apontando para NotFound. Se o usuário está no contexto de employee e tenta acessar `/admin`, cai no NotFound do employee, não num NotFound global genérico.

## A estratégia "manual primeiro, dinâmico depois"

O instrutor faz uma escolha deliberada: no `index.tsx`, ele comenta o `AuthRoutes` e coloca `EmployRoutes` manualmente. Ele explica que depois vai dinamizar baseado em:
- Se o usuário está logado ou não
- O perfil do usuário (employee, admin, etc.)

Essa abordagem tem mérito pedagógico e prático:

- **Foco na construção** — Ao trocar manualmente, você consegue construir e testar as interfaces do employee sem precisar implementar autenticação primeiro.
- **Validação incremental** — Cada grupo de rotas pode ser testado isoladamente antes de integrar com lógica de auth.
- **Complexidade controlada** — A lógica de "qual grupo renderizar" é um problema separado da construção das páginas.

## Padrão de página mínima

O instrutor cria o componente `Refund` com apenas um `h1`. Isso não é preguiça — é estratégia:

1. Cria a página com estrutura mínima
2. Configura a rota apontando para ela
3. Testa se a navegação funciona
4. Só então constrói a interface real

Esse padrão evita o problema comum de construir uma página inteira e só depois descobrir que a rota estava configurada errada.

## Estrutura do React Router

O uso de `Routes` e `Route` do React Router segue o padrão declarativo:

```tsx
<Routes>
  <Route path="/" element={<Componente />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

- `Routes` é o container que faz o matching
- `Route` com `path="/"` é a rota raiz do grupo
- `Route` com `path="*"` é o catch-all (qualquer URL não mapeada)

O `element` recebe JSX diretamente (não um componente como referência), padrão do React Router v6+.

## Próximos passos mencionados

O instrutor indica que:
- As rotas serão dinamizadas baseado no login
- O perfil do usuário determinará qual grupo é renderizado
- Mais páginas serão adicionadas ao grupo `employ-routes`