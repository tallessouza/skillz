# Code Examples: Leitores de Tela

## Exemplo 1: Header com logo e navegação

Código demonstrado na aula — header com imagem e link para GitHub.

```tsx
// Header acessível com alt na imagem e aria-label no link
<header>
  <img src="/logo.svg" alt="Blog da Rocketseat" />
  <nav>
    <a href="https://github.com/rocketseat" aria-label="GitHub">
      <GithubIcon />
    </a>
  </nav>
</header>
```

**O que o ChromeVox anuncia ao navegar com Tab:**
1. Foco na imagem → "Blog da Rocketseat, imagem"
2. Tab para o link → "GitHub, link, navegação" (menciona que é link E que está dentro de nav)

**Sem os atributos de acessibilidade:**
1. Foco na imagem → silêncio ou nome do arquivo
2. Tab para o link → "link" (sem saber o destino)

## Exemplo 2: Texto decorativo/simbólico (caso real Help Center)

Problema identificado no site Rocketseat Help Center durante desenvolvimento.

### Problema original

```html
<!-- O leitor soletra: "e-explorer", "r-rocketseat", "d-discover" -->
<div>e-explorer</div>
<div>r-rocketseat</div>
<div>d-discover</div>
```

Os prefixos "e-", "r-", "d-" são puramente visuais/decorativos. O leitor tenta ler tudo.

### Solução 1: aria-hidden nos prefixos

```html
<!-- Leitor lê apenas "explorer" -->
<div>
  <span aria-hidden="true">e-</span>
  explorer
</div>
```

### Solução 2: aria-label no container

```html
<!-- Leitor lê apenas "Explorer" (o aria-label sobrescreve tudo) -->
<div aria-label="Explorer">
  <span>e-</span>explorer
</div>
```

### Solução 3: aria-hidden no container inteiro (se puramente decorativo)

```html
<!-- Leitor ignora completamente este elemento -->
<div aria-hidden="true">
  e-explorer
</div>
```

Escolha depende: se o texto tem valor informativo (o usuário precisa saber que é "Explorer"), use solução 1 ou 2. Se é 100% decorativo, use solução 3.

## Exemplo 3: Padrões comuns em componentes React

### Botão com ícone

```tsx
// Sem texto visível — precisa de aria-label
<button aria-label="Fechar modal" onClick={onClose}>
  <XIcon aria-hidden="true" />
</button>

// Com texto visível — não precisa de aria-label
<button onClick={onSubmit}>
  <SendIcon aria-hidden="true" />
  Enviar
</button>
```

### Card com imagem decorativa

```tsx
<article>
  {/* Imagem decorativa de fundo — não agrega informação */}
  <img src="/pattern.svg" alt="" aria-hidden="true" />

  {/* Imagem informativa — descreve conteúdo */}
  <img src={post.cover} alt={post.title} />

  <h2>{post.title}</h2>
  <p>{post.excerpt}</p>
</article>
```

### Lista de redes sociais

```tsx
<nav aria-label="Redes sociais">
  <ul>
    <li>
      <a href="https://github.com/rocketseat" aria-label="GitHub">
        <GithubIcon aria-hidden="true" />
      </a>
    </li>
    <li>
      <a href="https://twitter.com/rocketseat" aria-label="Twitter">
        <TwitterIcon aria-hidden="true" />
      </a>
    </li>
  </ul>
</nav>
```

**ChromeVox anuncia:** "Redes sociais, navegação... GitHub, link... Twitter, link"

## Testando com ChromeVox

### Setup
1. Instalar extensão ChromeVox no Chrome
2. Ir em Extensões → ChromeVox → Opções → Voices → Selecionar "Português do Brasil"
3. Usar `Ctrl` para interromper fala
4. Usar `Shift+Alt+AA` para tentar desabilitar (pode não funcionar em todas as máquinas)
5. Navegar com `Tab` para mover foco entre elementos interativos

### O que observar
- O leitor anuncia o que você espera?
- Há leituras duplicadas/redundantes?
- Textos decorativos estão sendo lidos desnecessariamente?
- Links e botões anunciam seu propósito?
- A ordem de leitura faz sentido?