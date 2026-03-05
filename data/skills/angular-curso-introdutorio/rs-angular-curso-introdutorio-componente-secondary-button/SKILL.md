---
name: rs-angular-intro-secondary-button
description: "Applies Angular component creation patterns when building reusable button variants. Use when user asks to 'create a button component', 'build a secondary button', 'reuse component styles', or 'create UI variants in Angular'. Enforces CSS reuse across component variants, dynamic icon integration with Phosphor Icons, and flexbox alignment for icon+text buttons. Make sure to use this skill whenever creating Angular UI components that are variants of existing ones. Not for routing, services, or state management."
---

# Componente: Secondary Button (Angular)

> Ao criar variantes de componentes UI, reutilize o CSS base e ajuste apenas os atributos que diferem.

## Rules

1. **Gere componentes via CLI com --skip-tests durante prototipagem** — `ng g c component-name --skip-tests`, porque mantém o foco no layout sem overhead de testes iniciais
2. **Reutilize CSS de componentes similares** — copie o CSS base e altere apenas o necessario (cor, padding, tamanho), porque evita duplicacao de logica visual
3. **Use display flex + align-items center em botoes com icone** — porque garante alinhamento vertical correto entre icone e texto
4. **Defina gap entre icone e texto** — `gap: 8px`, porque sem gap o icone gruda no label
5. **Estilize icones via seletor descendente** — `.custom-button i { font-size: 20px }`, porque controla o tamanho do icone sem classe extra
6. **Mantenha cursor pointer mesmo em elementos button** — porque garante consistencia visual do mouse em todos os navegadores

## How to write

### Gerar o componente

```bash
cd src/app/_components
ng g c secondary-button --skip-tests
```

### CSS reutilizado com ajustes

```css
.custom-button {
  padding: 10px 20px;
  background: #3b82f6; /* cor direta, sem linear-gradient */
  cursor: pointer;
  gap: 8px;
  display: flex;
  align-items: center;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  height: 40px;
}

.custom-button:hover {
  opacity: 90%;
}

.custom-button i {
  font-size: 20px;
}
```

### HTML com icone dinamico

```html
<button class="custom-button">
  <i class="ph ph-plus"></i>
  Botão secundário
</button>
```

### Usar no componente pai

```html
<app-secondary-button></app-secondary-button>
```

## Example

**Before (sem alinhamento, sem gap):**
```html
<button class="custom-button">
  <i class="ph ph-plus"></i>
  Texto
</button>
```
```css
.custom-button {
  padding: 10px 20px;
  background: #3b82f6;
}
```
Resultado: icone e texto desalinhados verticalmente, colados um no outro.

**After (com flex + gap):**
```css
.custom-button {
  padding: 10px 20px;
  background: #3b82f6;
  display: flex;
  align-items: center;
  gap: 8px;
}

.custom-button i {
  font-size: 20px;
}
```
Resultado: icone e texto centralizados, com espacamento correto.

## Heuristics

| Situacao | Faca |
|----------|------|
| Variante de botao existente | Copie CSS base, ajuste cor/padding/height |
| Botao com icone + texto | `display: flex; align-items: center; gap: 8px` |
| Icone Phosphor Icons | Use classe `ph ph-{nome}` dentro de tag `<i>` |
| Estado disabled | Aplique `opacity: 50%` (implementar depois com inputs) |
| Hover simples | Use `opacity: 90%` no hover |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Reescrever CSS do zero para variante | Copie e ajuste apenas diferencas |
| `<img>` para icones de UI | `<i class="ph ph-plus">` (icon font) |
| Alinhar icone com margin/padding manual | `display: flex; align-items: center` |
| Tamanho de icone via width/height | `font-size` para icon fonts |
| Esquecer gap entre icone e texto | Sempre `gap: 8px` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
