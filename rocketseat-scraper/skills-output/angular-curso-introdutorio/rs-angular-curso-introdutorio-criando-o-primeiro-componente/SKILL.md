---
name: rs-angular-intro-criando-primeiro-componente
description: "Generates Angular components using CLI and enforces correct project structure. Use when user asks to 'create a component', 'generate Angular component', 'ng generate', 'setup navbar', or 'organize Angular project'. Applies rules: use ng g c with --skip-tests, organize in _components folder, reference via selector in app template, understand the 3 core files (HTML/TS/CSS). Make sure to use this skill whenever scaffolding Angular components or explaining component anatomy. Not for routing, services, directives, or advanced Angular patterns."
---

# Criando Componentes Angular com CLI

> Gere componentes Angular usando o CLI, organize-os em pasta `_components`, e referencie-os via selector no template principal.

## Rules

1. **Use `ng g c` para gerar componentes** — nunca crie os arquivos manualmente, porque o CLI ja configura selector, imports e referencia os arquivos HTML/CSS automaticamente
2. **Organize componentes em `_components/`** — crie a pasta com underline prefix dentro de `app/` para manter pastas customizadas no topo da listagem
3. **Navegue ate a pasta destino antes de gerar** — execute `ng g c` de dentro da pasta `_components/` para que o componente seja criado no local correto
4. **Use `--skip-tests` durante prototipagem** — pule arquivos `.spec.ts` quando testes unitarios nao forem o foco imediato
5. **Referencie componentes pelo selector** — cada componente tem um selector no formato `app-{nome}`, use essa tag no HTML do componente pai
6. **Entenda os 3 arquivos core** — HTML (template visual), TypeScript (logica e decorador @Component), CSS (estilos isolados do componente)

## How to write

### Gerar componente via CLI

```bash
# Navegue ate a pasta destino
cd src/app/_components

# Gere o componente (c = component, g = generate)
ng g c navbar --skip-tests
```

### Referenciar componente no template pai

```html
<!-- app.component.html -->
<app-navbar></app-navbar>
<p>Conteudo do app principal</p>
```

### Estrutura do arquivo TypeScript gerado

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',       // Tag HTML para usar este componente
  imports: [],                   // Bibliotecas/modulos importados
  templateUrl: './navbar.component.html',  // Referencia ao HTML
  styleUrl: './navbar.component.css'       // Referencia ao CSS
})
export class NavbarComponent {
  // Logica do componente aqui
}
```

## Example

**Before (estrutura desorganizada, componente manual):**
```
src/app/
├── app.component.ts
├── navbar.component.ts      # solto na raiz
├── navbar.component.html
└── navbar.component.css
```

**After (com esta skill aplicada):**
```
src/app/
├── _components/
│   └── navbar/
│       ├── navbar.component.ts
│       ├── navbar.component.html
│       └── navbar.component.css
├── app.component.ts
├── app.component.html
└── main.ts                  # bootstrapApplication(AppComponent)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo componente visual (navbar, footer, card) | `ng g c _components/{nome} --skip-tests` |
| Precisa exibir componente filho | Use `<app-{nome}></app-{nome}>` no HTML pai |
| Projeto em execucao com `ng serve` | Salve o arquivo — hot reload atualiza automaticamente |
| Prefixo do selector parece errado | Verifique `prefix` em `angular.json` |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Criar arquivos .ts/.html/.css manualmente | `ng g c {nome}` |
| Colocar componentes soltos em `app/` | Organize em `_components/` |
| Digitar o selector errado (`<navbar>`) | Use o selector completo (`<app-navbar>`) |
| Esquecer de importar no componente pai | Verifique `imports` no decorator do pai |
| Rodar `ng g c` da raiz do projeto | Navegue ate `_components/` primeiro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
