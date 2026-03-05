---
name: rs-angular-estrutura-arquivos-componente
description: "Enforces Angular component file structure conventions when creating or organizing components. Use when user asks to 'create a component', 'generate component', 'organize Angular files', 'connect template to TypeScript', or 'structure Angular project'. Applies rules: keep all component files in same folder, maintain consistent naming across selector/class/filename, never separate template or styles into different folders, use @Component decorator correctly. Make sure to use this skill whenever scaffolding or reviewing Angular components. Not for routing, services, pipes, or module configuration."
---

# Estrutura de Arquivos do Componente Angular

> Todo componente Angular mantém seus arquivos (HTML, CSS, TS, spec) na mesma pasta, com nomenclatura consistente entre selector, classe e nome de arquivo.

## Rules

1. **Mantenha todos os arquivos na mesma pasta** — HTML, CSS, TS e spec ficam juntos em `nome-componente/`, porque separar em pastas diferentes torna impossível navegar rapidamente pelo componente
2. **Nunca altere a nomenclatura padrão do Angular** — se o componente é `meu-botao`, o selector é `app-meu-botao`, a classe é `MeuBotaoComponent`, o arquivo é `meu-botao.component.ts`, porque inconsistência entre esses nomes dificulta manutenção e busca no codebase
3. **Use `ng generate component` para criar componentes** — `ng g c nome-componente`, porque o CLI garante a estrutura correta e registra o componente automaticamente
4. **Conecte eventos do template ao TypeScript via event binding** — `(click)="metodo()"` no HTML chama o método declarado na classe, porque essa é a ponte entre template e lógica
5. **O decorator @Component é obrigatório** — importado de `@angular/core`, recebe `selector`, `imports`, `templateUrl` e `styleUrl`, porque é ele que registra a classe como componente Angular
6. **Em standalone components, imports vão no decorator** — módulos, pipes, diretivas e outros componentes entram no array `imports` do `@Component`, porque não há módulo externo para declará-los

## How to write

### Gerar componente via CLI

```bash
ng generate component meu-botao
# Gera:
# src/app/meu-botao/
#   meu-botao.component.ts
#   meu-botao.component.html
#   meu-botao.component.css
#   meu-botao.component.spec.ts
```

### Estrutura do decorator @Component

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-meu-botao',
  imports: [],
  templateUrl: './meu-botao.component.html',
  styleUrl: './meu-botao.component.css'
})
export class MeuBotaoComponent {
  limpar() {
    console.log('método limpar');
  }

  filtrar() {
    console.log('método filtrar');
  }
}
```

### Event binding no template

```html
<button class="btn btn-flat" (click)="limpar()">Limpar</button>
<button class="btn btn-filled" (click)="filtrar()">Filtrar</button>
```

### Referenciar componente em outro template

```html
<!-- Auto-fechamento -->
<app-meu-botao />

<!-- Com tag de fechamento -->
<app-meu-botao></app-meu-botao>
```

## Example

**Before (estrutura desorganizada):**
```
src/app/
  templates/
    meu-botao.component.html    # Template em pasta separada
  styles/
    meu-botao.component.css     # CSS em pasta separada
  meu-botao.component.ts        # TS solto na raiz
```

**After (estrutura correta):**
```
src/app/
  meu-botao/
    meu-botao.component.ts
    meu-botao.component.html
    meu-botao.component.css
    meu-botao.component.spec.ts
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Criar componente novo | Sempre usar `ng g c nome` pelo terminal |
| Template muito pequeno (1 linha) | Pode usar `template:` inline no decorator em vez de `templateUrl:` |
| CSS muito pequeno | Pode usar `styles:` inline no decorator em vez de `styleUrl:` |
| Componente precisa de outro componente | Adicionar ao array `imports` do decorator (standalone) |
| Versão antiga do Angular (sem standalone) | `imports` não existe no decorator — usar módulos |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Selector `app-botao` com classe `MeuBotaoComponent` e arquivo `meu-botao.component.ts` | Manter consistente: `app-meu-botao` / `MeuBotaoComponent` / `meu-botao.component.ts` |
| Template HTML em pasta `templates/` separada | Template na mesma pasta do componente |
| CSS em pasta `styles/` separada | CSS na mesma pasta do componente |
| Componente sem `@Component` decorator | Sempre declarar `@Component` importado de `@angular/core` |
| Arquivo não salvo (bolinha no VS Code) | Sempre salvar antes de testar — alterações não salvas não refletem no navegador |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
