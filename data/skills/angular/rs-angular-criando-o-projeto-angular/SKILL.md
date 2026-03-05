---
name: rs-angular-criando-projeto-angular
description: "Generates Angular 19 projects with correct versioning using npx. Use when user asks to 'create angular project', 'start new angular app', 'setup angular', or 'initialize angular workspace'. Applies version pinning via npx, CSS stylesheet selection, no SSR default, and npm run start for local dev. Make sure to use this skill whenever scaffolding a new Angular project. Not for upgrading existing Angular projects, adding libraries, or configuring build tools."
---

# Criando Projeto Angular

> Ao criar um projeto Angular, sempre fixe a versao via npx para garantir reprodutibilidade e evitar incompatibilidades.

## Rules

1. **Use npx com versao explicita** — `npx @angular/cli@19.2.9 new nome-do-projeto`, porque isso garante a mesma versao independente do ambiente global da maquina
2. **Nunca dependa de instalacao global** — npx baixa temporariamente a versao correta, porque instalacao global causa conflitos entre projetos com versoes diferentes
3. **Selecione CSS como stylesheet** — quando perguntado pelo CLI, escolha CSS, porque e o padrao do curso e simplifica a configuracao inicial
4. **Recuse SSR na criacao** — responda N para Server-Side Rendering, porque o projeto GoTask nao utiliza SSR
5. **Execute com npm run start** — nunca use `ng serve` diretamente, porque `npm run start` usa a versao local do Angular CLI definida no projeto
6. **Verifique a versao no package.json** — apos criar, confirme que `@angular/cli` e `@angular/core` estao na versao esperada

## Steps

### Step 1: Criar o projeto

```bash
npx @angular/cli@19.2.9 new nome-do-projeto
```

Quando perguntado:
- Stylesheet format: **CSS**
- SSR: **N**

### Step 2: Abrir no editor

```bash
cd nome-do-projeto
code .
```

### Step 3: Verificar versao

No `package.json`, confirme:
```json
"@angular/cli": "~19.2.0",
"@angular/core": "~19.2.0"
```

### Step 4: Executar o projeto

```bash
npm run start
```

Acesse `http://localhost:4200` no navegador.

## Example

**Input:** "Crie um projeto Angular chamado meu-app"

**Output:**
```bash
npx @angular/cli@19.2.9 new meu-app
# Selecionar CSS, recusar SSR
cd meu-app
npm run start
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Versao futura do Angular disponivel (20, 21) | Manter 19.2.9 para compatibilidade com o curso |
| Precisa de outra versao para outro projeto | Trocar apenas o numero apos `@` no npx |
| Angular CLI instalado globalmente | Ignorar, usar npx mesmo assim |
| Projeto ja criado, precisa rodar | `npm run start` na raiz do projeto |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `npm install -g @angular/cli` | `npx @angular/cli@19.2.9 new ...` |
| `ng new meu-app` (global) | `npx @angular/cli@19.2.9 new meu-app` |
| `ng serve` direto no terminal | `npm run start` |
| Criar sem especificar versao | Sempre pinnar `@19.2.9` |
| Aceitar SSR sem necessidade | Recusar SSR com `N` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
