# Code Examples: Exibindo Informacoes do Certificado

## 1. Injecao do Router e redirecionamento

```typescript
// certificado-form.component.ts
import { Router } from '@angular/router';

export class CertificadoFormComponent {
  private route = inject(Router);
  private certificadoService = inject(CertificadoService);

  onSubmit() {
    const certificado: Certificado = {
      id: crypto.randomUUID(),
      nome: this.form.value.nome,
      atividades: this.atividades,
      dataEmissao: new Date().toLocaleDateString('pt-BR'),
    };

    this.certificadoService.adicionar(certificado);

    // Redireciona para a pagina do certificado
    this.route.navigate(['certificados', certificado.id]);

    // REMOVIDO — codigo morto apos redirect:
    // this.form.reset();
    // this.atividades = [];
  }
}
```

## 2. Template com @if e join

```html
<!-- certificado.component.html -->
@if (certificado) {
  <div class="certificado">
    <h2>Certificado de Conclusao</h2>
    <p class="nome">{{ certificado.nome }}</p>
    <p class="atividades">{{ certificado.atividades.join(', ') }}</p>
    <p class="data">Emitido em: {{ certificado.dataEmissao }}</p>
    <button class="download">
      <i class="ph ph-download-simple"></i>
      Download
    </button>
  </div>
}
```

## 3. Servico com unshift para ordenacao

```typescript
// certificado.service.ts
export class CertificadoService {
  private certificados: Certificado[] = [];

  adicionar(certificado: Certificado) {
    // unshift adiciona no inicio — mais recentes primeiro
    this.certificados.unshift(certificado);
    this.salvarNoLocalStorage();
  }

  listar(): Certificado[] {
    return this.certificados;
    // NAO precisa de .reverse() se ja usa unshift
  }
}
```

## 4. Alternativa com reverse (nao recomendada se ja usa unshift)

```typescript
// Se por algum motivo usar push() no servico:
adicionar(certificado: Certificado) {
  this.certificados.push(certificado);
}

// Entao na listagem, inverta:
get certificadosOrdenados() {
  return this.certificadoService.listar().reverse();
}

// ATENCAO: nao use unshift + reverse juntos — um anula o outro
```

## 5. Teste manual com localStorage.clear

```javascript
// No console do navegador (F12):
localStorage.clear();
// Recarregue a pagina — deve exibir o aviso de "nenhum certificado gerado"
```

Util para validar que a logica de estado vazio (empty state) esta funcionando corretamente.