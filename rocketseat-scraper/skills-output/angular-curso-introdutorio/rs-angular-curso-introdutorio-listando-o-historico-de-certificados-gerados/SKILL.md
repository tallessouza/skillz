---
name: rs-angular-intro-listando-historico-certificados
description: "Applies Angular control flow patterns (@for, @if) and component input binding (@input) when building list pages with conditional rendering. Use when user asks to 'list items', 'create a repeating component', 'loop through data in Angular', 'show empty state', or 'pass data to child component'. Covers @for iteration, @if conditional blocks, and multi-input component communication. Make sure to use this skill whenever building Angular templates with lists and empty states. Not for routing setup, form handling, or certificate PDF generation."
---

# Listando Itens com Control Flow no Angular

> Ao construir listas no Angular, use @for para iterar, @if para estados condicionais, e @input para comunicar dados pai-filho.

## Rules

1. **Use @input para cada dado que o componente filho precisa** — crie inputs separados para cada propriedade (`nomeAluno`, `dataEmissao`, `id`), porque componentes reutilizaveis precisam de contratos claros
2. **Inicialize inputs com valores padrao seguros** — string vazia para textos, `0` para numeros, porque evita erros de undefined no template
3. **Use @for para repetir componentes** — nunca duplique markup manualmente, porque o laco garante sincronizacao com a lista de dados
4. **Use @if com length para estados vazios** — verifique `lista.length > 0` para exibir itens e `=== 0` para mensagem vazia, porque o usuario precisa de feedback visual
5. **Passe propriedades do item iterado via property binding** — `[nomeAluno]="certificado.nome"`, porque conecta dados do pai ao input do filho
6. **Redirecione apos acoes de criacao** — apos gerar um item, navegue para a lista ou detalhe, porque o usuario quer ver o resultado imediato

## How to write

### Component com multiplos inputs

```typescript
// item-certificado.component.ts
@input() nomeAluno: string = '';
@input() dataEmissao: string = '';
@input() id: string = '';

redirecionaCertificado() {
  this.router.navigate(['/certificado', this.id]);
}
```

### Template com @for e @if

```html
<!-- certificados.component.html -->
@if (certificados.length > 0) {
  <div>
    @for (certificado of certificados; track certificado.id) {
      <app-item-certificado
        [nomeAluno]="certificado.nome"
        [dataEmissao]="certificado.dataEmissao"
        [id]="certificado.id"
      />
    }
  </div>
}

@if (certificados.length === 0) {
  <p>Nenhum certificado gerado</p>
}
```

## Example

**Before (markup duplicado, sem inputs):**
```html
<app-item-certificado></app-item-certificado>
<app-item-certificado></app-item-certificado>
<app-item-certificado></app-item-certificado>
```

**After (com control flow e inputs):**
```html
@if (certificados.length > 0) {
  @for (certificado of certificados; track certificado.id) {
    <app-item-certificado
      [nomeAluno]="certificado.nome"
      [dataEmissao]="certificado.dataEmissao"
      [id]="certificado.id"
    />
  }
}

@if (certificados.length === 0) {
  <p>Nenhum certificado gerado</p>
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Componente filho precisa de dados do pai | Crie um @input para cada propriedade |
| Lista pode estar vazia | Use @if com length para exibir estado vazio |
| Repetindo componentes manualmente | Substitua por @for com track |
| Tipo do input nao bate com o dado | Corrija o tipo (ex: id era number mas deveria ser string) |
| Apos criar item o usuario fica na mesma tela | Redirecione para lista ou detalhe |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Componentes filho duplicados no HTML | `@for` iterando sobre a lista |
| Input sem valor padrao | `@input() nome: string = ''` |
| Apenas `@if` para lista cheia, sem else | `@if (length > 0)` + `@if (length === 0)` para estado vazio |
| `id: number = 0` quando backend retorna string | `id: string = ''` — verifique o tipo real |
| Limpar formulario sem redirecionar | `router.navigate` para pagina de resultado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
