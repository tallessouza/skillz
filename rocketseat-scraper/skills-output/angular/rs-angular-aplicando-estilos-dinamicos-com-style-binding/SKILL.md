---
name: rs-angular-style-binding-dinamico
description: "Applies Angular style binding patterns when writing dynamic inline styles in components. Use when user asks to 'change styles dynamically', 'bind CSS properties', 'toggle colors', 'style binding Angular', or 'apply inline styles in Angular'. Covers single property binding, unit suffixes, ternary conditions, getter functions, interpolation, and object binding. Make sure to use this skill whenever generating Angular template code that manipulates element styles dynamically. Not for CSS classes (use class binding), global stylesheets, or static inline styles."
---

# Style Binding no Angular

> Aplique estilos CSS dinamicamente em elementos HTML vinculando propriedades do componente ao atributo style via template syntax.

## Rules

1. **Use colchetes `[style.prop]` para valores dinamicos** — `[style.color]="minhaCor"`, porque sem colchetes o Angular trata como string estatica
2. **Especifique unidade no binding quando possivel** — `[style.width.px]="largura"` em vez de concatenar manualmente, porque o Angular converte automaticamente o number para `200px`
3. **Evite funcoes complexas no template** — getters e metodos chamados no template sao re-executados a cada change detection, porque logica pesada causa problemas de performance
4. **Recrie o objeto inteiro ao usar object binding** — `this.estilos = { ...this.estilos, padding: novoValor }`, porque o Angular nao detecta mutacoes internas no objeto
5. **Prefira camelCase nas chaves de objeto** — `backgroundColor` em vez de `background-color`, porque sintaxe com hifen exige notacao especial `['background-color']` no objeto JS
6. **Use ternario para estilos condicionais simples** — `[style.backgroundColor]="ativo ? 'green' : 'grey'"`, porque e legivel e direto sem metodo extra

## How to write

### Propriedade CSS unica

```typescript
// Template
<p [style.color]="corTexto">Texto colorido</p>

// Componente
corTexto = 'blue';

mudarCor() {
  this.corTexto = this.corTexto === 'blue' ? 'red' : 'blue';
}
```

### Com unidade de medida

```typescript
// Angular converte number + unidade automaticamente
<div [style.width.px]="largura"></div>
<div [style.height.rem]="altura"></div>
<div [style.fontSize.em]="tamanhoFonte"></div>

// Componente — apenas numbers, sem string "200px"
largura = 200;
altura = 10;
tamanhoFonte = 1.5;
```

### Condicional com ternario

```typescript
<button
  [style.backgroundColor]="estaAtivo ? 'green' : 'grey'"
  (click)="toggleAtivo()">
  {{ estaAtivo ? 'Ativo' : 'Inativo' }}
</button>
```

### Object binding (multiplos estilos)

```typescript
// Template
<div [style]="estilos"></div>

// Componente — objeto com chaves camelCase
estilos: Record<string, string> = {
  textAlign: 'center',
  backgroundColor: '#3498db',
  padding: '20px'
};

// Para atualizar: SEMPRE crie novo objeto
aumentarPadding() {
  const novoPadding = parseInt(this.estilos['padding']) + 10;
  this.estilos = {
    ...this.estilos,
    padding: `${novoPadding}px`
  };
}
```

## Example

**Before (estilo estatico, sem dinamismo):**
```html
<div style="width: 200px; background-color: blue; padding: 10px">
  Conteudo fixo
</div>
```

**After (com style binding dinamico):**
```typescript
// Template
<div
  [style.width.px]="largura"
  [style.backgroundColor]="corFundo"
  [style.padding.px]="padding">
  Conteudo dinamico
</div>

// Componente
largura = 200;
corFundo = 'blue';
padding = 10;

expandir() {
  this.largura += 50;
  this.padding += 5;
  this.corFundo = 'green';
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Uma unica propriedade CSS dinamica | `[style.prop]="valor"` |
| Propriedade com unidade (px, rem, %) | `[style.prop.px]="numberValue"` |
| Toggle entre dois valores | Ternario inline no template |
| Logica condicional com 3+ opcoes | Metodo/getter no componente (mantenha simples) |
| Multiplos estilos dinamicos juntos | Object binding com `[style]="objetoEstilos"` |
| Valor precisa de concatenacao | Interpolacao `style="width: {{largura}}px"` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `this.estilos.padding = '20px'` (mutacao) | `this.estilos = { ...this.estilos, padding: '20px' }` |
| `[style.width]="200"` (sem unidade) | `[style.width.px]="200"` |
| Funcao HTTP/complexa no template binding | Propriedade pre-calculada no componente |
| `['background-color']` no objeto | `backgroundColor` (camelCase) |
| `[style.width.px]="'200px'"` (string com unidade + sufixo) | `[style.width.px]="200"` (number puro) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
