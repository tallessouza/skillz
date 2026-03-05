---
name: rs-angular-instalando-dependencias-npm
description: "Guides through installing Angular project dependencies with npm when cloning from Git repositories. Use when user asks to 'clone angular project', 'install dependencies', 'fix node_modules', 'npm install angular', or 'project not running after clone'. Covers safe node_modules deletion and dependency restoration. Make sure to use this skill whenever user has issues running a cloned Angular/npm project. Not for creating new Angular projects, publishing packages, or npm configuration."
---

# Instalando Dependencias do Projeto com NPM

> Ao clonar um projeto Angular de um repositorio Git, execute `npm install` na raiz para gerar a node_modules a partir do package.json.

## Prerequisites

- Node.js 18+ instalado
- npm disponivel no terminal
- Angular CLI instalado globalmente (opcional, mas recomendado)
- Se nao tiver Angular CLI global: usar `npm run start` em vez de `ng serve`

## Steps

### Step 1: Verificar a situacao

```bash
ls package.json
# Se existe package.json mas NAO existe node_modules → precisa instalar
```

Se tentar rodar sem dependencias:
```bash
npm run start
# Erro: pacotes nao instalados → execute npm install
```

### Step 2: Instalar dependencias

```bash
# Na raiz do projeto (onde esta o package.json)
npm install
```

Isso le `package.json` e `package-lock.json` e gera a pasta `node_modules` com todas as dependencias.

### Step 3: Executar o projeto

```bash
# Com Angular CLI global:
ng serve

# Sem Angular CLI global:
npm run start
```

Acesse `http://localhost:4200` no navegador.

## Deletando node_modules com seguranca

Quando precisar excluir node_modules (incompatibilidade de versoes, por exemplo):

1. **Feche TUDO** — VS Code, terminais, ng serve, qualquer processo usando o projeto
2. **Exclua pelo File Explorer do SO** — nunca pelo VS Code, porque a pasta e muito grande e causa problemas de permissao
3. **Reinstale** com `npm install`

## Error handling

- Se `npm install` falha com permissao → fechar todos os processos que usam o projeto
- Se `ng serve` nao e reconhecido → usar `npm run start` (usa CLI local do projeto)
- Se build falha apos install → deletar node_modules pelo File Explorer, reinstalar

## Heuristics

| Situacao | Acao |
|----------|------|
| Clonou projeto do GitHub | `npm install` na raiz |
| Projeto nao roda apos clone | Verificar se node_modules existe |
| Erro de incompatibilidade | Deletar node_modules (pelo SO) + `npm install` |
| `ng serve` nao funciona | Usar `npm run start` |
| node_modules nao deleta | Fechar VS Code e todos os terminais primeiro |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Deletar node_modules pelo VS Code | Deletar pelo File Explorer do SO |
| Deletar com terminais/processos abertos | Fechar tudo antes de deletar |
| Subir node_modules para o GitHub | Manter no .gitignore (ja vem por padrao) |
| Instalar dependencias manualmente uma a uma | `npm install` resolve tudo via package.json |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
