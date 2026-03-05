# Deep Explanation: Estrutura de Layout no Next.js App Router

## Por que route groups com parenteses?

O instrutor explica que o `layout.tsx` na raiz do `app/` aplica a **todas** as paginas da aplicacao. Mesmo que agora todas as paginas compartilhem a mesma estrutura (header + conteudo), isso pode mudar. O exemplo classico: uma pagina de login nao deveria ter o header de busca de produtos.

A solucao e usar **route groups** — pastas com parenteses como `(store)` — que agrupam rotas logicamente sem adicionar segmentos na URL. Isso permite ter layouts diferentes por grupo de rotas.

## O problema do loading.tsx compartilhado

O instrutor demonstra um problema sutil: quando voce cria um `loading.tsx` em uma pasta, ele nao afeta apenas a `page.tsx` mais proxima — ele afeta **todas as subrotas** daquela pasta.

Exemplo pratico: se `loading.tsx` esta em `(store)/` e voce tem `(store)/page.tsx` (home) e `(store)/search/page.tsx`, o mesmo loading aparece para ambas. Isso e problematico quando cada pagina precisa de skeleton screens diferentes.

### Solucao: sub-route-groups

Crie `(home)/` dentro de `(store)/` para isolar a home page com seu proprio loading:

```
(store)/
├── (home)/
│   ├── page.tsx      # localhost:3000 (parenteses nao afetam URL)
│   └── loading.tsx   # So para home
└── search/
    ├── page.tsx      # localhost:3000/search
    └── loading.tsx   # So para search
```

Como ambos `(store)` e `(home)` usam parenteses, a URL continua sendo simplesmente `/` para a home.

## Padrao de casing

O instrutor menciona que migrou de PascalCase para lowercase nos nomes de arquivos de componentes (`header.tsx` em vez de `Header.tsx`). A razao: como todos os arquivos especiais do App Router (`page.tsx`, `layout.tsx`, `loading.tsx`) usam lowercase, manter o mesmo padrao em componentes traz consistencia.

O ponto importante: **nao importa qual padrao voce escolhe, desde que seja consistente dentro do projeto**. Dois projetos podem ter padroes diferentes, mas um projeto nao pode ter dois padroes.

## Layout: o componente mais simples possivel

Um layout no Next.js App Router e literalmente um componente que:
1. Recebe `children` como prop (tipado como `ReactNode`)
2. Retorna `children` envolto na estrutura desejada
3. E exportado como default

Nao ha magica — e so um wrapper component.