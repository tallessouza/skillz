# Deep Explanation: Aplicando SSG no Blog

## Por que getStaticProps para um blog?

O instrutor explica que um blog tem conteudo essencialmente estatico. Nao muda a cada request. Portanto, gerar o HTML uma unica vez no build e a estrategia mais eficiente. Ele menciona que `getServerSideProps` e ISR tambem funcionariam, mas `getStaticProps` e a escolha natural para este caso.

A logica: se o conteudo nao depende do request do usuario (sem cookies, sem query params dinamicos, sem dados em tempo real), SSG e a resposta correta.

## O fluxo de dados

1. `getStaticProps` executa no build time (ou no servidor durante `next dev`)
2. Retorna um objeto `{ props: { ... } }`
3. O Next.js injeta essas props como parametro do componente default export da pagina
4. O componente renderiza com os dados ja prontos — zero fetch client-side

## Tipagem com satisfies vs generics

O instrutor mostra duas formas de tipar:
- **Aula anterior:** tipagem via generics no `GetStaticProps<Type>`
- **Esta aula:** wrapping com parenteses e `satisfies` para inferencia

Ambas funcionam. A forma com generics (`GetStaticProps<BlogListProps>`) e mais explicita e comum na comunidade.

## Ordenacao server-side

O instrutor faz o sort dentro de `getStaticProps`:

```typescript
const sortedPosts = allPosts.sort((a, b) =>
  new Date(b.date).getTime() - new Date(a.date).getTime()
)
```

Isso e intencional: a ordenacao acontece uma vez no build, nao a cada renderizacao no browser. O resultado ja chega ordenado ao componente.

## Migracao: removendo fetch do componente

Antes, o componente `BlogList` importava `allPosts` diretamente e fazia o filtro. Agora, o componente apenas recebe `posts` via props. O instrutor mostra explicitamente:
1. Mover a logica de `allPosts` para `getStaticProps`
2. Criar um type `BlogListProps` com `posts: Post[]`
3. Passar `posts` do page para o `BlogList`
4. Remover o import de `allPosts` do componente

## Nome exato e obrigatorio

O instrutor enfatiza: "cuidado com o nome, tem que ser exatamente esse" — `getStaticProps`. O Next.js resolve por convencao, nao por configuracao. Nome errado = funcao ignorada silenciosamente.

## Proximos passos mencionados

O instrutor indica que a proxima aula cobrira o slug (rotas dinamicas), onde `getStaticPaths` sera necessario em conjunto com `getStaticProps`.