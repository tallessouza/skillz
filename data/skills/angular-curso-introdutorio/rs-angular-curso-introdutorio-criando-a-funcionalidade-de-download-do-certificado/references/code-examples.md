# Code Examples: Download de Elemento DOM como Imagem

## Instalacao da biblioteca

```bash
npm install html2canvas
```

## Template HTML — marcando a area de captura

```html
<!-- certificado.component.html -->
<div #certificadoContainer>
  <!-- Todo o conteudo visual do certificado -->
  <h1>Certificado de Conclusao</h1>
  <p>Certificamos que {{ certificado.nome }} concluiu o curso.</p>
</div>

<button (click)="downloadCertificado()">Download</button>
```

O `#certificadoContainer` e uma template reference variable que sera acessada via `@ViewChild`.

## Component TypeScript completo

```typescript
// certificado.component.ts
import { Component, ElementRef, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-certificado',
  templateUrl: './certificado.component.html',
})
export class CertificadoComponent {
  certificado: { nome: string } | undefined;

  // Referencia ao elemento DOM que contem o certificado
  @ViewChild('certificadoContainer') certificadoElement!: ElementRef;

  downloadCertificado() {
    // Guard clause: se nao tem certificado, nao faz nada
    if (!this.certificado) return;

    // html2canvas captura o elemento e retorna uma Promise<HTMLCanvasElement>
    html2canvas(this.certificadoElement.nativeElement, { scale: 2 }).then((canvas) => {
      // Cria um elemento <a> em memoria para simular download
      const link = document.createElement('a');

      // Converte o canvas para data URL no formato PNG
      link.href = canvas.toDataURL('image/png');

      // Define o nome do arquivo, substituindo espacos por underline
      link.download = `certificado_${this.certificado!.nome.replaceAll(' ', '_')}.png`;

      // Simula o clique para iniciar o download
      link.click();
    });
  }
}
```

## Variacao: formato JPEG com qualidade customizada

```typescript
// toDataURL aceita um segundo parametro de qualidade (0 a 1) para JPEG
link.href = canvas.toDataURL('image/jpeg', 0.95);
link.download = `certificado_${nome.replaceAll(' ', '_')}.jpg`;
```

## Variacao: scale maior para impressao

```typescript
// Scale 3 ou 4 para imagens que serao impressas
html2canvas(this.certificadoElement.nativeElement, { scale: 4 }).then((canvas) => {
  // ...mesmo padrao de download
});
```

## Variacao: sanitizacao mais robusta do nome

```typescript
// Alem de espacos, remover caracteres especiais
const sanitizedName = this.certificado.nome
  .replaceAll(' ', '_')
  .replace(/[^a-zA-Z0-9_]/g, '');

link.download = `certificado_${sanitizedName}.png`;
```