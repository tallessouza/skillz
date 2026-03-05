# Code Examples: Fontes Próprias no Angular

## 1. Criando o componente

```bash
# Na pasta de components
ng generate component fontes-proprias
```

## 2. Referenciando no AppComponent

```typescript
// app.component.ts
import { FontesProriasComponent } from './components/fontes-proprias/fontes-proprias.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FontesProriasComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
```

```html
<!-- app.component.html -->
<app-fontes-proprias></app-fontes-proprias>
```

## 3. Declaração completa do @font-face (styles.css)

```css
/* Fonte normal — variable font cobrindo todos os weights */
@font-face {
  font-family: 'Cascadia Code';
  src: url('/fontes/CascadiaCode-Regular.ttf');
  font-weight: 100 900;
  font-style: normal;
}

/* Fonte itálica — mesmo font-family, font-style diferente */
@font-face {
  font-family: 'Cascadia Code';
  src: url('/fontes/CascadiaCode-Italic.ttf');
  font-weight: 100 900;
  font-style: italic;
}
```

## 4. Uso no componente

```css
/* fontes-proprias.component.css */
p {
  font-family: 'Cascadia Code', sans-serif;
  font-weight: 600;
  font-style: italic;
}
```

## 5. Variação: importando fontes estáticas (arquivo por weight)

```css
/* Se usar os arquivos da pasta static/ em vez do variable font */
@font-face {
  font-family: 'Cascadia Code';
  src: url('/fontes/static/CascadiaCode-Bold.ttf');
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: 'Cascadia Code';
  src: url('/fontes/static/CascadiaCode-BoldItalic.ttf');
  font-weight: 700;
  font-style: italic;
}

@font-face {
  font-family: 'Cascadia Code';
  src: url('/fontes/static/CascadiaCode-ExtraLight.ttf');
  font-weight: 200;
  font-style: normal;
}

@font-face {
  font-family: 'Cascadia Code';
  src: url('/fontes/static/CascadiaCode-ExtraLightItalic.ttf');
  font-weight: 200;
  font-style: italic;
}

/* Repetir para cada weight necessário */
```

## 6. Demonstração do itálico simulado vs real

```css
/* RUIM: só importa normal, navegador simula itálico */
@font-face {
  font-family: 'Cascadia Code';
  src: url('/fontes/CascadiaCode-Regular.ttf');
  font-weight: 100 900;
  font-style: normal;
}

p {
  font-family: 'Cascadia Code', sans-serif;
  font-style: italic; /* navegador SIMULA — resultado inferior */
}
```

```css
/* BOM: importa ambas variantes, navegador usa arquivo real */
@font-face {
  font-family: 'Cascadia Code';
  src: url('/fontes/CascadiaCode-Regular.ttf');
  font-weight: 100 900;
  font-style: normal;
}

@font-face {
  font-family: 'Cascadia Code';
  src: url('/fontes/CascadiaCode-Italic.ttf');
  font-weight: 100 900;
  font-style: italic;
}

p {
  font-family: 'Cascadia Code', sans-serif;
  font-style: italic; /* usa arquivo REAL do tipógrafo */
}
```

## 7. Estrutura de diretórios completa

```
projeto-angular/
├── public/
│   └── fontes/
│       ├── CascadiaCode-Regular.ttf
│       └── CascadiaCode-Italic.ttf
├── src/
│   ├── styles.css          ← @font-face declarado aqui
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   └── components/
│   │       └── fontes-proprias/
│   │           ├── fontes-proprias.component.ts
│   │           ├── fontes-proprias.component.html
│   │           └── fontes-proprias.component.css  ← usa a fonte aqui
```