---
name: rs-angular-intro-ciclo-vida-ngoninit
description: "Applies Angular component lifecycle patterns focusing on ngOnInit when writing Angular components. Use when user asks to 'create a component', 'initialize data', 'fetch on load', 'component lifecycle', or 'ngOnInit'. Enforces correct OnInit implementation, this-referencing, and distinguishes @if control flow from [hidden] binding. Make sure to use this skill whenever creating Angular components that need initialization logic. Not for RxJS subscriptions, ngOnDestroy cleanup, or change detection strategies."
---

# Ciclo de Vida de Componente — NgOnInit

> Toda logica de inicializacao de um componente Angular pertence ao ngOnInit, nunca ao constructor.

## Rules

1. **Implemente a interface OnInit** — `export class MyComponent implements OnInit`, porque o TypeScript valida o contrato e previne erros de assinatura
2. **Use ngOnInit para carregar dados iniciais** — chamadas a APIs, inicializacao de estado, porque o constructor deve ficar limpo (injecao de dependencias apenas)
3. **Referencie membros da classe com this** — `this.mensagem()` nao `mensagem()`, porque sem this o Angular nao encontra o metodo/atributo da classe e a aplicacao quebra silenciosamente
4. **Isole logica em funcoes privadas** — chame funcoes dentro do ngOnInit ao inves de colocar logica diretamente, porque melhora testabilidade e legibilidade
5. **Use @if para controlar inicializacao** — `@if (condition) { <component/> }` impede que o componente seja criado, porque o ngOnInit so executa se o componente for de fato instanciado
6. **Use [hidden] apenas para esconder visualmente** — `[hidden]="!show"` esconde mas o componente JA inicializou, porque o DOM e criado e o ngOnInit executa normalmente

## How to write

### Implementacao basica do OnInit

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  ngOnInit(): void {
    this.carregarDadosIniciais();
  }

  private carregarDadosIniciais(): void {
    // chamada a API ou inicializacao de estado
  }
}
```

### Controlar inicializacao com @if (Angular 17+)

```html
<!-- Componente SO inicializa se exibeNavbar for true -->
@if (exibeNavbar) {
  <app-navbar />
}
```

### Esconder sem impedir inicializacao com [hidden]

```html
<!-- Componente inicializa SEMPRE, apenas fica invisivel -->
<app-navbar [hidden]="!exibeNavbar" />
```

## Example

**Before (logica direto no ngOnInit, sem this):**
```typescript
export class NavbarComponent implements OnInit {
  ngOnInit(): void {
    console.log('inicializou');
    // 20 linhas de logica aqui dentro
    mensagem(); // ERRO: faltou this
  }

  mensagem(): void {
    console.log('navbar');
  }
}
```

**After (com this, logica isolada):**
```typescript
export class NavbarComponent implements OnInit {
  ngOnInit(): void {
    this.mensagem();
  }

  private mensagem(): void {
    console.log('Meu componente navbar inicializou');
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa carregar dados ao abrir tela | Coloque a chamada no ngOnInit |
| Componente nao deve existir condicionalmente | Use `@if` no template pai |
| Componente deve existir mas ficar oculto | Use `[hidden]` binding |
| Versao Angular < 17 | Use `*ngIf` com CommonModule importado |
| Logica de inicializacao > 3 linhas | Extraia para metodo privado |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-----------------|
| Logica de API no `constructor` | Logica de API no `ngOnInit` |
| `mensagem()` sem this dentro da classe | `this.mensagem()` |
| `*ngIf` sem importar CommonModule | Importe CommonModule ou use `@if` |
| `[hidden]` quando quer impedir inicializacao | `@if` para controlar criacao |
| 30 linhas direto no ngOnInit | Metodos privados chamados do ngOnInit |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
