# Code Examples: Estrutura HTML para Acessibilidade

## Exemplo 1: Adicionando titulo da pagina no Next.js

```tsx
// pages/index.tsx
import Head from 'next/head'  // CORRETO: next/head
// import Head from 'next/document'  // ERRADO: next/document so no _document

export default function Home() {
  const postTitle = 'Desenvolvendo uma web acessível'

  return (
    <>
      <Head>
        <title>{postTitle} | Rocketseat Blog</title>
      </Head>
      <main>
        <h1>{postTitle}</h1>
        {/* resto do conteudo */}
      </main>
    </>
  )
}
```

**Resultado:** A aba do navegador mostra "Desenvolvendo uma web acessível | Rocketseat Blog" e o erro de acessibilidade sobre titulo ausente desaparece.

## Exemplo 2: Configurando atributo lang

```tsx
// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-br">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

**Resultado:** O erro "html element does not have a lang attribute" desaparece. Navegadores em outros idiomas oferecem traducao.

## Exemplo 3: Corrigindo hierarquia de headings

### Antes (com erros):

```tsx
<h2>Desenvolvendo uma web acessível</h2>
<h4>O que é acessibilidade</h4>
{/* ERRO: pulou de H2 para H4 */}
```

### Depois (corrigido):

```tsx
<h1>Desenvolvendo uma web acessível</h1>
<h2>O que é acessibilidade</h2>
{/* H1 → H2: incrementa por um, correto */}
```

## Exemplo 4: Usando CSS para ajustar tamanho sem quebrar semantica

### Antes (semantica errada para efeito visual):

```tsx
<h1>Titulo principal</h1>
<h4>Subtitulo</h4>  {/* Usou H4 so porque queria texto menor */}
```

### Depois (semantica correta com CSS):

```tsx
// styles.ts ou CSS module
const styles = {
  h1: { fontSize: '24px' },
  h2: { fontSize: '18px' },  // Menor que o H2 padrao, mas semanticamente correto
}

// componente
<h1 style={{ fontSize: '1.5rem' }}>Titulo principal</h1>
<h2 style={{ fontSize: '1.125rem' }}>Subtitulo</h2>
```

## Exemplo 5: Hierarquia valida com retorno de niveis

```tsx
<h1>Blog Post: Web Acessível</h1>

<h2>O que é acessibilidade</h2>
<h3>Benefícios para o usuário</h3>
<h3>Benefícios para o negócio</h3>

<h2>Como implementar</h2>      {/* Voltou para H2 — valido */}
<h3>Ferramentas de teste</h3>
<h3>Boas práticas</h3>

<h2>Conclusão</h2>               {/* Outro H2 — valido */}
```

## Exemplo 6: O que NAO fazer — multiplos H1 sem sentido

```tsx
{/* RUIM: "fluda" a pagina de H1 */}
<h1>Blog</h1>
<h1>Post sobre acessibilidade</h1>
<h1>Sidebar</h1>
<h1>Footer</h1>

{/* BOM: um H1, hierarquia clara */}
<h1>Post sobre acessibilidade</h1>
<h2>Conteúdo do post</h2>
<h2>Posts relacionados</h2>  {/* sidebar/aside */}
```