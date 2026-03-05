# Code Examples: Funcionalidades da Web Acessivel

## 1. Atributo lang no HTML

```html
<!-- Site da WAI: lang configurado no HTML -->
<html lang="en">
  <head>...</head>
  <body>...</body>
</html>

<!-- Para sites em portugues -->
<html lang="pt-BR">
  <head>...</head>
  <body>...</body>
</html>
```

**Variacao: conteudo misto**
```html
<html lang="pt-BR">
  <body>
    <p>Texto em portugues</p>
    <blockquote lang="en">Quote in English</blockquote>
  </body>
</html>
```

## 2. Alt text em SVG (observado no site da WAI)

```html
<!-- Logo W3C como SVG com aria-label -->
<svg role="img" aria-label="W3C">
  <use href="#w3c-logo" />
</svg>
```

**Variacao em React com componente de logo:**
```tsx
function Logo() {
  return (
    <a href="/">
      <img src="/logo.svg" alt="Skillz" />
    </a>
  )
}

// ERRADO — redundancia
function LogoRedundante() {
  return (
    <a href="/" aria-label="Skillz">
      <img src="/logo.svg" alt="Logo Skillz" /> {/* redundante com o aria-label */}
    </a>
  )
}
```

## 3. Icones decorativos com aria-hidden

```tsx
// Observado no site da WAI: icone ilustrativo
<svg aria-hidden="true" focusable="false" className="icon">
  <use href="#decorative-icon" />
</svg>

// Em React com biblioteca de icones
import { Star } from 'lucide-react'

// Icone decorativo ao lado de texto
function Rating({ score }: { score: number }) {
  return (
    <div>
      <Star aria-hidden="true" />
      <span>{score} estrelas</span>
    </div>
  )
}

// Icone como UNICO indicador (precisa de alt)
function FavoriteButton() {
  return (
    <button aria-label="Adicionar aos favoritos">
      <Star aria-hidden="true" />
    </button>
  )
}
```

## 4. Imagens com conteudo desconhecido (padrao Facebook/Meta)

```tsx
// Abordagem 1: alt vazio (imagem ignorada por assistivas)
function UserAvatar({ user }: { user: User }) {
  return (
    <div>
      <img src={user.avatarUrl} alt="" />
      <span>{user.name}</span> {/* nome ja presente como texto */}
    </div>
  )
}

// Abordagem 2: alt gerado por IA (como Facebook faz)
function PostImage({ post }: { post: Post }) {
  return (
    <img
      src={post.imageUrl}
      alt={post.imageAiDescription ?? ""}
      // Exemplos de output IA:
      // "pode ser uma imagem de uma pessoa"
      // "pode ser uma imagem de uma ou mais pessoas e texto que diz STU"
    />
  )
}

// Abordagem 3: aria-label no container + alt IA na imagem
function ProfileCard({ user }: { user: User }) {
  return (
    <div aria-label={user.name}>
      <img
        src={user.avatarUrl}
        alt={user.avatarAiDescription ?? ""}
      />
      <h2>{user.name}</h2>
    </div>
  )
}
```

## 5. Verificacao de contraste no Chrome DevTools

```
Passo a passo (demonstrado pelo instrutor):

1. Clique direito no elemento de texto → "Inspecionar"
2. No painel Elements, o Chrome mostra info de acessibilidade
3. Passe o mouse sobre o elemento na pagina
4. No tooltip que aparece, verifique:
   - Ratio de contraste (ex: 7.13)
   - Checkmark de nivel AA
   - Secao "Accessibility"

Niveis WCAG:
- AA: 4.5:1 para texto normal, 3:1 para texto grande (>=18pt ou >=14pt bold)
- AAA: 7:1 para texto normal, 4.5:1 para texto grande

Limitacao: nao funciona bem com elementos que possuem multiplas cores
(gradientes, imagens de fundo). Teste elemento por elemento.
```

## 6. Componente React completo aplicando todas as regras

```tsx
// Componente que aplica TODAS as regras desta skill
function BlogPost({ post }: { post: BlogPost }) {
  return (
    <article>
      {/* Imagem editorial com alt descritivo */}
      <img
        src={post.coverUrl}
        alt={post.coverDescription}
      />

      <h2>{post.title}</h2>

      {/* Avatar do autor: alt vazio, nome ja em texto */}
      <div className="author">
        <img src={post.author.avatarUrl} alt="" />
        <span>{post.author.name}</span>
      </div>

      {/* Icone decorativo: aria-hidden */}
      <div className="reading-time">
        <ClockIcon aria-hidden="true" focusable="false" />
        <span>{post.readingTimeMinutes} min de leitura</span>
      </div>

      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}
```