# Code Examples: Trabalhando com SVGs no Angular

## Gerando componentes organizados

```bash
# Criar pasta de componentes e gerar componente para SVGs
ng generate component components/tratando-svg
```

Resultado:
```
src/app/components/tratando-svg/
├── tratando-svg.component.ts
├── tratando-svg.component.html
├── tratando-svg.component.css
└── tratando-svg.component.spec.ts  # pode remover se nao for testar
```

## Registrando o componente no AppComponent

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { TratandoSvgComponent } from './components/tratando-svg/tratando-svg.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TratandoSvgComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
```

```html
<!-- app.component.html -->
<app-tratando-svg />
```

## Forma 1: SVG Inline no HTML

```html
<!-- tratando-svg.component.html -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <!--!Font Awesome Free 6.x.x by @fontawesome -->
  <path d="M135.2 117.4L109.1 192H402.9l-26.1-74.6C372.3 104.6 ..."/>
</svg>
```

### Mudando cor com fill (estatico)
```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
     fill="red">
  <path d="M135.2 117.4L..."/>
</svg>
```

### Mudando cor com property binding (dinamico)
```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
     [attr.fill]="carColor">
  <path d="M135.2 117.4L..."/>
</svg>
```

```typescript
// tratando-svg.component.ts
export class TratandoSvgComponent {
  carColor = 'blue';

  changeColor(color: string) {
    this.carColor = color;
  }
}
```

## Forma 2: SVG como Arquivo Separado

### Estrutura de arquivos
```
public/
└── icons/
    └── car.svg
```

### Conteudo do car.svg
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <path d="M135.2 117.4L109.1 192H402.9l-26.1-74.6C372.3 104.6 ..."/>
</svg>
```

### Referenciando no template
```html
<!-- tratando-svg.component.html -->
<img src="icons/car.svg" alt="Car icon">
```

### O que NAO funciona com img
```html
<!-- NENHUMA dessas abordagens muda a cor -->
<img src="icons/car.svg" style="color: red;">
<img src="icons/car.svg" style="fill: red;">
```

### Hack com filter (NAO recomendado)
```html
<!-- Funciona mas nao e escalavel nem compativel com todos os browsers -->
<img src="icons/car.svg"
     style="filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%);">
```

## Verificando o build

```bash
ng build
```

Saida em `dist/browser/`:
```
dist/
└── browser/
    ├── icons/
    │   └── car.svg          # Copiado como asset
    ├── images/
    │   └── exemplo.png      # Copiado como asset
    ├── main-[hash].js       # Contem SVGs inline
    ├── polyfills-[hash].js
    └── index.html
```

## Verificando no DevTools

### SVG inline — sem requisicao no Network tab
O SVG esta embutido no `main-[hash].js`. Nenhuma requisicao adicional.

### SVG como arquivo — requisicao visivel no Network tab
```
Name: car.svg
Type: image/svg+xml
Size: ~1.2 KB
```