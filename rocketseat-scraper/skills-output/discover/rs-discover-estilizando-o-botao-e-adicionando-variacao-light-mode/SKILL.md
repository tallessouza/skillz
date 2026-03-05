---
name: rs-discover-estilizando-botao-light-mode
description: "Applies CSS button styling patterns for theme toggle switches when building light/dark mode features. Use when user asks to 'create a theme toggle', 'style a button', 'add dark mode switch', 'implement light mode', or 'swap icons with CSS variables'. Enforces circular button technique, background-image positioning, and CSS custom properties for icon swapping. Make sure to use this skill whenever styling toggle buttons or implementing theme switching UI. Not for JavaScript toggle logic, color theme variables, or full dark mode system architecture."
---

# Estilizando Botao de Toggle com Variacao Light/Dark Mode

> Botoes de toggle de tema usam dimensoes fixas, border-radius 50% para formato circular, e CSS custom properties para trocar icones sem alterar o CSS do botao.

## Rules

1. **Use dimensoes fixas iguais para botao circular** — `width: 32px; height: 32px` com `border-radius: 50%`, porque 50% em um quadrado perfeito gera um circulo
2. **Icone via background-image, nao img tag** — o icone e decorativo, nao conteudo semantico, entao pertence ao CSS
3. **Sempre combine no-repeat e center** — `background: url(...) no-repeat center` evita repeticao do SVG e centraliza automaticamente
4. **Remova borda padrao** — `border: 0` remove a borda nativa do elemento button
5. **Use CSS custom property para trocar icone** — defina `--switch-bg-url` no `:root` e troque no seletor de tema, porque permite mudar o icone sem tocar no CSS do botao
6. **Organize CSS por secoes com comentarios** — separe blocos logicos (profile, switch, social-links) para navegabilidade

## How to write

### Botao circular com icone de fundo

```css
.switch button {
  width: 32px;
  height: 32px;
  background: white var(--switch-bg-url) no-repeat center;
  border: 0;
  border-radius: 50%;
}
```

### Variaveis para troca de icone

```css
:root {
  --switch-bg-url: url('./assets/moon-stars.svg');
}

.light {
  --switch-bg-url: url('./assets/sun.svg');
}
```

## Example

**Before (icone inline, sem variavel):**
```css
.switch button {
  width: 32px;
  height: 32px;
  background: white url('./assets/moon-stars.svg');
  border: none;
  border-radius: 50%;
}
```
Problema: para trocar o icone no light mode, precisa duplicar todo o seletor e sobrescrever background-image.

**After (com custom property):**
```css
:root {
  --switch-bg-url: url('./assets/moon-stars.svg');
}

.light {
  --switch-bg-url: url('./assets/sun.svg');
}

.switch button {
  width: 32px;
  height: 32px;
  background: white var(--switch-bg-url) no-repeat center;
  border: 0;
  border-radius: 50%;
}
```
Resultado: trocar a classe no body alterna o icone automaticamente.

## Heuristics

| Situation | Do |
|-----------|-----|
| Botao so com icone, sem texto | Use background-image, nao `<img>` |
| Precisa trocar icone por tema | CSS custom property no `:root` e override no seletor de tema |
| SVG repete dentro do botao | Adicione `no-repeat` ao background |
| SVG desalinhado no botao | Adicione `center` ao background |
| Largura e altura iguais + border-radius 50% | Resultado: circulo perfeito |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `border-radius: 16px` (metade hardcoded) | `border-radius: 50%` (sempre circular independente do tamanho) |
| `<img src="moon.svg">` dentro do button de toggle | `background: url(...) no-repeat center` |
| Duplicar seletor inteiro para trocar icone no light mode | CSS custom property `--switch-bg-url` |
| `background-image: url(...)` sem `no-repeat` | `background: color url(...) no-repeat center` shorthand |
| Estilos do switch misturados com profile | Secao separada com comentario `/* switch */` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre background shorthand, border-radius 50%, e estrategia de variaveis para temas
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes e anotacoes