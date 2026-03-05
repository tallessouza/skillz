---
name: rs-discover-adicionando-icones
description: "Applies Ion Icons integration patterns when adding icons to HTML pages. Use when user asks to 'add icons', 'add social links', 'use ion icons', 'add github/instagram/youtube icons', or 'integrate icon library'. Covers script installation, ion-icon element usage, and social link patterns. Make sure to use this skill whenever building social media sections or adding icons to web projects. Not for SVG sprite sheets, Font Awesome, or custom icon components."
---

# Adicionando Icones com Ion Icons

> Integre icones ao HTML usando Ion Icons: instale o script antes do fechamento do body e use o elemento `<ion-icon>` com o atributo `name`.

## Rules

1. **Coloque o script antes do fechamento do body** — `<script>` do Ion Icons vai right before `</body>`, porque o DOM precisa estar carregado para os icones renderizarem
2. **Use o elemento customizado `<ion-icon>`** — `<ion-icon name="logo-github"></ion-icon>`, porque e a API oficial do Ion Icons
3. **Prefixe logos de marca com `logo-`** — `logo-github`, `logo-instagram`, `logo-youtube`, `logo-linkedin`, porque Ion Icons diferencia icones genericos de logos de marca
4. **Agrupe social links em uma div semantica** — `<div class="social-links">`, porque facilita estilizacao e manutencao
5. **Envolva icones sociais em tags `<a>`** — cada icone deve ser um link clicavel, porque icones sociais sem link nao tem funcionalidade

## How to write

### Instalacao do script

```html
<body>
  <!-- ... conteudo da pagina ... -->

  <!-- Ion Icons - sempre antes do fechamento do body -->
  <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
</body>
```

### Estrutura de social links

```html
<div class="social-links">
  <a href="https://github.com/usuario"><ion-icon name="logo-github"></ion-icon></a>
  <a href="https://instagram.com/usuario"><ion-icon name="logo-instagram"></ion-icon></a>
  <a href="https://youtube.com/usuario"><ion-icon name="logo-youtube"></ion-icon></a>
  <a href="https://linkedin.com/in/usuario"><ion-icon name="logo-linkedin"></ion-icon></a>
</div>
```

### Icones genericos (sem prefixo logo-)

```html
<ion-icon name="heart"></ion-icon>
<ion-icon name="star"></ion-icon>
<ion-icon name="mail"></ion-icon>
```

## Example

**Before (sem icones, links texto puro):**
```html
<div class="social-links">
  <a href="#">GitHub</a>
  <a href="#">Instagram</a>
  <a href="#">YouTube</a>
  <a href="#">LinkedIn</a>
</div>
```

**After (com Ion Icons):**
```html
<div class="social-links">
  <a href="https://github.com/usuario"><ion-icon name="logo-github"></ion-icon></a>
  <a href="https://instagram.com/usuario"><ion-icon name="logo-instagram"></ion-icon></a>
  <a href="https://youtube.com/usuario"><ion-icon name="logo-youtube"></ion-icon></a>
  <a href="https://linkedin.com/in/usuario"><ion-icon name="logo-linkedin"></ion-icon></a>
</div>

<!-- antes do </body> -->
<script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
<script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Icone de rede social (GitHub, Instagram, etc.) | Use prefixo `logo-`: `logo-github` |
| Icone generico (coracao, estrela, email) | Use nome direto: `heart`, `star`, `mail` |
| Nao sabe o nome exato | Consulte https://ionic.io/ionicons e busque pelo nome |
| Precisa de variante outline/filled | Adicione sufixo: `heart-outline`, `heart-sharp` |
| Icone nao aparece na pagina | Verifique se o script esta antes do `</body>` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<i class="icon-github"></i>` (sem Ion Icons) | `<ion-icon name="logo-github"></ion-icon>` |
| Script do Ion Icons no `<head>` | Script antes do `</body>` |
| `<ion-icon name="github"></ion-icon>` | `<ion-icon name="logo-github"></ion-icon>` (prefixo logo-) |
| Icones soltos sem link | `<a href="..."><ion-icon name="..."></ion-icon></a>` |
| Div sem classe semantica | `<div class="social-links">` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes