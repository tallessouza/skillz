# Deep Explanation: Aplicando Filtro na Listagem

## Por que NAO usar o componente Image do Next.js para avatares

O instrutor discorda da regra do Biome/ESLint que obriga o uso de `<Image>` do Next.js. O raciocinio e economico e tecnico:

1. **Precificacao da Vercel:** Cada imagem otimizada pelo componente Image conta no plano. Ao exceder o limite, voce paga por imagem. Se voce tem 5.000 usuarios, sao 5.000 imagens de avatar sendo otimizadas — custo desnecessario.

2. **Imagens ja otimizadas:** Avatares do GitHub (e de outros providers como Gravatar) ja sao servidos no tamanho correto. Nao ha ganho em otimizar uma imagem que ja veio no tamanho certo.

3. **Quando usar Image:** Posts de blog, banners, hero images — locais onde TODOS os usuarios veem a MESMA imagem. O custo de otimizacao e diluido entre todos os acessos. Uma imagem otimizada servida 100.000 vezes = excelente custo-beneficio.

4. **Como suprimir a regra:** Adicione um comentario de suppress no Biome com explicacao:
```tsx
// biome-ignore: GitHub already optimizes the image
<img src={user.avatarUrl} alt={user.name} />
```

## Por que usar o construtor URL em vez de template literals

O instrutor mostra que a assinatura do `fetch` aceita nao apenas `string`, mas tambem `URL` (construtor global do JavaScript). Vantagens:

- **Organizacao:** Conforme parametros crescem, template literals ficam "muito bagunçado"
- **Seguranca:** `searchParams.set()` faz encoding automatico de caracteres especiais
- **Condicionalidade limpa:** Voce so adiciona o param se ele existir, sem ternarios inline na string

## shallow: false — O conceito mais critico da aula

**O problema:** Por default, `useQueryState` (da lib nuqs) opera em modo `shallow: true`. Isso significa que quando o usuario digita no campo de busca e a URL muda (ex: `?q=offline`), a atualizacao acontece SOMENTE no client-side. O servidor nao recebe uma nova requisicao.

**Por que isso quebra:** Em Next.js com server components, o fetch acontece NO SERVIDOR. Se a URL muda apenas no client, o servidor nunca re-executa o fetch com os novos parametros. O resultado: o usuario digita, a URL muda, mas a lista nao atualiza.

**A solucao:** `shallow: false` faz com que cada mudanca na URL dispare uma nova requisicao ao servidor — como se fosse um novo carregamento de pagina. Isso e exatamente o que server components precisam.

**Analogia do instrutor:** "E como uma nova requisicao, como se fosse um novo recarregamento de pagina."

## O padrao completo de busca em server components

```
[SearchInput] → useQueryState (shallow:false) → URL muda
       → Server recebe nova requisicao
       → Page component le searchParams
       → Passa para ListComponent como prop
       → ListComponent faz fetch com params
       → Resultado renderizado no servidor
```

## Empty states — Por que importam

O instrutor percebeu que ao filtrar e nao encontrar resultados, as colunas do board ficavam completamente vazias sem feedback. O padrao correto e verificar `.length === 0` antes do `.map()` e mostrar uma mensagem como "No issues matching your filters".

O instrutor aplicou o mesmo padrao para todas as colunas (backlog, todo, in-progress, done), mostrando que empty states devem ser consistentes em toda a interface.