---
name: rs-angular-utilizando-o-property-binding
description: "Applies Angular Property Binding patterns when writing component templates. Use when user asks to 'bind a property', 'connect class to template', 'disable an input', 'set element properties dynamically', or 'create Angular components with dynamic values'. Enforces correct bracket syntax, class-to-template data flow, and property vs attribute distinction. Make sure to use this skill whenever generating Angular templates that need dynamic property values from the component class. Not for event handling (use Event Binding), two-way binding (use ngModel), or static HTML attributes."
---

# Property Binding no Angular

> Utilize colchetes `[property]` para conectar propriedades da classe do componente aos elementos HTML do template, sempre no fluxo classe → template.

## Rules

1. **Use colchetes para binding dinâmico** — `[value]="texto"` não `value="texto"`, porque sem colchetes o Angular trata como atributo estático, não como binding de propriedade
2. **Referencie apenas propriedades existentes na classe** — o valor dentro dos colchetes deve ser uma propriedade da classe do componente, porque o Angular valida em tempo de compilação e dá erro se não existir
3. **Diferencie propriedade de atributo** — atributo é o valor chumbado no HTML, propriedade é a instância no JavaScript acessível via DOM, porque ambos podem ter nomes similares mas comportamentos diferentes
4. **Fluxo é classe → template (direita para esquerda)** — Property Binding envia dados da classe para o template, nunca o contrário, porque o fluxo inverso é Event Binding e o bidirecional é Two-Way Data Binding
5. **Property Binding não atualiza a propriedade da classe** — digitar no input não altera a propriedade vinculada, porque o fluxo é unidirecional; para sincronizar, combine com Event Binding ou use Two-Way Data Binding
6. **Qualquer propriedade da instância DOM é vinculável** — `[disabled]`, `[value]`, `[type]`, `[innerHTML]`, porque todo elemento HTML possui uma instância com propriedades acessíveis

## How to write

### Property Binding básico

```typescript
// Classe do componente
export class MeuComponent {
  texto = 'valor inicial';
  inputType = 'text';
  inputDisabled = false;
}
```

```html
<!-- Template: colchetes vinculam propriedade da classe ao elemento -->
<input id="meu-input"
  [value]="texto"
  [type]="inputType"
  [disabled]="inputDisabled" />
```

### Combinando Event Binding + Property Binding

```typescript
export class MeuComponent {
  texto = 'texto do input';
  inputDisabled = false;

  habilitarInput() {
    this.inputDisabled = false;
  }

  desabilitarInput() {
    this.inputDisabled = true;
  }

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.texto = value;
  }
}
```

```html
<input [value]="texto" [disabled]="inputDisabled" (input)="onInputChange($event)" />
<button (click)="habilitarInput()">Habilitar</button>
<button (click)="desabilitarInput()">Desabilitar</button>
```

## Example

**Before (atributos estáticos, sem binding):**

```html
<input value="texto fixo" disabled="true" type="password" />
```

**After (Property Binding dinâmico):**

```html
<input [value]="texto" [disabled]="inputDisabled" [type]="inputType" />
```

## Heuristics

| Situação | Ação |
|----------|------|
| Valor estático que nunca muda | Use atributo normal: `id="meu-input"` |
| Valor vem da classe do componente | Use Property Binding: `[value]="propriedade"` |
| Precisa reagir a mudança do usuário | Combine com Event Binding: `(input)="metodo($event)"` |
| Precisa sincronização bidirecional | Use Two-Way Data Binding com `[(ngModel)]` |
| Habilitar/desabilitar baseado em estado | Use `[disabled]="condicao"` vinculado a propriedade booleana |

## Anti-patterns

| Nunca escreva | Escreva no lugar |
|---------------|------------------|
| `value="{{texto}}"` (interpolação em atributo) | `[value]="texto"` |
| `disabled="{{isDisabled}}"` | `[disabled]="isDisabled"` |
| `<input disabled="true">` (quando dinâmico) | `<input [disabled]="inputDisabled">` |
| Acessar `event.target.value` sem casting | `(event.target as HTMLInputElement).value` |
| Esperar que digitar no input atualize a propriedade | Combinar `[value]` com `(input)` para sincronizar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
