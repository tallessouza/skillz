# Code Examples: Lista de Certificados

## Exemplo completo do template

```html
<!-- Estado vazio (comentado durante desenvolvimento do layout) -->
<!-- <div class="custom-card">
  <p>Nenhum certificado gerado</p>
</div> -->

<!-- Lista de certificados -->
<div class="list-certificates">
  <app-item-certificado></app-item-certificado>
  <app-item-certificado></app-item-certificado>
</div>
```

## CSS completo

```css
/* Container do estado vazio (ja existente) */
.custom-card {
  max-width: 672px;
  /* ... outros estilos */
}

/* Container da lista de certificados */
.list-certificates {
  max-width: 672px;
  width: 100%;
}
```

## Evolucao futura: com logica dinamica

Quando a logica dinamica for implementada, o codigo evoluira para algo como:

```html
@if (certificates().length === 0) {
  <div class="custom-card">
    <p>Nenhum certificado gerado</p>
  </div>
} @else {
  <div class="list-certificates">
    @for (cert of certificates(); track cert.id) {
      <app-item-certificado [certificado]="cert"></app-item-certificado>
    }
  </div>
}
```

## Padrao CSS: max-width + width 100%

### Sem width 100% (problema)

```css
.list-certificates {
  max-width: 672px;
  /* Componente fica espremido, nao ocupa o espaco */
}
```

### Com width 100% (correto)

```css
.list-certificates {
  max-width: 672px;
  width: 100%;
  /* Ocupa todo o espaco ate o limite de 672px */
}
```

## Simulando lista com duplicacao

Para validar layout antes de ter dados reais:

```html
<!-- Duplicar o componente para simular multiplos itens -->
<div class="list-certificates">
  <app-item-certificado></app-item-certificado>
  <app-item-certificado></app-item-certificado>
  <app-item-certificado></app-item-certificado>
</div>
```

Isso permite verificar:
- Espacamento entre itens
- Responsividade com multiplos itens
- Overflow e scroll behavior