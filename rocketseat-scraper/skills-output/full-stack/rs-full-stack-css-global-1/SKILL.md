---
name: rs-full-stack-css-global-1
description: "Enforces CSS global reset and configuration best practices when setting up React projects, creating stylesheets, or configuring base styles. Use when user asks to 'create a React app', 'setup global styles', 'reset CSS defaults', 'configure base theme', or 'fix browser spacing issues'. Applies rules: always create global.css with universal reset, import it first in the entry component, separate global from component-specific styles. Make sure to use this skill whenever initializing a frontend project or troubleshooting inconsistent browser styling. Not for component-specific CSS, CSS-in-JS libraries, or Tailwind configuration."
---

# CSS Global — Reset e Configurações Globais

> Crie um arquivo global.css com resets e configurações base, importe-o sempre no topo do componente de entrada para garantir consistência visual entre navegadores.

## Rules

1. **Crie um arquivo `global.css` na pasta `src`** — porque navegadores aplicam margens e paddings padrão diferentes, e um reset global garante consistência
2. **Importe `global.css` sempre no topo do componente de entrada** — `import './global.css'` deve ser a primeira importação de CSS em `App.tsx`, porque importações posteriores sobrescrevem as anteriores
3. **Use seletor universal `*` para resetar margin e padding** — `* { margin: 0; padding: 0; }` remove espaçamentos padrão de todos os elementos
4. **Coloque estilos comuns no global, específicos em arquivos separados** — background-color da aplicação inteira vai no `global.css`; estilos de uma tela específica vão em seu próprio arquivo CSS
5. **Nunca importe o global.css depois de estilos específicos** — porque ele resetaria as configurações que você acabou de aplicar

## How to write

### Arquivo global.css

```css
* {
  margin: 0;
  padding: 0;
}

body {
  background-color: #121214;
}
```

### Importação no componente de entrada (App.tsx)

```tsx
import './global.css'  // SEMPRE primeira importação de CSS
import './App.css'     // Estilos específicos depois

export function App() {
  return <div>...</div>
}
```

## Example

**Before (problema de espaçamento do navegador):**
```tsx
// App.tsx — sem global.css
import './App.css'  // background-color: red não preenche toda a tela
// Resultado: borda branca ao redor da aplicação (margin/padding padrão do navegador)
```

**After (com global.css aplicado):**
```tsx
// App.tsx — com global.css no topo
import './global.css'  // reseta margens e define background base
import './App.css'     // estilos específicos aplicados sobre o reset

// Resultado: aplicação preenche toda a viewport sem espaçamentos indesejados
```

## Heuristics

| Situação | Faça |
|----------|------|
| Inicializando projeto React | Crie `src/global.css` com reset universal antes de qualquer estilo |
| Cor de fundo comum a toda aplicação | Defina no `body` dentro de `global.css` |
| Estilo específico de uma página/tela | Crie arquivo CSS separado para aquela tela |
| Fonte padrão da aplicação | Defina no `global.css` no `body` |
| Importação de múltiplos CSS | `global.css` sempre primeiro |

## Anti-patterns

| Nunca faça | Faça assim |
|------------|------------|
| Aplicar `background-color` repetido em cada componente | Definir uma vez no `global.css` no `body` |
| Importar `global.css` depois de outros CSS | Importar `global.css` como primeiro import de CSS |
| Colocar resets no `main.tsx` | Colocar resets no `App.tsx` (entry component de renderização) |
| Ignorar diferenças entre navegadores | Usar `* { margin: 0; padding: 0; }` como reset base |
| Misturar estilos globais e específicos no mesmo arquivo | Separar em `global.css` (comum) e arquivos específicos por tela |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre por que navegadores têm estilos padrão e a estratégia de reset
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações