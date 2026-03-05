---
name: rs-angular-utilizando-o-event-binding
description: "Applies Angular event binding syntax when writing component templates and event handlers. Use when user asks to 'handle click', 'listen to events', 'capture input value', 'add event to button', 'react to user interaction', or any Angular template with user events. Enforces correct parentheses syntax, proper event typing with casting, and $event parameter usage. Make sure to use this skill whenever creating Angular components with interactive elements. Not for two-way data binding, reactive forms, or output event emitters between components."
---

# Event Binding no Angular

> Utilize parenteses no template para capturar eventos de elementos HTML e disparar metodos na classe do componente.

## Rules

1. **Use parenteses para receber eventos** — `(click)="onButtonClick()"` nao `onclick="..."`, porque parenteses indicam que estamos recebendo algo do elemento na sintaxe Angular
2. **Nomeie eventos sem o prefixo 'on'** — `(click)` nao `(onClick)`, porque Angular usa os mesmos nomes do addEventListener do JavaScript puro
3. **Use $event para acessar o valor emitido** — `(input)="onInput($event)"`, porque $event e a sintaxe Angular para receber o objeto de evento
4. **Tipe eventos corretamente** — `event: InputEvent` nao `event: any`, porque any impede autocomplete e dificulta debug
5. **Faca casting do target para acessar value** — `(event.target as HTMLInputElement).value`, porque target e generico e nem todo elemento HTML tem a propriedade value
6. **Prefira reactive forms para capturar valores de input** — event binding direto no input e para casos especificos, porque Angular oferece two-way data binding e reactive forms que sao mais simples

## How to write

### Evento de clique em botao

```typescript
// Template
<button (click)="onButtonClick()">Meu Botao</button>

// Classe do componente
onButtonClick() {
  console.log('Button clicked');
}
```

### Evento de input com valor tipado

```typescript
// Template
<input (input)="onInput($event)" />

// Classe do componente
onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  console.log('value:', value);
}
```

### Eventos focus e blur

```typescript
// Template — multiplos eventos no mesmo elemento
<input
  (focus)="onFocus()"
  (blur)="onBlur()"
  (input)="onInput($event)"
/>

// Classe
onFocus() {
  console.log('Input recebeu foco');
}

onBlur() {
  console.log('Input perdeu foco');
}
```

## Example

**Before (incorreto ou fragil):**
```typescript
// Template com onclick do JS puro
<button onclick="handleClick()">Botao</button>

// Classe com any e sem casting
onInput(event: any) {
  console.log(event.target.value); // funciona mas sem autocomplete
}
```

**After (com esta skill aplicada):**
```typescript
// Template com sintaxe Angular
<button (click)="onButtonClick()">Botao</button>
<input (input)="onInput($event)" />

// Classe com tipagem correta
onButtonClick() {
  console.log('clicked');
}

onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  console.log('value:', value);
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Botao precisa reagir a clique | `(click)="metodo()"` |
| Input precisa do valor digitado | `(input)="metodo($event)"` com casting para HTMLInputElement |
| Precisa saber quando input ganha foco | `(focus)="metodo()"` |
| Precisa saber quando input perde foco | `(blur)="metodo()"` |
| Precisa capturar tecla especifica | `(keydown)="metodo($event)"` ou `(keyup)` |
| Formulario com varios campos | Prefira reactive forms ao inves de event binding manual |
| Nao sabe quais eventos existem | Pesquise no MDN: `{elemento} event MDN` |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `(onClick)="..."` | `(click)="..."` |
| `onclick="..."` no template Angular | `(click)="..."` |
| `event: any` no handler | `event: Event` ou `event: InputEvent` |
| `event.target.value` sem casting | `(event.target as HTMLInputElement).value` |
| Event binding manual para pegar valor de formulario | Reactive forms ou two-way data binding |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
