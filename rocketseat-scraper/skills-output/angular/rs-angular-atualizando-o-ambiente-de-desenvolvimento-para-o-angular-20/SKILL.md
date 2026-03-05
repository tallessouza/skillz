---
name: rs-angular-atualizando-ambiente-angular-20
description: "Guides Angular development environment setup and version upgrades when user asks to 'create angular project', 'update angular', 'upgrade angular cli', 'setup angular 20', or 'configure angular environment'. Covers Node.js version compatibility, Angular CLI global install/uninstall, and project creation with ng new. Make sure to use this skill whenever setting up or upgrading an Angular development environment. Not for Angular component development, routing, or application logic."
---

# Atualizando o Ambiente de Desenvolvimento para o Angular 20

> Antes de criar qualquer projeto Angular, garanta que Node.js e Angular CLI estao nas versoes compativeis.

## Prerequisites

- Node.js instalado (verificar com `node --version`)
- npm disponivel (vem com Node.js)
- Terminal/prompt de comando

## Steps

### Step 1: Verificar compatibilidade do Node.js

Consultar a pagina de version compatibility do Angular para a versao desejada.

```bash
node --version
```

| Angular | Node.js compativel |
|---------|-------------------|
| 20 | 20, 22, 24 |

Se a versao do Node.js nao estiver no range compativel, desinstalar e instalar a versao LTS mais recente em [nodejs.org](https://nodejs.org).

### Step 2: Desinstalar Angular CLI antigo

```bash
npm uninstall -g @angular/cli
```

Verificar que foi removido:

```bash
ng version
# Deve dar erro: comando nao encontrado
```

### Step 3: Instalar Angular CLI na versao mais recente

```bash
npm install -g @angular/cli
```

Sem especificar `@versao`, o npm instala a ultima versao disponivel.

Verificar:

```bash
ng version
# Deve mostrar a versao 20.x.x
```

Se `ng` nao for reconhecido apos instalacao: fechar todos os terminais e reabrir (ou reiniciar a maquina).

### Step 4: Criar projeto na nova versao

```bash
ng new nome-do-projeto
```

Opcoes no prompt interativo:

| Pergunta | Resposta padrao |
|----------|----------------|
| Stylesheet format | CSS |
| Server-side rendering | N |
| Zoneless application | N (ate que seja necessario) |
| AI configuration | None |

Alternativa com npx (sem CLI global):

```bash
npx @angular/cli@20 new nome-do-projeto
```

### Step 5: Verificar e rodar

```bash
cd nome-do-projeto
ng serve
# Acessar http://localhost:4200
```

Confirmar versao no `package.json` — dependencias Angular devem estar em `^20.x.x`.

## Output format

Ambiente configurado com:
- Node.js em versao compativel
- Angular CLI global na versao 20+
- Projeto criado e rodando em `localhost:4200`

## Error handling

- Se `ng` nao e reconhecido apos install: fechar TODOS os terminais e reabrir
- Se ainda nao funciona: reiniciar a maquina
- Se Node.js esta fora do range: desinstalar completamente e reinstalar a versao LTS

## Heuristics

| Situacao | Acao |
|----------|------|
| Quer criar projeto em versao especifica sem mudar CLI global | Usar `npx @angular/cli@VERSAO new nome` |
| CLI global esta em versao antiga | Desinstalar e reinstalar (nao fazer update) |
| Mudanca de nomenclatura nos arquivos (sem `.component.ts`) | Normal no Angular 20+, sera abordado separadamente |
| Pergunta sobre zoneless | Responder N ate que o projeto exija explicitamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
