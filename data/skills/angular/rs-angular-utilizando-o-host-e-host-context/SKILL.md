---
name: rs-angular-host-e-host-context
description: "Applies Angular :host and :host-context pseudo-class patterns when styling components. Use when user asks to 'style a component', 'create reusable component styles', 'add theme variations', 'style based on parent', or 'encapsulate component styles'. Enforces attribute-based variants over external styling, :host for self-styling, :host-context for parent-aware styling. Make sure to use this skill whenever creating or modifying Angular component styles. Not for global styles, CSS modules, or non-Angular frameworks."
---

# :host e :host-context no Angular

> Estilize a tag do componente a partir do proprio componente usando :host, e reaja ao contexto do elemento pai usando :host-context.

## Rules

1. **Use :host para estilizar a tag do componente** — `app-card`, `app-button` etc., porque referenciar a tag diretamente no CSS interno do componente nao funciona com encapsulamento
2. **Prefira atributos a classes no :host** — `:host([tema="primario"])` em vez de `:host(.ativo)`, porque atributos deixam claro que sao configuracoes do componente, nao classes globais
3. **Controle estilos repetitivos dentro do componente** — se o componente sempre tera o mesmo width/margin em todos os lugares, use :host em vez de repetir no componente pai, porque centraliza a mudanca em um unico lugar
4. **Use :host-context para reagir ao pai** — `:host-context(.tema-escuro)` aplica estilos quando o elemento pai tem aquela classe, porque permite theming sem inputs extras
5. **Mantenha margin/width no componente pai quando variar** — se cada instancia precisa de layout diferente, o pai deve controlar, porque o componente nao sabe onde sera posicionado
6. **Nao sobrecarregue o :host com logica complexa** — mantenha variacoes simples e previsíveis, porque componentes com muitas variacoes via :host ficam dificeis de manter

## How to write

### :host basico

```typescript
@Component({
  styles: [`
    :host {
      display: block;
      padding: 16px;
      border: 1px solid #ccc;
      border-radius: 8px;
    }

    :host:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      transform: translateY(-2px);
    }
  `]
})
```

### Variacoes por atributo

```typescript
// No componente:
styles: [`
  :host([tema="primario"]) {
    background-color: #3498db;
    color: white;
  }

  :host([tema="secundario"]) {
    background-color: #2ecc71;
    color: white;
  }

  :host([tamanho="grande"]) {
    font-size: 1.5rem;
    padding: 24px;
  }

  :host([desabilitado]) {
    opacity: 0.5;
    pointer-events: none;
  }
`]
```

```html
<!-- No template pai: -->
<app-card tema="primario" tamanho="grande"></app-card>
<app-card tema="secundario"></app-card>
<app-card desabilitado></app-card>
```

### :host-context para theming pelo pai

```typescript
styles: [`
  :host-context(.tema-escuro) {
    background-color: #333;
    color: #eee;
  }
`]
```

```html
<!-- No template pai: -->
<div class="tema-escuro">
  <app-card></app-card>  <!-- recebe estilos escuros -->
</div>
<div class="tema-claro">
  <app-card></app-card>  <!-- nao recebe -->
</div>
```

## Example

**Before (estilos controlados pelo pai — repetitivo):**

```css
/* parent.component.css */
app-card {
  display: block;
  padding: 16px;
  border: 1px solid #ccc;
}
/* Repetido em CADA componente pai que usa app-card */
```

**After (estilos controlados pelo proprio componente):**

```typescript
// card.component.ts
@Component({
  selector: 'app-card',
  styles: [`
    :host {
      display: block;
      padding: 16px;
      border: 1px solid #ccc;
    }
    :host([tema="primario"]) {
      background-color: #3498db;
      color: white;
    }
    :host-context(.tema-escuro) {
      background-color: #333;
      color: #eee;
    }
  `]
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Componente sempre tem mesmo estilo base | Use :host para width, padding, display |
| Componente tem variacoes visuais (primario/secundario) | Use :host([atributo="valor"]) |
| Estilo depende do contexto do pai (tema escuro/claro) | Use :host-context(.classe-do-pai) |
| Cada instancia precisa de margin/posicao diferente | Deixe o pai controlar via CSS externo |
| Precisa alternar estilo dinamicamente | Use classe com diretiva + :host(.classe) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Referenciar a propria tag no CSS interno (`app-card { }`) | `:host { }` |
| Repetir estilos base em cada componente pai | `:host { }` com estilos centralizados |
| Usar :host(.classe-global) para variacoes | `:host([atributo="valor"])` com atributos |
| Criar dezenas de variacoes :host no mesmo componente | Extrair em componentes separados |
| Estilizar a tag filha a partir do pai para layout fixo | `:host { }` quando o layout e sempre igual |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
