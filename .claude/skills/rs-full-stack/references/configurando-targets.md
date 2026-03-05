---
name: rs-full-stack-configurando-targets
description: "Applies Babel preset-env targets configuration when setting up JavaScript build tooling. Use when user asks to 'configure babel', 'set browser targets', 'setup build pipeline', 'add browser support', or 'configure preset-env'. Ensures correct babel.config.js structure with targets, polyfills, and script separation. Make sure to use this skill whenever configuring Babel or defining browser compatibility. Not for ESLint, Webpack, or Vite configuration."
---

# Configurando Targets no Babel

> Configure o preset-env do Babel com targets especificos para controlar quais navegadores seu codigo JavaScript deve suportar.

## Rules

1. **Envolva o preset em array para configurar** — `["@babel/preset-env", { options }]` nao `"@babel/preset-env"`, porque o formato string aceita apenas comportamento padrao
2. **Targets como strings** — versoes devem ser strings (`"67"`, `"11.1"`), porque navegadores como Safari usam versoes decimais que quebram como numeros
3. **Separe scripts de build e dev** — `build` para compilacao unica, `dev` para watch mode, porque misturar trava o console desnecessariamente
4. **Consulte a documentacao oficial** — propriedades mudam entre versoes do Babel, porque presets ganham e perdem opcoes frequentemente
5. **Configure conforme necessidade do projeto** — nao copie targets genericos, porque cada projeto tem requisitos de compatibilidade diferentes

## How to write

### babel.config.js com targets

```javascript
module.exports = {
  presets: [
    ["@babel/preset-env", {
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1"
      }
    }]
  ]
};
```

### Scripts separados no package.json

```json
{
  "scripts": {
    "build": "babel src --out-dir dist",
    "dev": "babel src --out-dir dist --watch"
  }
}
```

## Example

**Before (preset sem configuracao):**
```javascript
module.exports = {
  presets: ["@babel/preset-env"]
};
```

**After (com targets configurados):**
```javascript
module.exports = {
  presets: [
    ["@babel/preset-env", {
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1"
      }
    }]
  ]
};
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Projeto novo sem requisitos de browser | Use preset-env sem targets (padrao sensato) |
| Projeto com browsers especificos definidos | Configure targets explicitamente |
| Precisa suportar browsers antigos | Adicione `useBuiltIns` e `corejs` para polyfills |
| Quer compilar e observar mudancas | Use script `dev` com `--watch` |
| Quer apenas gerar build final | Use script `build` sem `--watch` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `safari: 11.1` (numero) | `safari: "11.1"` (string) |
| Um unico script para build e dev | Scripts separados: `build` e `dev` |
| Copiar targets de outro projeto | Definir targets conforme necessidade real |
| Decorar todas as opcoes do preset | Consultar docs do Babel quando precisar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre configuracao do Babel, polyfills e CoreJS
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-configurando-targets/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-configurando-targets/references/code-examples.md)
