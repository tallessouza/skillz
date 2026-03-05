# Deep Explanation: SEO em Paginas de Listagem (Next.js)

## Como funciona a heranca de metadata no Next.js

O Next.js implementa um sistema de merge de metadata ao longo da arvore de componentes. O `layout.tsx` na raiz define os valores padrao. Qualquer `page.tsx` que exporte `metadata` sobrescreve os campos que definir, mantendo os demais do layout.

### Hierarquia de resolucao

```
app/layout.tsx        → metadata base (title: "Meu Site", description: "...")
  app/blog/layout.tsx → pode adicionar/sobrescrever (opcional)
    app/blog/page.tsx → metadata final para /blog (title: "Blog", description: "...")
```

O instrutor destaca que isso e uma funcionalidade nativa do Next.js — nao precisa de bibliotecas externas como `next-seo`. Basta exportar a const tipada.

## Estrategia estatica vs dinamica

O instrutor faz uma escolha deliberada: a pagina de listagem usa metadata **estatica** (`export const metadata`), porque o conteudo da pagina nao muda por request. Ja para paginas de post individual (slug), ele antecipa o uso de `generateMetadata()` — uma funcao assincrona que recebe params e pode buscar dados do post para montar titulo, description e imagem OG dinamicamente.

### Quando usar cada abordagem

- **Estatica:** paginas de listagem, landing pages, paginas institucionais — o conteudo SEO e previsivel
- **Dinamica (`generateMetadata`):** paginas de detalhe, perfis de usuario, qualquer rota onde o conteudo varia por parametro

## Por que o layout e importante para SEO

O instrutor enfatiza: "imagina uma pagina que nao tenha as metatags definidas especificas para ela — entao ela vai herdar do layout." Isso cria uma rede de seguranca: nenhuma pagina fica sem titulo ou description, mesmo que o desenvolvedor esqueca de definir.

## Open Graph e compartilhamento

O instrutor testa o compartilhamento apos deploy e valida que:
- O titulo aparece diferente do site principal ("Blog" em vez de "Meu Site")
- A description e especifica da pagina
- A imagem OG aparece corretamente (mesmo sendo a mesma do site neste caso)

Ele destaca que isso permite "compartilhar bem melhor agora a nossa listagem de posts" — o objetivo pratico de SEO nao e apenas ranking no Google, mas tambem como o link aparece quando compartilhado em redes sociais.

## Fluxo de trabalho do instrutor

1. Copia a estrutura de metadata de uma pagina existente (landing page)
2. Ajusta titulo, description e OG para o contexto da listagem
3. Adiciona metadata no layout como fallback
4. Commita e faz deploy na Vercel
5. Testa abrindo a pagina e verificando as metatags no preview de compartilhamento

Nota: o instrutor comita direto na main e alerta explicitamente "nao facam isso — criem um branch a parte."