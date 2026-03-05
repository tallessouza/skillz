---
name: rs-angular-layout-mensagem-vazio
description: "Applies empty state message patterns when building Angular components that display lists. Use when user asks to 'create empty state', 'show no results message', 'add placeholder when list is empty', or 'build task list component'. Enforces proper structure: wrapper div with left border accent, styled paragraph, utility classes for spacing and typography. Make sure to use this skill whenever creating list components that need a fallback message for empty data. Not for loading states, error messages, or toast notifications."
---

# Layout de Mensagem de Estado Vazio (Empty State)

> Ao criar componentes de lista, sempre inclua um elemento visual de estado vazio com bordas de destaque e tipografia adequada.

## Rules

1. **Coloque o empty state no mesmo nivel do conteudo da lista** — nao dentro de nenhuma div filha, mas no final do template do componente de lista, porque facilita o controle de visibilidade com `@if` ou `*ngIf`
2. **Use estrutura div > p** — a div e o container visual com fundo e borda, o paragrafo contem o texto, porque separa estilo estrutural do conteudo textual
3. **Aplique borda lateral como indicador visual** — `border-left-4` com cor solida cria uma faixa lateral que guia o olho do usuario, porque empty states precisam ser visiveis sem serem agressivos
4. **Use cores neutras e suaves** — fundo cinza claro (`#FAFAFA`), texto cinza medio (`#9CA3AF`), porque a mensagem e informativa, nao um alerta
5. **Mantenha padding assimetrico** — mais padding horizontal que vertical (`py-3 px-5`), porque texto longo precisa de respiro lateral

## How to write

### Estrutura do empty state

```html
<!-- No final do template do componente de lista -->
<div class="bg-[#FAFAFA] rounded-sm py-3 px-5 border-l-4 border-black">
  <p class="font-semibold text-lg text-[#9CA3AF]">
    Nenhuma tarefa disponível no momento.
  </p>
</div>
```

### Com condicional (versao dinamica)

```html
@if (tasks.length === 0) {
  <div class="bg-[#FAFAFA] rounded-sm py-3 px-5 border-l-4 border-black">
    <p class="font-semibold text-lg text-[#9CA3AF]">
      Nenhuma tarefa disponível no momento.
    </p>
  </div>
}
```

## Example

**Before (sem empty state):**
```html
<!-- task-list-section.component.html -->
<div class="task-list">
  @for (task of tasks; track task.id) {
    <app-task-card [task]="task" />
  }
</div>
<!-- Lista vazia = tela em branco, usuario confuso -->
```

**After (com empty state):**
```html
<!-- task-list-section.component.html -->
<div class="task-list">
  @for (task of tasks; track task.id) {
    <app-task-card [task]="task" />
  }
</div>

@if (tasks.length === 0) {
  <div class="bg-[#FAFAFA] rounded-sm py-3 px-5 border-l-4 border-black">
    <p class="font-semibold text-lg text-[#9CA3AF]">
      Nenhuma tarefa disponível no momento.
    </p>
  </div>
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Lista sempre comeca vazia | Comece com empty state visivel, esconda ao adicionar primeiro item |
| Lista carrega do servidor | Mostre skeleton/loading primeiro, depois empty state se vazio |
| Multiplas listas na pagina | Cada lista tem seu proprio empty state com texto contextual |
| Texto do empty state | Seja especifico: "Nenhuma tarefa disponivel" > "Nada aqui" |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Deixar lista vazia sem feedback visual | Adicionar div com mensagem de empty state |
| Colocar empty state dentro de um loop `@for` | Colocar fora do loop, com `@if` condicional |
| Usar cores vibrantes/alertas para empty state | Usar cores neutras e suaves (cinza claro) |
| Texto generico "Sem dados" | Texto especifico ao contexto "Nenhuma tarefa disponivel no momento" |
| Aninhar empty state dentro de divs filhas | Manter no nivel raiz do template do componente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
