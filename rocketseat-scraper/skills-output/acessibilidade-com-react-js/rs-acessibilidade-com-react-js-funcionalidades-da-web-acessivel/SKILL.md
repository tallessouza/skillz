---
name: rs-acessibilidade-react-funcionalidades-web
description: "Enforces web accessibility best practices when writing HTML, React components, or inspecting existing sites. Use when user asks to 'add alt text', 'check contrast', 'make accessible', 'add aria attributes', 'create an image component', or 'review accessibility'. Applies rules: lang attribute on HTML, meaningful alt text without redundancy, aria-hidden for decorative elements, AA contrast minimum. Make sure to use this skill whenever generating markup with images, icons, or multilingual content. Not for ARIA widget patterns, focus management, or keyboard navigation."
---

# Funcionalidades da Web Acessivel

> Toda markup gerada deve contemplar lang, alt text semantico, contraste AA e aria-hidden em elementos decorativos.

## Rules

1. **Defina `lang` no HTML** — `<html lang="pt-BR">`, porque leitores de tela usam isso para selecionar a voz e pronuncia correta
2. **Alt text descreve o CONTEUDO, nao o formato** — `alt="W3C"` nao `alt="logo W3C"` nem `alt="imagem de W3C"`, porque o leitor de tela ja anuncia que e uma imagem
3. **Nunca seja redundante no alt** — se o nome da marca ja aparece como texto visivel proximo, nao repita no alt, porque redundancia polui a experiencia do usuario de leitor de tela
4. **Imagens decorativas recebem `aria-hidden="true"`** — icones ilustrativos que nao adicionam semantica devem ser ocultos de tecnologias assistivas, porque anunciar decoracao e ruido
5. **Imagens de conteudo desconhecido: alt vazio ou IA** — quando voce nao controla o conteudo da imagem (upload de usuario), use `alt=""` para ignorar ou gere alt via IA, porque colocar o nome do usuario como alt de uma foto que pode ser qualquer coisa nao e semantico
6. **Contraste minimo AA (4.5:1 texto, 3:1 texto grande)** — verifique com DevTools do Chrome (inspect > acessibilidade), porque contraste insuficiente exclui usuarios com baixa visao

## How to write

### HTML com lang

```html
<html lang="pt-BR">
  <!-- conteudo em portugues -->
</html>
```

### Alt text em logos

```tsx
// Descreva o que a logo REPRESENTA, nao o que ela E
<img src="/logo.svg" alt="Rocketseat" />
// NUNCA: alt="logo da Rocketseat" ou alt="imagem foguete Rocketseat"
```

### Icones decorativos

```tsx
// Icone puramente ilustrativo — ocultar de assistivas
<svg aria-hidden="true" focusable="false">
  <use href="#icon-decorative" />
</svg>
```

### Imagem com conteudo desconhecido (upload de usuario)

```tsx
// Opcao 1: alt vazio (ignorado por leitores de tela)
<img src={user.avatarUrl} alt="" />

// Opcao 2: alt gerado por IA (como o Facebook faz)
<img src={user.avatarUrl} alt={user.avatarAiDescription ?? ""} />
// Exemplo de output IA: "pode ser uma imagem de uma pessoa"
```

## Example

**Before (sem acessibilidade):**
```tsx
<html>
  <body>
    <img src="/logo.svg" />
    <img src={post.image} alt={post.authorName} />
    <svg><use href="#star" /></svg>
    <p style={{ color: '#ccc', backgroundColor: '#fff' }}>Texto claro</p>
  </body>
</html>
```

**After (com esta skill aplicada):**
```tsx
<html lang="pt-BR">
  <body>
    <img src="/logo.svg" alt="Rocketseat" />
    <img src={post.image} alt={post.imageAiDescription ?? ""} />
    <svg aria-hidden="true" focusable="false"><use href="#star" /></svg>
    <p style={{ color: '#595959', backgroundColor: '#fff' }}>Texto legivel</p>
  </body>
</html>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Logo com nome da marca | `alt="NomeDaMarca"` sem prefixo "logo" |
| Icone ao lado de texto que ja descreve a acao | `aria-hidden="true"` no icone |
| Imagem de upload do usuario | `alt=""` ou alt gerado por IA |
| Imagem editorial com conteudo conhecido | Alt descritivo do conteudo |
| Texto sobre fundo colorido | Verifique contraste >= 4.5:1 (AA) |
| SVG inline decorativo | `aria-hidden="true"` + `focusable="false"` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `<html>` (sem lang) | `<html lang="pt-BR">` |
| `alt="logo da Empresa"` | `alt="Empresa"` |
| `alt="imagem de perfil"` em foto de usuario | `alt=""` ou alt por IA |
| `alt={user.name}` em avatar | `alt=""` (conteudo desconhecido) |
| Icone decorativo sem aria-hidden | `aria-hidden="true" focusable="false"` |
| Contraste 2:1 em texto | Minimo 4.5:1 (AA) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
