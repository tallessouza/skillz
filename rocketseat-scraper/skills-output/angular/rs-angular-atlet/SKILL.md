---
name: rs-angular-atlet
description: "Applies Angular @let template variable patterns when writing Angular templates or components. Use when user asks to 'create a component', 'write a template', 'loop over data', 'display object properties', or 'organize template logic'. Enforces local variable extraction with @let to avoid repeated property access chains and improve template readability. Make sure to use this skill whenever generating Angular templates that access nested objects or reuse computed values. Not for TypeScript class logic, services, or RxJS operator chains."
---

# @let — Variáveis Locais em Templates Angular

> Extraia valores repetidos ou computados em variáveis locais com @let para manter templates legíveis e organizados.

## Rules

1. **Use @let para valores reutilizados** — se um valor aparece mais de uma vez no template, extraia para um @let, porque evita repetição e centraliza a mudança em um único ponto
2. **Sempre termine com ponto e vírgula** — `@let quantidade = getValue();` é obrigatório, sem ele o Angular gera erro de compilação
3. **Nunca reatribua um @let manualmente** — o Angular reatribui automaticamente no Change Detection; tentativas manuais como `quantidadeItens = 1` dentro do template não funcionam
4. **Use @let para desempacotar objetos aninhados** — `@let endereco = pessoa.endereco;` evita cadeias repetitivas como `pessoa.endereco.rua`, `pessoa.endereco.numero`
5. **Combine @let com @if para null-checking** — crie o @let e depois use @if para verificar se o valor existe antes de acessar propriedades
6. **Prefira @let a chamadas repetidas de método** — uma chamada ao método armazenada em @let é mais legível que espalhar `pessoas.length` em múltiplos pontos

## How to write

### Variável computada reutilizável

```html
@let quantidadeItens = pegarQuantidadeDePessoas();

@if (quantidadeItens) {
  <h1>Existem itens! Quantos? {{ quantidadeItens }}</h1>
} @else {
  <h1>Sem itens</h1>
}
```

### Desempacotando objetos aninhados dentro de loops

```html
@for (pessoa of pessoas; track pessoa.id) {
  <div>
    <p>{{ pessoa.nome }}, {{ pessoa.idade }}</p>

    @let enderecoPessoa = pessoa.endereco;

    @if (enderecoPessoa) {
      <p>{{ enderecoPessoa.rua }}, {{ enderecoPessoa.numero }}</p>
    }
  </div>
}
```

### Com AsyncPipe e Observables

```html
@let user = users$ | async;

@if (user) {
  <span>{{ user.name }}</span>
  <img [src]="user.photo" />
}
```

## Example

**Before (acesso repetitivo sem @let):**

```html
@if (pessoas.length) {
  <h1>Existem {{ pessoas.length }} itens</h1>
}
<button (click)="removerPessoa()">Remover ({{ pessoas.length }})</button>

@for (pessoa of pessoas; track pessoa.id) {
  <p>{{ pessoa.endereco.rua }}, {{ pessoa.endereco.numero }}</p>
}
```

**After (com @let aplicado):**

```html
@let quantidadeItens = pegarQuantidadeDePessoas();

@if (quantidadeItens) {
  <h1>Existem {{ quantidadeItens }} itens</h1>
} @else {
  <h1>Sem itens</h1>
}

<button (click)="removerPessoa()">Remover</button>

@for (pessoa of pessoas; track pessoa.id) {
  <div>
    <p>{{ pessoa.nome }}, {{ pessoa.idade }}</p>

    @let enderecoPessoa = pessoa.endereco;

    @if (enderecoPessoa) {
      <p>{{ enderecoPessoa.rua }}, {{ enderecoPessoa.numero }}</p>
    }
  </div>
}
```

## Heuristics

| Situação | Ação |
|----------|------|
| Mesmo valor usado 2+ vezes no template | Extrair para @let |
| Acesso a propriedade aninhada (2+ níveis) | Criar @let intermediário |
| Retorno de método usado em múltiplos pontos | Armazenar em @let |
| Observable consumido no template | `@let valor = obs$ \| async;` |
| Template HTML crescendo (100+ linhas) | Componentizar antes de adicionar mais @let |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `pessoa.endereco.rua` repetido 3x | `@let end = pessoa.endereco;` depois `end.rua` |
| `pessoas.length` em 4 lugares diferentes | `@let qtd = pessoas.length;` |
| `@let x = valor` (sem ponto e vírgula) | `@let x = valor;` |
| `@let x = valor; x = novoValor;` (reatribuição) | Deixe o Change Detection atualizar |
| Componente com 200+ linhas de template | Quebre em subcomponentes menores |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
