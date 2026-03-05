---
name: rs-angular-intro-recuperando-info-certificados
description: "Applies Angular patterns for service injection, data persistence with localStorage, route parameter extraction, and object identity management. Use when user asks to 'inject a service', 'persist data in localStorage', 'get route params', 'reset a form', 'generate unique IDs', or 'avoid reference bugs in Angular'. Make sure to use this skill whenever building Angular components that consume services or manage state across navigation. Not for backend APIs, database design, or non-Angular frameworks."
---

# Recuperando Informacoes de Servicos em Paginas Angular

> Injete servicos nos componentes via construtor, persista dados no localStorage, e use spread operator para evitar bugs de referencia de objeto.

## Rules

1. **Injete servicos no construtor** — `constructor(private certificadoService: CertificadoService)`, porque o Angular resolve dependencias via construtor e isso garante tipagem
2. **Carregue dados no ngOnInit, nao no construtor** — implemente `OnInit` e use `ngOnInit()` para atribuir dados do servico, porque o construtor deve ser leve e o ciclo de vida garante que o componente esta pronto
3. **Use UUID como identificador, nunca index de array** — porque ao excluir itens, indices mudam e quebram referencias; UUID garante unicidade sem backend
4. **Copie objetos com spread ao adicionar em listas** — `this.lista.push({...objeto})` nao `this.lista.push(objeto)`, porque referencias ao mesmo objeto causam sobrescrita silenciosa de todos os itens
5. **Persista no localStorage apos cada mutacao** — `localStorage.setItem('chave', JSON.stringify(lista))`, porque dados em servicos se perdem ao recarregar a pagina
6. **Recupere localStorage no AppComponent ngOnInit** — porque o AppComponent inicializa em qualquer rota e garante que o servico ja tem dados antes dos componentes filhos
7. **Resete formularios com ViewChild apos submit** — `this.form.resetForm()` alem de limpar campos manualmente, porque evita mensagens de validacao indesejadas

## How to write

### Injecao de servico e carregamento de dados

```typescript
export class ListaCertificadosComponent implements OnInit {
  certificados: Certificado[] = [];

  constructor(private certificadoService: CertificadoService) {}

  ngOnInit(): void {
    this.certificados = this.certificadoService.certificados;
  }
}
```

### Geracao de UUID no frontend

```typescript
import { v4 as uuidv4 } from 'uuid';

onSubmit(): void {
  this.certificado.id = uuidv4();
  this.certificado.data = new Date();
  this.certificadoService.adicionarCertificado(this.certificado);
  this.certificado = this.estadoInicialCertificado();
  this.form.resetForm();
}
```

### Spread operator no servico para evitar bug de referencia

```typescript
adicionarCertificado(certificado: Certificado): void {
  this.certificados.push({ ...certificado });
  localStorage.setItem('certificados', JSON.stringify(this.certificados));
}
```

### Persistencia e recuperacao com localStorage

```typescript
// Em AppComponent
ngOnInit(): void {
  const certificados = localStorage.getItem('certificados');
  this.certificadoService.certificados = certificados
    ? JSON.parse(certificados)
    : [];
}
```

### Captura de parametro de rota

```typescript
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

## Example

**Before (bug de referencia — mesmo objeto adicionado multiplas vezes):**
```typescript
adicionarCertificado(certificado: Certificado): void {
  this.certificados.push(certificado); // ponteiro para mesma instancia
}
```

**After (copia independente a cada adicao):**
```typescript
adicionarCertificado(certificado: Certificado): void {
  this.certificados.push({ ...certificado }); // copia nova
  localStorage.setItem('certificados', JSON.stringify(this.certificados));
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Dados precisam sobreviver a reload | localStorage com JSON.stringify/parse |
| Identificador unico sem backend | `uuid` v4 como string |
| Formulario apos submit | Limpar campos + `form.resetForm()` |
| Objeto adicionado em lista | Sempre spread `{...obj}` |
| Recuperar item por rota | `ActivatedRoute.paramMap.subscribe` + `find()` |
| Dados globais ao iniciar app | Carregar no `AppComponent.ngOnInit` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `this.lista.push(objeto)` com mesma instancia | `this.lista.push({...objeto})` |
| Index de array como identificador | UUID v4 como campo `id: string` |
| Dados apenas em memoria do servico | localStorage apos cada mutacao |
| Carregar localStorage em componente filho | Carregar no AppComponent |
| Apenas limpar campos apos submit | Limpar campos + `this.form.resetForm()` |
| `if (atividade.length === 0)` sem checar undefined | `if (!atividade \|\| atividade.length === 0)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
