# Code Examples: HTML Landmarks

## Exemplo 1: Corrigindo pagina sem landmarks

### Estado inicial (problematico)
```tsx
// App.tsx - tudo em divs, zero landmarks
<div>
  <div className="header">
    <a href="/">GitHub Explorer</a>
  </div>
  <div className="content">
    <h2>{repo.fullName}</h2>
    <p>{repo.description}</p>
  </div>
</div>
```

Erros reportados pelo axe-core:
1. "Document must have a landmark main"
2. "All page content must be contained by landmarks"

### Passo 1: Remover div wrapper desnecessaria

```tsx
// Trocar div wrapper por fragment
<>
  <div className="header">...</div>
  <div className="content">...</div>
</>
```

### Passo 2: Adicionar header como landmark

```tsx
<>
  <header>
    <a href="/">GitHub Explorer</a>
  </header>
  <div className="content">...</div>
</>
```

Resultado: landmark "banner" aparece na extensao, mas conteudo ainda esta fora de landmarks.

### Passo 3: Adicionar main

```tsx
<>
  <header>
    <a href="/">GitHub Explorer</a>
  </header>
  <main>
    <h2>{repo.fullName}</h2>
    <p>{repo.description}</p>
  </main>
</>
```

Resultado: todos os erros de landmarks resolvidos.

## Exemplo 2: Navegacao com nav

```tsx
<header>
  <nav>
    <a href="/">Home</a>
    <a href="/about">Sobre</a>
  </nav>
</header>
```

Na extensao de landmarks: Banner > Navigation (aninhada dentro do banner).

## Exemplo 3: Navegacao duplicada — problema e solucao

### Problema: duas nav sem diferenciacao
```tsx
<>
  <header>
    <nav>
      <a href="/">Home</a>
    </nav>
  </header>
  <main>...</main>
  <footer>
    <nav>
      <a href="/termos">Termos</a>
    </nav>
  </footer>
</>
```

Erro axe-core: "Ensure landmarks are unique" — duas "navigation" identicas.

### Solucao: aria-label na navegacao secundaria
```tsx
<footer>
  <nav aria-label="rodapé">
    <a href="/termos">Termos</a>
  </nav>
</footer>
```

Resultado: Navigation e Navigation "rodapé" — distinguiveis por tecnologias assistivas.

## Exemplo 4: Role vs Elemento — demonstracao do comportamento

### Role NAO adiciona comportamento
```tsx
// Isso NAO funciona como form
<div role="form" onSubmit={() => console.log('form')}>
  <button type="submit">Submit</button>
</div>
// Clicar no botao nao dispara onSubmit
```

### Elemento adiciona significado E comportamento
```tsx
// Isso funciona corretamente
<form onSubmit={(e) => { e.preventDefault(); console.log('form'); }}>
  <button type="submit">Submit</button>
</form>
// Clicar no botao dispara onSubmit
```

## Exemplo 5: Article com header semantico

```tsx
<main>
  <article>
    {/* Este header NAO e landmark banner */}
    {/* E apenas o cabecalho semantico do artigo */}
    <header>
      <h2>Titulo do Post</h2>
      <h4>Subtitulo explicativo</h4>
    </header>
    <p>Conteudo do artigo...</p>
  </article>
</main>
```

### Anti-pattern: adicionar role banner no header do article
```tsx
// ERRADO — nao faca isso
<article>
  <header role="banner">
    <h2>Titulo</h2>
  </header>
</article>
```

O header de um article nao e banner. E apenas cabecalho daquele conteudo especifico.

## Exemplo 6: Estrutura completa de pagina com landmarks

```tsx
export function App() {
  return (
    <>
      <header>
        <nav>
          <a href="/">GitHub Explorer</a>
          <a href="/about">Sobre</a>
        </nav>
      </header>

      <main>
        <article>
          <header>
            <h2>{repo.fullName}</h2>
            <h4>{repo.description}</h4>
          </header>
          <p>{repo.readme}</p>
        </article>
      </main>

      <footer>
        <nav aria-label="rodapé">
          <a href="/termos">Termos de uso</a>
          <a href="/privacidade">Privacidade</a>
        </nav>
      </footer>
    </>
  )
}
```

Landmarks resultantes:
1. Banner (header)
2. Navigation (nav principal)
3. Main (conteudo)
4. Content Info (footer)
5. Navigation "rodapé" (nav secundaria)