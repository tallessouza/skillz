# Code Examples: Textos Alternativos

## Exemplo 1: Logo com alt descritivo

**Contexto:** Pagina de blog com logo da Skillz no header.

```html
<!-- ANTES: sem alt — erro critico -->
<img src="/logo.svg" />

<!-- DEPOIS: alt descreve a marca -->
<img src="/logo.svg" alt="Skillz Blog" />
```

**Por que "Skillz Blog" e nao "foguete roxo":** a imagem e uma logo. Logos representam marcas, nao objetos visuais.

## Exemplo 2: SVG de icone social dentro de link

**Contexto:** Link para GitHub no header, usando SVG inline.

### Abordagem 1: aria-label no link (recomendada pelo instrutor)
```html
<a href="https://github.com/skillz" aria-label="GitHub">
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12..." />
  </svg>
</a>
```

### Abordagem 2: title dentro do SVG
```html
<a href="https://github.com/skillz">
  <svg width="24" height="24" viewBox="0 0 24 24">
    <title>GitHub</title>
    <path d="M12 0C5.37 0 0 5.37 0 12..." />
  </svg>
</a>
```

### Abordagem 3: aria-hidden + texto visivel
```html
<a href="https://github.com/skillz">
  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12..." />
  </svg>
  GitHub
</a>
```
**Desvantagem:** texto "GitHub" aparece visivelmente na pagina.

### Abordagem 4: SVG como arquivo importado
```tsx
import GitHubImage from './GitHub.svg'

<a href="https://github.com/skillz">
  <img src={GitHubImage} alt="GitHub" />
</a>
```
**Desvantagem:** pode perder estilizacao CSS (cor via fill).

## Exemplo 3: Redundancia entre alt e texto visivel

**Contexto:** Link com icone + texto, ambos dizendo "GitHub".

```html
<!-- ERRADO: redundancia — leitor dira "GitHub GitHub" -->
<a href="/github">
  <img src="/github.svg" alt="GitHub" />
  GitHub
</a>

<!-- CORRETO: alt vazio, texto visivel e suficiente -->
<a href="/github">
  <img src="/github.svg" alt="" />
  GitHub
</a>
```

O axe DevTools detecta esse erro: "textos alternativos de imagem nao devem ser repetidos como texto".

## Exemplo 4: Escondendo imagem com aria-hidden (alternativa)

```html
<a href="/github">
  <img src="/github.svg" alt="GitHub" aria-hidden="true" />
  GitHub
</a>
```
Funciona, mas e redundante — se voce tem aria-hidden na imagem E texto visivel, melhor usar `alt=""` na imagem diretamente.

## Exemplo 5: Alt vazio vs alt ausente

```html
<!-- ERRO CRITICO: alt ausente -->
<img src="/decorative.svg" />

<!-- CORRETO: alt vazio = leitor ignora intencionalmente -->
<img src="/decorative.svg" alt="" />
```

Remover o atributo e erro. Deixar vazio e decisao intencional de acessibilidade.

## Padrao para diferentes tipos de imagem

```tsx
// Logo
<img src="/brand-logo.svg" alt="Nome da Empresa" />

// Foto de conteudo
<img src="/team-photo.jpg" alt="Equipe Skillz no escritorio" />

// Icone decorativo ao lado de texto
<button>
  <img src="/search-icon.svg" alt="" />
  Buscar
</button>

// Avatar em lista de usuarios
<img src={user.avatar} alt={user.name} />

// Imagem de fundo / decorativa
<img src="/hero-pattern.svg" alt="" />
```