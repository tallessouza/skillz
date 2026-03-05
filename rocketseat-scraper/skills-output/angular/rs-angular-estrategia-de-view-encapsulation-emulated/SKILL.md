---
name: rs-angular-view-encapsulation-emulated
description: "Enforces Angular ViewEncapsulation.Emulated best practices when writing component styles. Use when user asks to 'style a component', 'fix CSS isolation', 'create Angular component', or 'encapsulate styles'. Applies rules: never reference scope attributes in selectors, never style child component elements from parent, use inputs for child styling, keep Emulated as default. Make sure to use this skill whenever generating Angular component styles or debugging CSS leaking between components. Not for global styles strategy, Shadow DOM native, or CSS architecture beyond Angular encapsulation."
---

# View Encapsulation Emulated no Angular

> Mantenha ViewEncapsulation.Emulated como padrao e nunca manipule atributos de escopo gerados pelo Angular.

## Rules

1. **Nunca defina encapsulation explicitamente se for Emulated** — Emulated ja e o padrao, declarar explicitamente so adiciona ruido ao codigo, porque o Angular assume Emulated quando nenhum valor e fornecido
2. **Nunca crie seletores CSS usando atributos de escopo** — proibido `p[_ngcontent-xyz-c71]` no `styles.css`, porque atributos mudam ao refatorar componentes e sao impossiveis de rastrear no codebase
3. **Nunca estilize elementos de componentes filhos a partir do pai** — o seletor `p` no pai so afeta paragrafos do proprio template, nao dos filhos, porque o Angular adiciona atributos de escopo diferentes para cada componente
4. **Use inputs para mudar estilos de filhos** — passe dados via `@Input()` e aplique com `[style.x]` ou `[class.x]` dentro do filho, porque isso mantem o encapsulamento e a manutenibilidade
5. **Estilos globais no styles.css afetam todos os componentes** — seletores globais nao possuem atributos de escopo, porque o Angular nao processa o arquivo global com encapsulacao
6. **Atributos de escopo so aparecem quando ha estilos** — se o componente nao tem CSS, o Angular nao adiciona `_nghost` nem `_ngcontent`, porque a otimizacao evita atributos desnecessarios

## How to write

### Componente com estilos encapsulados (padrao)

```typescript
// NAO declare encapsulation: ViewEncapsulation.Emulated — ja e o padrao
@Component({
  selector: 'app-product-card',
  template: `<p>Product card works!</p>`,
  styles: [`
    p { font-weight: bold; }
  `]
})
export class ProductCardComponent {}
```

### Estilizacao de filho via Input

```typescript
// Componente filho recebe instrucao de estilo via input
@Component({
  selector: 'app-custom-button',
  template: `<button [style.color]="textColor">Click</button>`
})
export class CustomButtonComponent {
  @Input() textColor = 'inherit';
}

// Componente pai passa o valor
@Component({
  selector: 'app-product-card',
  template: `<app-custom-button [textColor]="'red'" />`
})
export class ProductCardComponent {}
```

## Example

**Before (violacao de encapsulamento):**
```css
/* styles.css — ERRADO: usando atributo de escopo */
p[_ngcontent-abc-c71] {
  color: red;
}
```

**After (respeitando encapsulamento):**
```typescript
// Estilo dentro do proprio componente
@Component({
  selector: 'app-product-card',
  styles: [`p { color: red; }`],
  template: `<p>Product card works!</p>`
})
export class ProductCardComponent {}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Estilo so para este componente | Coloque no `styles` ou `styleUrl` do componente |
| Estilo para toda a aplicacao | Coloque no `styles.css` global |
| Mudar estilo de componente filho | Passe `@Input()` e use StyleBinding/ClassBinding no filho |
| Componente sem nenhum estilo | Nao faca nada — Angular nao adicionara atributos de escopo |
| Precisa de ViewEncapsulation.None ou ShadowDom | Tenha certeza absoluta do que esta fazendo — 99.99% dos casos usam Emulated |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `p[_ngcontent-xyz-c71] { color: red }` no styles.css | `p { color: red }` no styles do componente |
| `encapsulation: ViewEncapsulation.Emulated` explicito | Omita a propriedade — ja e o padrao |
| Seletor no pai tentando atingir elementos do filho | `@Input()` + StyleBinding no filho |
| `ViewEncapsulation.None` para "resolver" vazamento de estilo | Investigue por que o estilo nao esta aplicando e use Emulated |
| Inspecionar atributo de escopo e copiar para seletor | Estilize dentro do proprio componente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
