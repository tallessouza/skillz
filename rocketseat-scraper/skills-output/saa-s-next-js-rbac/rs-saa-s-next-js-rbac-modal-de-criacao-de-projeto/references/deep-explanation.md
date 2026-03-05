# Deep Explanation: Modal com Interceptacao de Rotas no Next.js

## Rota Paralela vs Rota Interceptada

O Diego explica a diferenca crucial entre dois conceitos do Next.js App Router:

### Rota Paralela (sem dot prefix)
Quando voce cria uma pasta dentro de um slot `@sheet` **sem** o prefixo de ponto, o Next.js trata como uma **rota paralela**. Isso significa que ele vai renderizar **ambos** os conteudos simultaneamente — o `children` e o conteudo do slot. O resultado e que voce ve a pagina E o modal ao mesmo tempo, o que geralmente nao e o comportamento desejado.

### Rota Interceptada (com dot prefix)
Quando voce coloca o `(.)` na frente do nome da pasta, o Next.js **intercepta a navegacao**. Isso significa que ele mantem o `children` anterior (a pagina onde o usuario estava) e mostra **somente** o conteudo do slot (o sheet/modal). O `(.)` indica "intercepte esta rota no mesmo nivel".

### A confusao do Diego (insight valioso)
O Diego esqueceu o dot prefix inicialmente e passou varios minutos debugando. Ele tentou:
1. Reiniciar o dev server
2. Limpar cache do navegador com Ctrl+Shift+F5
3. Deletar a pasta `.next`

Nada funcionou ate ele perceber que faltava o `(.)`. Isso ilustra como esse detalhe sutil e critico e facil de esquecer.

## Cache do Next.js com Rotas Interceptadas

O Diego destaca que o Next.js tem problemas conhecidos de cache com rotas interceptadas. Ao criar ou modificar a estrutura de pastas para interceptacao:

- O Next.js pode cachear a estrutura de rotas anterior
- Reiniciar o dev server nem sempre resolve
- A solucao mais confiavel e **deletar a pasta `.next`** e reiniciar
- Isso e "uma coisa bem comum e chatinha" segundo o Diego
- Ele mencionou que esperou para trazer esse conteudo justamente por essas instabilidades

## Replicacao de Estrutura

Para interceptar uma rota como `/org/[slug]/create-project`, voce precisa replicar **exatamente** a mesma hierarquia dentro do slot:

```
@sheet/(.)org/[slug]/create-project/page.tsx
```

Cada segmento da rota original precisa existir como pasta dentro do slot. Isso inclui segmentos dinamicos como `[slug]`.

## Invalidacao de Queries com React Query

Apos criar um recurso via modal, a lista na pagina nao atualiza automaticamente. O Diego mostra o padrao correto:

1. O `ProjectForm` e um client component com `useFormState`
2. O `useFormState` aceita um callback `onSuccess` como segundo parametro
3. No `onSuccess`, usa-se `queryClient.invalidateQueries()` passando a `queryKey` correspondente
4. Isso faz com que o React Query refaca o fetch da query que tem aquela key
5. A UI atualiza automaticamente sem necessidade de reload

O Diego pega o `slug` (renomeado como `org`) via `useParams` do `next/navigation` para compor a queryKey que identifica a lista de projetos daquela organizacao.