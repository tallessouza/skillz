---
name: rs-full-stack-informacoes-da-aplicacao
description: "Enforces proper package.json metadata configuration when setting up Node.js projects. Use when user asks to 'create a project', 'init package.json', 'setup node app', or 'configure project metadata'. Applies rules: always include name, description, and author fields before scripts. Make sure to use this skill whenever initializing or reviewing package.json files. Not for dependency management, scripts configuration, or versioning strategies."
---

# Metadados do package.json

> Ao criar ou revisar um package.json, sempre incluir metadados do projeto (name, description, author) antes da secao de scripts.

## Rules

1. **Sempre defina `name`** — identifica o projeto em repositorios e registros, porque sem nome o projeto e anonimo no GitHub e npm
2. **Sempre defina `description`** — descreve o proposito do projeto em uma frase, porque facilita a descoberta e compreensao por outros desenvolvedores
3. **Sempre defina `author`** — identifica o responsavel pelo projeto, porque da credibilidade e ponto de contato
4. **Metadados antes de `scripts`** — coloque name, description e author no topo do package.json, antes da secao scripts, porque segue a convencao de leitura top-down (identidade primeiro, comportamento depois)
5. **Nome em kebab-case** — use `hair-day` nao `Hair Day` ou `hairDay`, porque o campo name do package.json segue convencao npm de lowercase com hifens

## How to write

### package.json com metadados completos

```json
{
  "name": "hair-day",
  "description": "Aplicacao web de agendamento para corte de cabelo",
  "author": "Seu Nome",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {}
}
```

## Example

**Before (package.json sem metadados):**
```json
{
  "scripts": {
    "dev": "vite"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}
```

**After (com metadados do projeto):**
```json
{
  "name": "hair-day",
  "description": "Aplicacao web de agendamento para corte de cabelo",
  "author": "Rodrigo Goncalves",
  "scripts": {
    "dev": "vite"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo projeto criado com `npm init -y` | Preencha name, description e author imediatamente |
| Projeto sera publicado no GitHub | Garanta que description reflete o proposito real |
| Projeto open source | Adicione tambem `license` e `repository` |
| Monorepo com multiplos packages | Cada package.json deve ter seu proprio name unico |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `"name": "my-app"` (generico) | `"name": "hair-day"` (nome real do projeto) |
| package.json sem description | `"description": "Aplicacao web de agendamento para corte de cabelo"` |
| package.json sem author | `"author": "Seu Nome"` |
| Metadados depois de dependencies | Metadados no topo, antes de scripts |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que metadados importam e como plataformas os utilizam
- [code-examples.md](references/code-examples.md) — Exemplos expandidos de package.json para diferentes tipos de projeto