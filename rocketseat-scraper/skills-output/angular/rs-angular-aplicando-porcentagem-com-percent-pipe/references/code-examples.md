# Code Examples: PercentPipe

## Exemplo 1: Uso basico sem parametros

```html
<!-- Componente -->
<!-- value = 0.5 -->

<!-- Template -->
{{ value | percent }}

<!-- Resultado: 50% -->
```

## Exemplo 2: Diferentes valores de entrada

```typescript
@Component({
  template: `
    <p>{{ a | percent }}</p>  <!-- 100% -->
    <p>{{ b | percent }}</p>  <!-- 50% -->
    <p>{{ c | percent }}</p>  <!-- 1% -->
    <p>{{ d | percent }}</p>  <!-- 10,000% -->
  `
})
export class ExampleComponent {
  a = 1.0;    // 1.0 * 100 = 100
  b = 0.5;    // 0.5 * 100 = 50
  c = 0.01;   // 0.01 * 100 = 1
  d = 100;    // 100 * 100 = 10000
}
```

## Exemplo 3: DigitsInfo com arredondamento

```html
<!-- value = 0.123456 (12.3456%) -->

{{ value | percent:'1.0-3' }}
<!-- Resultado: 12.346% (arredondado: 6>=5, 5+1=6) -->

{{ value | percent:'1.0-0' }}
<!-- Resultado: 12% (todos decimais removidos por arredondamento) -->

{{ value | percent:'1.4-4' }}
<!-- Resultado: 12.3456% (ja tem 4 decimais, sem mudanca) -->

{{ value | percent:'1.2-2' }}
<!-- Resultado: 12.35% (arredondado para 2 decimais) -->
```

## Exemplo 4: Preenchimento com zeros

```html
<!-- value = 0.5 (50%) -->
{{ value | percent:'1.2-2' }}
<!-- Resultado: 50.00% (zeros adicionados para atingir minFrac=2) -->

<!-- value = 0.123 (12.3%) -->
{{ value | percent:'1.4-4' }}
<!-- Resultado: 12.3000% (zeros adicionados para atingir minFrac=4) -->
```

## Exemplo 5: Caso especial — arredondamento que afeta o inteiro

```html
<!-- value = 0.005 (0.5%) -->
{{ value | percent:'1.0-0' }}
<!-- Resultado: 1% (0.5 arredonda para 1 porque 5>=5) -->
```

## Exemplo 6: Pratica interativa sugerida pelo instrutor

```typescript
@Component({
  template: `
    <div *ngFor="let item of examples">
      <p>Entrada: {{ item.value }}</p>
      <p>Sem formato: {{ item.value | percent }}</p>
      <p>1.0-0: {{ item.value | percent:'1.0-0' }}</p>
      <p>1.2-2: {{ item.value | percent:'1.2-2' }}</p>
      <p>1.0-3: {{ item.value | percent:'1.0-3' }}</p>
    </div>
  `
})
export class PracticeComponent {
  examples = [
    { value: 0.5 },
    { value: 0.123456 },
    { value: 0.005 },
    { value: 1.0 },
    { value: 0.1235 },
  ];
}
```

## Exemplo 7: Corrigindo valor vindo do backend

```typescript
// Backend envia: { taxa: 75 } (significando 75%)
// Precisa converter antes de usar no pipe

@Component({
  template: `{{ taxaCorrigida | percent:'1.0-2' }}`
})
export class ConversionComponent {
  taxaDoBackend = 75;
  taxaCorrigida = this.taxaDoBackend / 100; // 0.75
  // Resultado: 75%
}
```