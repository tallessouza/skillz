# Code Examples: Style Binding na Prática

## Componente 1: DynamicText (inline)

```typescript
@Component({
  selector: 'app-dynamic-text',
  standalone: true,
  template: `
    <div>
      <p [style.font-size.rem]="tamanhoTextoRem">
        Texto com tamanho dinâmico
      </p>
      <button (click)="aumentarTexto()">Tamanho +</button>
      <button (click)="diminuirTexto()">Tamanho -</button>
    </div>
  `
})
export class DynamicTextComponent {
  tamanhoTextoRem = 1.2;

  aumentarTexto() {
    this.tamanhoTextoRem = Math.min(this.tamanhoTextoRem + 0.2, 2.0);
  }

  diminuirTexto() {
    this.tamanhoTextoRem = Math.max(this.tamanhoTextoRem - 0.2, 0.8);
  }
}
```

**Conceitos demonstrados:**
- Style binding com unidade `.rem`
- Limites min/max para evitar overflow
- Incremento/decremento controlado

---

## Componente 2: ProgressBar (arquivos separados)

### progress-bar.component.html

```html
<div class="progress-bar-container">
  <div class="progress-bar-fill" [style.width.px]="progresso"></div>
</div>
<button (click)="aumentarProgresso()">Aumentar Progresso</button>
```

### progress-bar.component.css

```css
.progress-bar-container {
  width: 300px;
  height: 30px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background-color: green;
  transition: width 0.3s ease-out;
}
```

### progress-bar.component.ts

```typescript
@Component({
  selector: 'app-progress-bar',
  standalone: true,
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent {
  progresso = 0;

  aumentarProgresso() {
    this.progresso = Math.min(this.progresso + 30, 300);
  }
}
```

**Conceitos demonstrados:**
- Style binding com `.px`
- CSS transition pareado com a propriedade `width`
- Arquivos separados (templateUrl + styleUrls)

---

## Componente 3: SquarePopup (inline, multiplos bindings)

```typescript
@Component({
  selector: 'app-square-popup',
  standalone: true,
  template: `
    <div class="quadrado" [style.left.%]="posicaoHorizontal"></div>
    <button (click)="moverQuadrado()">Mover Quadrado</button>

    <div class="popup"
         [style.top.vh]="alturaPopup"
         [style.right]="'10px'">
      Conteúdo do Popup
    </div>
    <button (click)="togglePopup()">Toggle Popup</button>
  `,
  styles: [`
    .quadrado {
      width: 50px;
      height: 50px;
      background-color: blue;
      position: relative;
      transition: left 0.5s ease;
    }

    .popup {
      position: fixed;
      background-color: white;
      border: 1px solid #ccc;
      padding: 20px;
      transition: top 0.3s ease;
    }
  `]
})
export class SquarePopupComponent {
  posicaoHorizontal = 0;
  alturaPopup = -10;

  moverQuadrado() {
    this.posicaoHorizontal = (this.posicaoHorizontal + 10) % 100;
  }

  togglePopup() {
    this.alturaPopup = this.alturaPopup === -10 ? 10 : -10;
  }
}
```

**Conceitos demonstrados:**
- Style binding com `.%` (porcentagem)
- Style binding com `.vh`
- Valor chumbado como string: `"'10px'"`
- Operador modulo para loop circular
- Ternario para toggle
- Dois bindings separados no mesmo elemento (`top` e `right`)

---

## Referenciando componentes no AppComponent

```typescript
// app.component.ts
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DynamicTextComponent, ProgressBarComponent, SquarePopupComponent],
  template: `
    <app-dynamic-text />
    <app-progress-bar />
    <app-square-popup />
  `
})
export class AppComponent {}
```

---

## Variacoes para praticar

### Style binding com cor dinamica

```html
<div [style.background-color]="corAtiva">Caixa colorida</div>
```

```typescript
corAtiva = 'red';

trocarCor() {
  const cores = ['red', 'blue', 'green', 'purple'];
  const indice = (cores.indexOf(this.corAtiva) + 1) % cores.length;
  this.corAtiva = cores[indice];
}
```

### Style binding com opacity para fade

```html
<div [style.opacity]="opacidade">Elemento com fade</div>
```

```css
div { transition: opacity 0.5s ease; }
```

```typescript
opacidade = 1;

toggleVisibilidade() {
  this.opacidade = this.opacidade === 1 ? 0 : 1;
}
```