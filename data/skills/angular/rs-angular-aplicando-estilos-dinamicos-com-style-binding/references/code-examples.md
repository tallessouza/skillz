# Code Examples: Style Binding no Angular

## Exemplo 1: Toggle de cor com clique

```typescript
// componente.ts
export class ExemploComponent {
  minhaCor = 'blue';

  mudarCor() {
    this.minhaCor = this.minhaCor === 'blue' ? 'red' : 'blue';
  }
}
```

```html
<!-- componente.html -->
<p [style.color]="minhaCor">Este texto muda de cor</p>
<button (click)="mudarCor()">Mudar Cor</button>
```

## Exemplo 2: Largura e altura com unidades

```typescript
export class DimensoesComponent {
  larguraEmPixels = 200;
  altura = 150;

  aumentarDimensoes() {
    this.larguraEmPixels += 50;
    this.altura += 30;
  }
}
```

```html
<!-- Opcao 1: unidade no binding -->
<div [style.width.px]="larguraEmPixels"
     style="background: coral;">
  Largura: {{larguraEmPixels}}px
</div>

<!-- Opcao 2: concatenacao manual -->
<div [style.height]="altura + 'px'"
     style="background: lightblue;">
  Altura: {{altura}}px
</div>

<button (click)="aumentarDimensoes()">Aumentar</button>
```

**Unidades aceitas:** `px`, `em`, `rem`, `%`

## Exemplo 3: Botao com estado ativo/inativo (ternario)

```typescript
export class BotaoAtivoComponent {
  estaAtivo = false;

  toggleAtivo() {
    this.estaAtivo = !this.estaAtivo;
  }
}
```

```html
<button
  [style.backgroundColor]="estaAtivo ? 'green' : 'grey'"
  [style.color]="'white'"
  (click)="toggleAtivo()">
  {{ estaAtivo ? 'Ativo' : 'Inativo' }}
</button>
```

## Exemplo 4: Cor dinamica com funcao (semaforo)

```typescript
export class SemaforoComponent {
  meuValor = 10;

  getCorParaValor(valor: number): string {
    if (valor > 30) return 'darkgreen';
    if (valor > 20) return 'orange';
    return 'darkred';
  }

  incrementar() {
    this.meuValor += 5;
  }
}
```

```html
<p [style.color]="getCorParaValor(meuValor)">
  Valor: {{ meuValor }} — Cor muda conforme o valor aumenta
</p>
<button (click)="incrementar()">+5</button>
```

**Atencao:** `getCorParaValor` e chamada a cada change detection. Mantenha a logica simples.

## Exemplo 5: Interpolacao no style

```typescript
export class InterpolacaoComponent {
  larguraEmPixels = 100;

  aumentarLargura() {
    this.larguraEmPixels += 25;
  }
}
```

```html
<!-- Interpolacao classica -->
<div style="width: {{larguraEmPixels}}px; background: salmon; height: 50px;">
  {{larguraEmPixels}}px
</div>

<!-- Interpolacao com template literal -->
<div style="{{ `width: ${larguraEmPixels}px; background: teal; height: 50px;` }}">
  {{larguraEmPixels}}px
</div>

<button (click)="aumentarLargura()">Aumentar Largura</button>
```

## Exemplo 6: Object binding (multiplos estilos)

```typescript
export class ObjetoEstilosComponent {
  padding = 50;

  estilos: Record<string, string> = {
    textAlign: 'center',
    backgroundColor: '#3498db',
    color: 'white',
    padding: '50px'
  };

  aumentarPadding() {
    this.padding += 50;
    // CRITICO: criar novo objeto, nao mutar o existente
    this.estilos = {
      ...this.estilos,
      padding: `${this.padding}px`
    };
  }
}
```

```html
<div [style]="estilos">
  Padding atual: {{padding}}px
</div>
<button (click)="aumentarPadding()">+50px Padding</button>
```

### Erro comum com object binding

```typescript
// ERRADO — Angular nao detecta a mudanca
aumentarPadding() {
  this.estilos.padding = '100px'; // mutacao direta, nao funciona
}

// CORRETO — novo objeto, Angular detecta
aumentarPadding() {
  this.estilos = { ...this.estilos, padding: '100px' };
}
```

## Resumo das 6 formas

| # | Forma | Sintaxe | Quando usar |
|---|-------|---------|-------------|
| 1 | Propriedade unica | `[style.color]="prop"` | Uma propriedade, valor direto |
| 2 | Com unidade | `[style.width.px]="num"` | Dimensoes, tamanhos |
| 3 | Ternario | `[style.bg]="cond ? 'a' : 'b'"` | Toggle entre 2 valores |
| 4 | Funcao/getter | `[style.color]="fn(val)"` | Logica com 3+ opcoes |
| 5 | Interpolacao | `style="width: {{val}}px"` | String composta |
| 6 | Objeto | `[style]="objEstilos"` | Multiplos estilos juntos |