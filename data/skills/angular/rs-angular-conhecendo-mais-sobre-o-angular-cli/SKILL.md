---
name: rs-angular-conhecendo-angular-cli
description: "Applies Angular CLI commands and patterns when scaffolding Angular projects. Use when user asks to 'create a component', 'generate a service', 'scaffold Angular', 'ng generate', or 'setup Angular project'. Covers ng generate with flags, path targeting, global vs local CLI usage, and npm run ng fallback. Make sure to use this skill whenever generating Angular artifacts or setting up Angular project structure. Not for Angular template syntax, data binding, routing logic, or component architecture decisions."
---

# Angular CLI — Geracao de Artefatos

> Use o Angular CLI para gerar componentes, services e outros artefatos ao inves de criar arquivos manualmente.

## Rules

1. **Use `ng generate` para criar artefatos** — `ng generate component nome` nao crie arquivos manualmente, porque o CLI gera a estrutura completa (template, classe, estilo, teste) com as convencoes corretas
2. **Especifique o path relativo ao app** — `ng g s services/user` nao `ng g s user` na raiz, porque o CLI resolve paths a partir de `src/app/` automaticamente
3. **Use `--skip-tests=true` quando teste unitario nao e necessario** — porque evita arquivos de teste vazios que poluem o projeto
4. **Prefira a forma contraida para velocidade** — `ng g c` em vez de `ng generate component`, porque e equivalente e mais rapido
5. **Se CLI global nao esta disponivel, use `npm run ng`** — porque executa o CLI local do projeto via script do package.json
6. **Nao adicione sufixo `-component` ou `-service` ao nome** — `ng g c header` nao `ng g c header-component`, porque o CLI concatena o sufixo automaticamente

## Steps

### Step 1: Verificar CLI instalado

```bash
ng version
```

Se nao reconhecido, usar `npm run ng` como alternativa.

### Step 2: Gerar componente

```bash
# Forma completa
ng generate component nome-componente

# Forma contraida
ng g c nome-componente

# Sem arquivo de teste
ng g c nome-componente --skip-tests=true
```

### Step 3: Gerar service em pasta especifica

```bash
# Cria dentro de src/app/services/
ng g s services/user
```

### Step 4: Alternativa sem CLI global

```bash
# Usa o CLI local do projeto
npm run ng -- generate component nome-componente
```

## Comandos disponiveis via ng generate

| Artefato | Comando | Contraido |
|----------|---------|-----------|
| Component | `ng generate component nome` | `ng g c nome` |
| Service | `ng generate service nome` | `ng g s nome` |
| Directive | `ng generate directive nome` | `ng g d nome` |
| Pipe | `ng generate pipe nome` | `ng g p nome` |
| Guard | `ng generate guard nome` | `ng g guard nome` |
| Interface | `ng generate interface nome` | `ng g i nome` |
| Enum | `ng generate enum nome` | `ng g e nome` |
| Interceptor | `ng generate interceptor nome` | `ng g interceptor nome` |

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto novo, CLI global instalado | `ng g c/s/d` direto |
| Maquina corporativa sem permissao global | `npm run ng -- generate ...` |
| Componente simples sem logica testavel | `--skip-tests=true` |
| Service compartilhado | Crie em `services/nome` |
| Verificar versao do CLI global | `ng version` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Criar arquivos .ts/.html/.css manualmente para componentes | `ng g c nome` |
| `ng g c meu-component` (sufixo redundante) | `ng g c meu` |
| `ng g s user` na raiz sem organizacao | `ng g s services/user` |
| Copiar/colar componente existente e renomear | `ng g c novo-nome` |
| Usar `npx @angular/cli generate ...` no dia a dia | Instalar CLI global ou usar `npm run ng` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
