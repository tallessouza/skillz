# Code Examples: Estruturando Paginas com HTML Semantico

## Setup inicial — importacoes

```tsx
// page.tsx (Next.js)
import Image from 'next/future/image' // ou 'next/image' em versoes mais recentes
import logoImg from '../assets/logo.svg'
import styles from '../styles/home.module.css'
```

## Versao NAO acessivel (como o instrutor construiu)

```tsx
export default function Home() {
  return (
    <div>
      {/* ERRO: div no lugar de header */}
      <div className={styles.header}>
        {/* ERRO: sem alt text */}
        <Image src={logoImg} width={143} />

        {/* ERRO: div no lugar de nav */}
        <div className={styles.nav}>
          {/* ERRO: link com apenas SVG, sem label acessivel */}
          <a href="https://github.com/josepholiveira">
            <svg>{/* conteudo do SVG do GitHub */}</svg>
          </a>
        </div>
      </div>

      {/* ERRO: div no lugar de main */}
      <div className={styles.content}>
        {/* ERRO: comeca com h2, deveria ser h1 */}
        <h2>Desenvolvendo uma web acessível</h2>

        {/* ERRO: pula de h2 para h4 */}
        <h4>Protocolos e diretrizes orientam o desenvolvimento de
        páginas web...</h4>

        <p>Primeiro paragrafo de conteudo...</p>
        <p>Segundo paragrafo de conteudo...</p>

        {/* ERRO: h3 depois de h4 quebra hierarquia */}
        <h3>O que é acessibilidade afinal</h3>
      </div>
    </div>
  )
}
```

## CSS Modules — estilizacao do layout

```css
/* styles/home.module.css */

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1064px; /* 1024 + 40px de padding horizontal */
  width: 100%;
  margin: 0 auto;
  padding: 24px 20px;
}

.nav a {
  color: #8257E5; /* cor primaria Rocketseat */
}

.content {
  color: #737380; /* cinza legivel */
  max-width: 776px; /* 736 + 40px de padding horizontal */
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
}

.content h2 {
  margin-bottom: 20px;
}

.content p {
  margin: 20px 0;
}
```

## Versao CORRIGIDA (como deveria ser)

```tsx
export default function Home() {
  return (
    <>
      <header className={styles.header}>
        <Image
          src={logoImg}
          alt="Logo Rocketseat"
          width={143}
          height={39}
        />
        <nav className={styles.nav}>
          <a
            href="https://github.com/josepholiveira"
            aria-label="Perfil de Joseph Oliveira no GitHub"
          >
            <svg>{/* conteudo do SVG do GitHub */}</svg>
          </a>
        </nav>
      </header>

      <main className={styles.content}>
        <h1>Desenvolvendo uma web acessível</h1>
        <h2>Protocolos e diretrizes orientam o desenvolvimento</h2>
        <p>Primeiro paragrafo...</p>
        <p>Segundo paragrafo...</p>
        <h2>O que é acessibilidade afinal</h2>
      </main>
    </>
  )
}
```

## Tecnica: compensar padding no max-width

```css
/* Se voce quer que o conteudo visivel tenha 1024px
   e precisa de 20px de padding em cada lado: */
.container {
  max-width: 1064px; /* 1024 + (20 * 2) */
  width: 100%;
  padding: 0 20px;
  margin: 0 auto;
}

/* Assim, em telas menores que 1064px,
   o padding lateral fica visivel e o conteudo nao gruda na borda */
```

## Tecnica: redimensionar Image proporcional

```tsx
{/* Tamanho original: 286 x 78 */}
{/* Dividir por 2 para reduzir: */}
<Image src={logoImg} width={143} height={39} alt="Logo" />
{/* Next.js calcula a altura proporcional automaticamente
    se voce passar apenas width, mas e recomendado passar ambos */}
```