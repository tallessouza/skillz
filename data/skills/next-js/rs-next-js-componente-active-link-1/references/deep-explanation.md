# Deep Explanation: Componente ActiveLink

## Por que extrair o ActiveLink?

O instrutor identifica um "forte indicativo" de que um componente deve ser criado: **codigo duplicado**. No header original, cada link repete a mesma logica de verificacao de rota ativa com `useRouter` + comparacao de `asPath`. Essa duplicacao viola o principio de responsabilidade unica — o header nao deveria se preocupar com logica de deteccao de rota.

A frase-chave do instrutor: *"Eu concordo comigo que o header nao e muito responsabilidade dele fazer esse tipo de coisa."* Isso reflete o principio de separacao de concerns — o header orquestra a estrutura de navegacao, mas a logica de "estou ativo?" pertence ao link individual.

## Decisao de design: estender LinkProps

Ao criar `interface ActiveLinkProps extends LinkProps`, o componente herda todas as propriedades que o Link nativo do Next.js aceita. Isso significa:
- Nao precisa redefinir `href`, `replace`, `scroll`, `prefetch`, etc.
- O rest spread (`...rest`) passa tudo que nao foi desestruturado
- Compatibilidade futura: se Next.js adicionar props ao Link, o ActiveLink automaticamente as suporta

## Logica de deteccao: asPath vs pathname

O instrutor usa `router.asPath` (nao `router.pathname`). A diferenca:
- `asPath`: URL real no browser, incluindo query strings (`/blog?page=2`)
- `pathname`: template da rota (`/blog/[slug]`)

Para deteccao de link ativo na navegacao, `asPath` e mais confiavel porque reflete exatamente o que o usuario ve na barra de enderecos.

## Dupla comparacao: exata + startsWith

```typescript
router.asPath === String(href) || router.asPath.startsWith(String(href))
```

A igualdade exata cobre a rota raiz (`/`). O `startsWith` cobre subrotas (`/blog/post-1` ativa o link `/blog`). Atencao: para a rota `/`, usar apenas `startsWith` marcaria TODOS os links como ativos (toda rota comeca com `/`). Por isso a comparacao exata vem primeiro.

## Conversao de href para string

O `href` do Link pode ser `string | UrlObject`. Para comparar com `asPath` (que e string), o instrutor converte com `String(href)`. Alternativa: `href.toString()`. Ambas funcionam para o caso simples de strings, mas para `UrlObject` a conversao pode nao ser ideal — em projetos mais complexos, considere usar `url.format()` ou resolver a URL completa.

## Botao que vira Link

No final da aula, o instrutor transforma um `<button>` em um link funcional usando `asChild` (pattern de composicao do Radix/Shadcn) com um `<Link>` interno. A licao: se um elemento visual navega para outra pagina, ele DEVE ser um link semanticamente, nao um botao. Isso impacta acessibilidade e SEO.