# Code Examples: Recuperando Informacoes dos Certificados nas Paginas

## 1. Interface com campo ID

```typescript
export interface Certificado {
  id: string;
  nome: string;
  data: Date;
  atividades: string[];
}
```

## 2. Servico com spread e localStorage

```typescript
@Injectable({ providedIn: 'root' })
export class CertificadoService {
  certificados: Certificado[] = [];

  adicionarCertificado(certificado: Certificado): void {
    this.certificados.push({ ...certificado });
    localStorage.setItem('certificados', JSON.stringify(this.certificados));
  }
}
```

## 3. Componente de formulario completo

```typescript
import { v4 as uuidv4 } from 'uuid';

@Component({ ... })
export class CertificadoFormComponent {
  @ViewChild('form') form!: NgForm;

  certificado: Certificado = this.estadoInicialCertificado();

  constructor(private certificadoService: CertificadoService) {}

  estadoInicialCertificado(): Certificado {
    return {
      id: '',
      nome: '',
      data: new Date(),
      atividades: []
    };
  }

  adicionarAtividade(atividade: string): void {
    if (!atividade || atividade.length === 0) {
      return;
    }
    this.certificado.atividades.push(atividade);
  }

  onSubmit(): void {
    this.certificado.id = uuidv4();
    this.certificado.data = new Date();
    this.certificadoService.adicionarCertificado(this.certificado);
    this.certificado = this.estadoInicialCertificado();
    this.form.resetForm();
  }
}
```

## 4. AppComponent — recuperacao do localStorage

```typescript
@Component({ ... })
export class AppComponent implements OnInit {
  constructor(private certificadoService: CertificadoService) {}

  ngOnInit(): void {
    const certificados = localStorage.getItem('certificados');
    this.certificadoService.certificados = certificados
      ? JSON.parse(certificados)
      : [];
  }
}
```

## 5. Lista de certificados — consumindo o servico

```typescript
@Component({ ... })
export class ListaCertificadosComponent implements OnInit {
  certificados: Certificado[] = [];

  constructor(private certificadoService: CertificadoService) {}

  ngOnInit(): void {
    this.certificados = this.certificadoService.certificados;
  }
}
```

## 6. Pagina de certificado — captura de rota

```typescript
@Component({ ... })
export class CertificadoComponent implements OnInit {
  id: string | null = null;
  certificado: Certificado | undefined;

  constructor(
    private route: ActivatedRoute,
    private certificadoService: CertificadoService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.certificado = this.certificadoService.certificados
        .find(item => item.id === this.id);
    });
  }
}
```

## 7. Instalacao do UUID

```bash
npm install uuid
```

```typescript
import { v4 as uuidv4 } from 'uuid';
const id = uuidv4(); // ex: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
```

## 8. NgClass condicional para icones ativos na navbar

```html
<a routerLink="/lista" routerLinkActive="active" #rlaLista="routerLinkActive">
  <i [ngClass]="{ 'active': rlaLista.isActive }"></i>
</a>
```

## 9. Desabilitar botao com verificacao defensiva

```html
<button [disabled]="!atividade || atividade.length === 0">
  Adicionar
</button>
```

## 10. localStorage — operacoes basicas

```typescript
// Salvar
localStorage.setItem('certificados', JSON.stringify(this.certificados));

// Recuperar
const data = localStorage.getItem('certificados');
const lista = data ? JSON.parse(data) : [];

// Limpar tudo
localStorage.clear();
```