---
name: rs-angular-intro-componente-primary-button
description: "Applies Angular reusable button component patterns when creating UI components. Use when user asks to 'create a button component', 'make a reusable button', 'style a button in Angular', or 'build UI components in Angular'. Enforces proper component generation with ng g c, CSS custom classes with linear-gradient backgrounds, hover/disable states via opacity, and correct component imports. Make sure to use this skill whenever building Angular button or reusable UI components. Not for React/Vue components, form logic, or routing configuration."
---

# Componente: Primary Button em Angular

> Crie botões reutilizáveis como componentes Angular isolados, com estados visuais (default, hover, disable) controlados via CSS e propriedades dinâmicas via @Input.

## Rules

1. **Gere componentes com nome composto usando maiúscula** — `ng g c primaryButton` gera `primary-button/` automaticamente, porque o Angular converte camelCase para kebab-case com traço
2. **Ignore arquivos de teste na geração** — use `ng g c primaryButton --skip-tests` para manter o projeto limpo durante prototipação
3. **Use classes CSS customizadas, não estilos inline** — crie `.custom-button` no CSS do componente, porque mantém estilos encapsulados e reutilizáveis
4. **Aplique `background` para gradientes, nunca `background-color`** — `background-color` ignora `linear-gradient()`, causando botão sem cor
5. **Sempre remova `border: none`** — botões HTML têm borda padrão do navegador que quebra o design
6. **Importe o componente no módulo/componente pai** — adicione no array `imports` do componente que consome, senão Angular lança erro de elemento desconhecido
7. **Modele estados visuais via opacity** — hover com `opacity: 0.9`, disable com `opacity: 0.5`, porque é o padrão do Style Guide e mantém consistência

## How to write

### Gerar o componente

```bash
ng g c components/primaryButton --skip-tests
```

### HTML do botão

```html
<button class="custom-button">Botão Primário</button>
```

### CSS com gradiente e estados

```css
.custom-button {
  height: 48px;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  color: white;
  background: linear-gradient(90deg, #FirstColor 0%, #SecondColor 100%);
  cursor: pointer;
}

.custom-button:hover {
  opacity: 0.9;
}

.custom-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Importar no componente pai

```typescript
import { PrimaryButtonComponent } from './components/primary-button/primary-button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PrimaryButtonComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
```

## Example

**Before (erro comum — background-color com gradiente):**
```css
.custom-button {
  background-color: linear-gradient(90deg, #color1 0%, #color2 100%);
}
```

**After (correto — propriedade background):**
```css
.custom-button {
  background: linear-gradient(90deg, #color1 0%, #color2 100%);
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Botão com gradiente não aparece | Troque `background-color` por `background` |
| Erro "element not found" ao usar componente | Adicione no array `imports` do componente pai |
| Borda indesejada aparece no botão | Adicione `border: none` antes do `border-radius` |
| Precisa de estados dinâmicos (disable) | Use `@Input()` para receber estado do pai e aplicar classe CSS condicionalmente |
| Componente gerado com nome errado | Use camelCase no `ng g c` — Angular converte para kebab-case |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|-----------------|
| `background-color: linear-gradient(...)` | `background: linear-gradient(...)` |
| `ng g c Button` (genérico) | `ng g c primaryButton` (específico) |
| Estilos inline no template HTML | Classe CSS no arquivo `.css` do componente |
| Usar componente sem importar no pai | Adicionar em `imports: [ComponentName]` |
| Botão sem `border: none` | Sempre declarar `border: none` explicitamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
