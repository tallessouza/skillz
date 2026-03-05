---
name: rs-devops-configurando-primeiro-workflow
description: "Generates GitHub Actions workflow YAML files when user asks to 'create a pipeline', 'setup CI/CD', 'configure GitHub Actions', 'write a workflow', or 'add CI to my repo'. Enforces correct YAML structure with name, jobs, runs-on, steps, and checkout action. Make sure to use this skill whenever creating or editing .github/workflows/ files. Not for Docker configuration, deployment scripts, or non-GitHub CI platforms."
---

# Configurando Primeiro Workflow no GitHub Actions

> Todo workflow comeca com a estrutura minima: name, on, jobs com runner e steps, sempre com identacao de 2 espacos.

## Rules

1. **Crie o arquivo dentro de `.github/workflows/`** — `ci.yaml` ou nome descritivo, porque o GitHub Actions so detecta workflows nesse path exato
2. **Sempre declare `name:` no topo** — identifica o workflow na aba Actions, especialmente quando existem multiplos workflows
3. **Sempre declare `on:` com triggers** — sem a propriedade `on`, o workflow falha com erro "No event triggers defined in on", porque o GitHub nao sabe quando executar
4. **Identacao obrigatoria de 2 espacos** — YAML e orientado por identacao; recuo errado causa erro de parse silencioso
5. **Todo job precisa de `runs-on:`** — especifica o runner (ex: `ubuntu-latest`), porque e a maquina que executa os steps
6. **Primeiro step deve ser checkout** — use `actions/checkout@v4`, porque sem checkout o runner nao tem acesso ao codigo do repositorio
7. **Steps executam em serie** — a ordem dos steps importa; cada step so roda apos o anterior completar

## How to write

### Estrutura minima de workflow

```yaml
name: CI

on:
  push:
    branches: [main]

jobs:
  build:
    name: Build and Push
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

### Multiplos jobs

```yaml
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

## Example

**Before (erro comum — sem `on:`):**
```yaml
name: CI

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```
Resultado: `No event triggers defined in on` — workflow falha.

**After (com trigger configurado):**
```yaml
name: CI

on:
  push:
    branches: [main]

jobs:
  build:
    name: Build and Push
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Repositorio novo precisa de CI | Crie `.github/workflows/ci.yaml` com estrutura minima |
| Multiplos workflows no repo | Use `name:` descritivo em cada um para diferenciar na aba Actions |
| Precisa do codigo no runner | Sempre adicione `actions/checkout@v4` como primeiro step |
| Repositorio privado | Atencao a cota de minutos do GitHub Actions |
| Job precisa de OS especifico | Troque `ubuntu-latest` pelo runner adequado |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Omitir `on:` no workflow | Sempre declare `on:` com pelo menos um trigger |
| Identacao com tabs ou 4 espacos | Sempre 2 espacos no YAML |
| Esquecer checkout antes de usar codigo | `actions/checkout@v4` como primeiro step |
| Criar workflow fora de `.github/workflows/` | Sempre dentro de `.github/workflows/` |
| Omitir `runs-on:` no job | Todo job precisa de um runner declarado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
