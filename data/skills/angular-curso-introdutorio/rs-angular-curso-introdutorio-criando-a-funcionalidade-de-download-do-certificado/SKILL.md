---
name: rs-angular-intro-download-certificado
description: "Applies html2canvas pattern to capture and download DOM elements as images in Angular applications. Use when user asks to 'download as image', 'export to PNG', 'capture screenshot of element', 'save div as image', or 'html to canvas'. Covers ViewChild element reference, canvas-to-dataURL conversion, and programmatic download link creation. Make sure to use this skill whenever implementing DOM-to-image export in Angular. Not for PDF generation, server-side rendering, or file upload functionality."
---

# Download de Elemento DOM como Imagem (Angular + html2canvas)

> Capture qualquer area do DOM como imagem PNG usando html2canvas, ViewChild para referencia do elemento, e um link programatico para simular o download.

## Rules

1. **Instale html2canvas via npm** — `npm install html2canvas`, porque e a biblioteca padrao para converter DOM em canvas
2. **Use ViewChild com ElementRef para referenciar o elemento** — `@ViewChild('ref') element!: ElementRef`, porque html2canvas precisa de um HTMLElement nativo
3. **Acesse .nativeElement ao passar para html2canvas** — `html2canvas(this.element.nativeElement)`, porque a biblioteca espera HTMLElement, nao ElementRef
4. **Use scale para controlar resolucao** — `html2canvas(el, { scale: 2 })`, porque o padrao gera imagem pixelada em telas de alta densidade
5. **Sanitize o nome do arquivo** — substitua espacos por underline com `replaceAll(' ', '_')`, porque nomes de arquivo com espaco causam problemas em sistemas operacionais
6. **Valide dados antes do download** — retorne cedo se os dados necessarios forem undefined, porque evita erros silenciosos no runtime

## How to write

### Template — marcar a area de captura

```html
<div #certificadoContainer>
  <!-- conteudo que sera capturado como imagem -->
</div>
<button (click)="downloadCertificado()">Download</button>
```

### Component — capturar e baixar

```typescript
import { Component, ElementRef, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';

@Component({ /* ... */ })
export class CertificadoComponent {
  @ViewChild('certificadoContainer') certificadoElement!: ElementRef;

  downloadCertificado() {
    if (!this.certificado) return;

    html2canvas(this.certificadoElement.nativeElement, { scale: 2 }).then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `certificado_${this.certificado.nome.replaceAll(' ', '_')}.png`;
      link.click();
    });
  }
}
```

## Example

**Before (download sem tratamento):**
```typescript
downloadCertificado() {
  html2canvas(document.querySelector('#cert')).then((canvas) => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `certificado ${this.nome}.png`; // espaco no nome!
    link.click();
  });
}
```

**After (com this skill aplicada):**
```typescript
downloadCertificado() {
  if (!this.certificado) return;

  html2canvas(this.certificadoElement.nativeElement, { scale: 2 }).then((canvas) => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `certificado_${this.certificado.nome.replaceAll(' ', '_')}.png`;
    link.click();
  });
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Imagem pixelada no download | Aumente `scale` para 2 ou 3 |
| Elemento pode nao existir no DOM ainda | Use `{ static: false }` no ViewChild (padrao) |
| Precisa de outro formato | Troque `image/png` por `image/jpeg` no `toDataURL` |
| Nome do arquivo vem de input do usuario | Use `replaceAll(' ', '_')` e sanitize caracteres especiais |
| Area de captura tem scroll | Considere `scrollX`/`scrollY` nas options do html2canvas |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `document.querySelector('#id')` para captura | `@ViewChild('ref') el!: ElementRef` + `el.nativeElement` |
| `html2canvas(el)` sem scale | `html2canvas(el, { scale: 2 })` |
| `link.download = "certificado " + nome + ".png"` | `` link.download = `certificado_${nome.replaceAll(' ', '_')}.png` `` |
| Download sem validar dados | `if (!this.data) return;` antes de tudo |
| `window.open(canvas.toDataURL())` | `document.createElement('a')` + `.click()` para forcar download |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
