# Code Examples: Class Binding no Angular

## 1. Toggle de classe unica (booleano)

```html
<!-- isExpanded = true → classe 'expanded' aplicada -->
<ul [class.expanded]="isExpanded">
  <li>Item 1</li>
  <li>Item 2</li>
</ul>

<!-- hasError = false → classe 'error-message' NAO aplicada -->
<p [class.error-message]="hasError">Mensagem de erro</p>
```

```typescript
@Component({...})
export class MyComponent {
  isExpanded = true;
  hasError = false;
}
```

## 2. Vincular a uma string

```html
<ul [class]="listClasses">...</ul>
```

```typescript
@Component({...})
export class MyComponent {
  listClasses = 'active highlighted bordered';
  
  // Quando listClasses mudar, Angular atualiza automaticamente
  changeClasses() {
    this.listClasses = 'inactive dimmed';
  }
}
```

## 3. Vincular a um array (com nova instancia)

```html
<section [class]="sectionClasses">...</section>
<button (click)="adicionarClasse()">Adicionar classe</button>
```

```typescript
@Component({...})
export class MyComponent {
  sectionClasses = ['expandable', 'elevated'];

  adicionarClasse() {
    // ERRADO — push nao dispara change detection:
    // this.sectionClasses.push('visible');
    
    // CERTO — nova instancia de array:
    this.sectionClasses = [...this.sectionClasses, 'visible'];
    // Resultado: ['expandable', 'elevated', 'visible']
  }
}
```

## 4. Vincular a um objeto (com nova instancia)

```html
<section [class]="sectionClasses">...</section>
<button (click)="fecharSection()">Fechar</button>
<button (click)="adicionarClasse()">Adicionar classe</button>
```

```typescript
@Component({...})
export class MyComponent {
  sectionClasses: Record<string, boolean> = {
    expandable: true,
    elevated: true,
  };

  fecharSection() {
    // ERRADO — mutacao direta nao funciona:
    // this.sectionClasses.expandable = false;
    
    // CERTO — nova instancia com valor atualizado:
    this.sectionClasses = {
      ...this.sectionClasses,
      expandable: false,
    };
  }

  adicionarClasse() {
    // ERRADO — adicao direta nao funciona:
    // this.sectionClasses['visible'] = true;
    
    // CERTO — nova instancia com nova classe:
    this.sectionClasses = {
      ...this.sectionClasses,
      visible: true,
    };
  }
}
```

## 5. Interpolacao — cenarios variados

### String simples

```html
<!-- classes = 'visible' -->
<div class="{{classes}}">...</div>
```

### Lista de classes como string

```html
<div class="{{'visible container'}}">...</div>
```

### Array na interpolacao

```html
<!-- classes = ['visible', 'container'] -->
<div class="{{classes}}">...</div>
```

### Objeto na interpolacao

```html
<!-- classes = { visible: false, container: true } -->
<div class="{{classes}}">...</div>
<!-- Resultado: apenas 'container' aplicado -->
```

### Ternario na interpolacao

```html
<!-- logged = true → 'visible container', false → 'hidden' -->
<div class="{{logged ? 'visible container' : 'hidden'}}">...</div>
```

### Backticks na interpolacao

```html
<!-- Classe fixa 'container' + classe dinamica baseada em logged -->
<div class="{{`container ${logged ? 'visible' : 'hidden'}`}}">...</div>
<!-- Resultado: 'container visible' ou 'container hidden' -->
```

### Separando classe fixa e dinamica (mesmo resultado)

```html
<!-- Equivalente ao exemplo acima, mas mais legivel -->
<div class="container" class="{{logged ? 'visible' : 'hidden'}}">...</div>
```

## Resumo visual das sintaxes

| Sintaxe | Tipo de dado | Exemplo |
|---------|-------------|---------|
| `[class.x]="bool"` | boolean | `[class.active]="isActive"` |
| `[class]="prop"` | string | `[class]="'a b c'"` |
| `[class]="prop"` | string[] | `[class]="['a','b']"` |
| `[class]="prop"` | object | `[class]="{a: true, b: false}"` |
| `class="{{expr}}"` | any (interpolacao) | `class="{{ternario}}"` |