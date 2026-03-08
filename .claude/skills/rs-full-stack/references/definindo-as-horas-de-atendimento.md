---
name: rs-full-stack-definindo-horas-atendimento
description: "Enforces centralization of business configuration constants in dedicated utility files when building JavaScript/TypeScript applications. Use when user asks to 'define business hours', 'create constants file', 'centralize configuration', 'organize utils folder', or 'set opening hours'. Applies pattern: export arrays of valid values in a utils/ folder for easy maintenance. Make sure to use this skill whenever creating hardcoded business rules that may change. Not for environment variables, API config, or database-driven settings."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-architecture
  tags: [JavaScript, constants, utils, business-rules, modules, organization]
---

# Centralizar Constantes de Negocio em Arquivos Utilitarios

> Extraia valores de negocio (horarios, categorias, status) para arquivos dedicados em `utils/`, porque isso torna a manutencao trivial e o proposito obvio.

## Rules

1. **Crie uma pasta `utils/` dentro de `src/`** — agrupe arquivos de configuracao e helpers, porque facilita encontrar onde valores de negocio estao definidos
2. **Um arquivo por dominio de configuracao** — `opening-hours.js`, `service-categories.js`, nao um `constants.js` gigante, porque o nome do arquivo comunica o proposito
3. **Exporte constantes nomeadas, nao default** — `export const openingHours = [...]` porque permite import seletivo e autocomplete
4. **Use arrays para listas de valores validos** — arrays sao iteraveis, filtraveis e renderizaveis diretamente em UI
5. **Nomeie pelo conteudo de negocio** — `openingHours` nao `hours` ou `data` ou `config`, porque descreve o que o array contem

## How to write

### Arquivo de horarios de atendimento

```javascript
// src/utils/opening-hours.js
export const openingHours = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
]
```

### Consumindo a constante

```javascript
import { openingHours } from "../utils/opening-hours"

// Renderizar opcoes de horario
openingHours.map((hour) => <Option key={hour} value={hour}>{hour}</Option>)

// Filtrar horarios disponiveis
const availableHours = openingHours.filter(
  (hour) => !bookedHours.includes(hour)
)
```

## Example

**Before (valores hardcoded no componente):**

```javascript
function ScheduleForm() {
  const hours = ["09:00", "10:00", "11:00", "12:00"]
  // ...duplicado em outro componente
}
```

**After (centralizado em utils):**

```javascript
// src/utils/opening-hours.js
export const openingHours = ["09:00", "10:00", "11:00", "12:00"]

// src/components/ScheduleForm.js
import { openingHours } from "../utils/opening-hours"
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Valor de negocio que pode mudar (horarios, precos, categorias) | Extrair para `utils/{dominio}.js` |
| Valor tecnico que nao muda (regex, HTTP status codes) | Pode ficar inline ou em constants |
| Lista usada em mais de 1 arquivo | Obrigatorio extrair para utils |
| Lista usada em 1 lugar apenas | Extrair mesmo assim se for regra de negocio |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Hardcoded arrays repetidos em componentes | Arquivo centralizado em `utils/` |
| `export default [9, 10, 11, ...]` | `export const openingHours = ["09:00", ...]` |
| `constants.js` com 500 linhas | Um arquivo por dominio: `opening-hours.js` |
| `const data = [...]` | `const openingHours = [...]` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Import falha com "module not found" | Caminho relativo errado | Verifique o path: `../utils/opening-hours` |
| Constante nao atualiza em todos os lugares | Valor ainda hardcoded em algum componente | Busque duplicatas e substitua pelo import centralizado |
| Autocomplete nao sugere a constante | Usando `export default` em vez de named export | Use `export const openingHours = [...]` |
| Array vazio ao importar | Nome do export nao bate com o import | Confira que o nome exportado e o mesmo importado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao de configuracao e estrutura de pastas
- [code-examples.md](references/code-examples.md) — Exemplos expandidos com variacoes e cenarios reais