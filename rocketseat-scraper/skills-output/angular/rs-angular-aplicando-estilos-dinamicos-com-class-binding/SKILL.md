---
name: rs-angular-class-binding
description: "Applies Angular class binding patterns when writing Angular templates. Use when user asks to 'add dynamic classes', 'toggle CSS class', 'bind class in Angular', 'conditional styling in template', or any Angular template with dynamic classes. Enforces correct syntax for boolean, string, array, object, and interpolation class binding. Make sure to use this skill whenever generating Angular templates that need dynamic CSS classes. Not for inline style binding, global CSS architecture, or React/Vue class handling."
---

# Class Binding no Angular

> Aplicar classes CSS dinamicamente em templates Angular usando a sintaxe correta de class binding para cada tipo de dado.

## Rules

1. **Use `[class.nome-classe]` para toggle booleano** — vincula uma unica classe a uma expressao booleana, porque e o caso mais comum e mais legivel
2. **Use `[class]` com string para classes dinamicas vindas de propriedade** — quando o conjunto inteiro de classes muda dinamicamente baseado em logica do componente
3. **Crie nova instancia ao mudar arrays e objetos** — `push()` ou mutacao direta nao dispara change detection, porque Angular compara referencia, nao conteudo
4. **Combine class estatico com interpolacao dinamica** — separe `class="fixa"` do `class="{{dinamica}}"` para clareza, porque ambos coexistem no mesmo elemento
5. **Nao use colchetes de property binding junto com interpolacao** — `[class]="{{x}}"` e invalido, use um ou outro
6. **Prefira `[class.x]="condicao"` sobre ternarios em interpolacao** — porque e mais legivel e o Angular otimiza melhor

## How to write

### Toggle de classe unica (booleano)

```html
<!-- Aplica 'expanded' quando isExpanded for true -->
<ul [class.expanded]="isExpanded">...</ul>

<!-- Aplica 'error-message' quando hasError for true -->
<p [class.error-message]="hasError">Algo deu errado</p>
```

### String com multiplas classes

```html
<!-- listClasses = 'active highlighted bordered' -->
<ul [class]="listClasses">...</ul>
```

### Array de classes (nova instancia ao mudar)

```typescript
sectionClasses = ['expandable', 'elevated'];

adicionarClasse() {
  // ERRADO: this.sectionClasses.push('visible') — nao funciona
  // CERTO: nova instancia de array
  this.sectionClasses = [...this.sectionClasses, 'visible'];
}
```

```html
<section [class]="sectionClasses">...</section>
```

### Objeto de classes (nova instancia ao mudar)

```typescript
sectionClasses: Record<string, boolean> = {
  expandable: true,
  elevated: true,
};

fecharSection() {
  // ERRADO: this.sectionClasses.expandable = false — nao funciona
  // CERTO: nova instancia de objeto
  this.sectionClasses = { ...this.sectionClasses, expandable: false };
}

adicionarClasse() {
  this.sectionClasses = { ...this.sectionClasses, visible: true };
}
```

### Interpolacao com template literals

```html
<!-- Classe fixa + classe dinamica via ternario -->
<div class="container {{logged ? 'visible' : 'hidden'}}">...</div>

<!-- Equivalente separando estatico e dinamico -->
<div class="container" class="{{logged ? 'visible' : 'hidden'}}">...</div>
```

## Example

**Before (mutacao direta — nao funciona):**

```typescript
classes = ['card', 'shadow'];

addClass() {
  this.classes.push('active'); // Angular nao detecta a mudanca
}
```

**After (nova instancia — funciona):**

```typescript
classes = ['card', 'shadow'];

addClass() {
  this.classes = [...this.classes, 'active'];
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Uma classe que liga/desliga | `[class.nome]="booleano"` |
| Conjunto de classes vem do backend ou logica complexa | `[class]="propriedadeString"` |
| Lista de classes que cresce/diminui | `[class]="arrayDeClasses"` com nova instancia |
| Cada classe tem condicao independente | `[class]="objetoDeClasses"` com nova instancia |
| Classe fixa + classe condicional simples | `class="fixa" class="{{ternario}}"` |
| Expressao complexa com concatenacao | Interpolacao com backticks |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `this.classes.push('x')` | `this.classes = [...this.classes, 'x']` |
| `this.classObj.prop = true` | `this.classObj = {...this.classObj, prop: true}` |
| `[class]="{{interpolacao}}"` | `class="{{interpolacao}}"` (sem colchetes) |
| `[class.a]="x" [class.b]="y" [class.c]="z"` (muitas) | `[class]="objeto"` quando sao 3+ classes condicionais |
| Decorar todas as sintaxes | Entender o conceito e consultar quando precisar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
