# Deep Explanation: Fetch de Produtos na Home

## Por que server components mudam tudo

O instrutor demonstra um ponto fundamental: ao desabilitar JavaScript no navegador, a pagina continua funcionando normalmente com todos os dados. Isso prova que a requisicao acontece no servidor antes da pagina chegar ao usuario.

Isso resolve problemas classicos do React SPA:
- **Indexacao (SEO):** crawlers recebem HTML completo com dados
- **Performance:** usuario nao espera loading states
- **Cascata de requisicoes:** dados ja estao no HTML inicial

## O problema do `new URL()` com base URL

O instrutor descobriu durante a aula que `new URL(path, base)` tem um comportamento importante: se a `base` ja tiver um path (como `/api`), o `new URL` **substitui** esse path pelo novo, nao concatena.

```javascript
// ERRADO — /api sera substituido
new URL('/products', 'http://localhost:3000/api')
// Resultado: http://localhost:3000/products (sem /api!)

// CORRETO — base URL limpa + prefixo separado
const apiPrefix = '/api'
new URL(apiPrefix.concat('/products'), 'http://localhost:3000')
// Resultado: http://localhost:3000/api/products
```

A solucao do instrutor foi:
1. Remover `/api` da base URL do ambiente
2. Criar uma constante `apiPrefix = '/api'`
3. Concatenar o prefixo com o path antes de passar ao `new URL`

## Tipagem como facilitador de DX

O instrutor criou o tipo `Product` dentro de `data/types/product.ts` — na mesma pasta onde ficam as funcoes de dados. Ao tipar o retorno da funcao como `Promise<Product[]>`, o TypeScript passa a oferecer autocomplete em toda a cadeia: `products[0].title`, `highlightedProduct.slug`, etc.

## Pattern de desestruturacao para layouts hero

```typescript
const [highlightedProduct, ...otherProducts] = await getFeaturedProducts()
```

Esse pattern e elegante porque:
- O primeiro item do array vira o produto em destaque (hero section)
- Os demais viram o grid secundario
- Se a API mudar a ordem, basta ajustar la — o frontend nao precisa de logica condicional

## Formatacao de precos sem centavos

O instrutor pesquisou ao vivo como remover centavos do `toLocaleString`. A solucao:

```typescript
price.toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})
```

Isso transforma `129.90` em `R$ 129` — mais limpo visualmente. O instrutor nota que e importante garantir que os precos na API estejam em valores inteiros (sem centavos) para consistencia.

## console.log em server components

Diferenca sutil mas importante: em server components, `console.log` aparece no terminal do servidor (onde `next dev` roda), nao no console do navegador. O instrutor usou isso para verificar que os dados estavam chegando corretamente antes de renderizar.