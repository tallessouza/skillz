---
name: rs-angular-intro-exibindo-info-certificado
description: "Applies Angular patterns for displaying dynamic data on pages after navigation, including route-based data loading, conditional rendering with @if, and array formatting with join. Use when user asks to 'display data after redirect', 'show details page', 'render conditional content in Angular', or 'navigate after form submit'. Make sure to use this skill whenever building detail pages that load data by route param in Angular. Not for form creation, HTTP requests, or backend API integration."
---

# Exibindo Informacoes Dinamicas em Paginas Angular

> Apos navegar para uma pagina de detalhe, carregue os dados pelo ID da rota e renderize condicionalmente apenas quando os dados estiverem definidos.

## Rules

1. **Redirecione apos acao do usuario** — use `router.navigate` com segmentos separados por virgula, porque monta a URL corretamente sem concatenacao manual
2. **Verifique undefined antes de renderizar** — use `@if (dados)` para envolver o bloco inteiro, porque campos individuais com `?.` deixam a UI com espacos em branco estranhos
3. **Formate listas com join** — use `array.join(', ')` no template, porque exibe itens separados por virgula sem logica extra
4. **Ordene por criacao usando unshift** — adicione novos itens com `unshift()` ao inves de `push()`, porque garante que os mais recentes aparecem primeiro sem precisar de `reverse()`
5. **Remova logica morta apos redirect** — se o formulario redireciona apos submit, remova o reset do formulario, porque o codigo nunca sera executado

## How to write

### Redirecionamento apos submit

```typescript
// No componente do formulario, injete o Router
private route = inject(Router);

onSubmit() {
  const certificado = this.buildCertificado();
  this.certificadoService.adicionar(certificado);
  // Redireciona para a pagina de detalhe — segmentos separados por virgula
  this.route.navigate(['certificados', certificado.id]);
}
```

### Renderizacao condicional do bloco inteiro

```html
<!-- Envolva todo o conteudo com @if para evitar UI quebrada -->
@if (certificado) {
  <div class="certificado">
    <p>{{ certificado.nome }}</p>
    <p>{{ certificado.atividades.join(', ') }}</p>
    <p>Emitido em: {{ certificado.dataEmissao }}</p>
    <button>
      <i class="ph ph-download-simple"></i>
      Download
    </button>
  </div>
}
```

### Adicionar item no inicio da lista (servico)

```typescript
adicionar(certificado: Certificado) {
  this.certificados.unshift(certificado); // primeiro na lista
  this.salvarNoLocalStorage();
}
```

## Example

**Before (problematico):**
```html
<!-- Campos com ?. deixam paragrafos vazios se undefined -->
<div class="certificado">
  <p>{{ certificado?.nome }}</p>
  <p>{{ certificado?.atividades }}</p>
</div>
```

**After (com esta skill):**
```html
@if (certificado) {
  <div class="certificado">
    <p>{{ certificado.nome }}</p>
    <p>{{ certificado.atividades.join(', ') }}</p>
    <p>Emitido em: {{ certificado.dataEmissao }}</p>
  </div>
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Formulario redireciona apos submit | Remova reset do form, use `router.navigate` |
| Dados podem ser undefined na pagina | Envolva tudo com `@if (dados)` em vez de `?.` em cada campo |
| Lista de strings precisa virar texto | Use `.join(', ')` direto no template |
| Itens novos devem aparecer primeiro | Use `unshift()` no servico, nao `push()` + `reverse()` |
| Debug temporario com console.log | Remova antes de finalizar |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `this.route.navigate(['/certificados/' + id])` | `this.route.navigate(['certificados', id])` |
| `certificado?.nome` em cada campo do template | `@if (certificado) { ... certificado.nome ... }` |
| `push()` + `reverse()` na listagem | `unshift()` no servico |
| Reset do form apos redirect | Remova — codigo morto |
| `{{ certificado.atividades }}` (array direto) | `{{ certificado.atividades.join(', ') }}` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
