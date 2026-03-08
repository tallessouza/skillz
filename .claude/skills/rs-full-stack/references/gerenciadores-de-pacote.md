---
name: rs-full-stack-gerenciadores-de-pacote
description: "Applies package manager best practices when setting up JavaScript/Node.js projects. Use when user asks to 'install dependencies', 'setup a project', 'add a package', 'manage dependencies', or 'configure npm'. Enforces correct separation of production vs development dependencies, proper use of npm commands, and dependency management hygiene. Make sure to use this skill whenever initializing projects or managing packages. Not for build tools, bundlers, or transpiler configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: tooling
  tags: [npm, package-manager, dependencies, node-modules, lockfile]
---

# Gerenciadores de Pacote

> Dependencias sao codigo alheio que seu projeto precisa para funcionar — gerencie-as com intencao, nao por acidente.

## Rules

1. **Separe dependencias de producao e desenvolvimento** — `dependencies` vs `devDependencies`, porque pacotes de dev (transpiladores, linters, test runners) nao devem ir para producao, inflando o bundle e expondo superficie de ataque
2. **Use o flag correto ao instalar** — `npm install pacote` para producao, `npm install -D pacote` para desenvolvimento, porque o default adiciona em `dependencies` e muitos devs esquecem o `-D`
3. **Mantenha dependencias atualizadas** — bugs sao corrigidos e vulnerabilidades sao patcheadas pela comunidade, entao atualizacoes regulares evitam debt silencioso
4. **Entenda que pacote instalado = dependencia** — se seu projeto usa Day.js, ele DEPENDE de Day.js; remover quebra o projeto, porque dependencia e uma relacao de necessidade, nao conveniencia
5. **Nunca commite node_modules** — o gerenciador de pacotes recria a pasta a partir do lockfile, porque versionar node_modules gera conflitos e repositorios gigantes
6. **Respeite o lockfile** — `package-lock.json` garante versoes compativeis e reproduziveis entre ambientes, porque sem ele cada `npm install` pode resolver versoes diferentes

## Key concepts

### O que e um gerenciador de pacotes

Ferramenta que facilita instalar, atualizar e remover pacotes (bibliotecas) do projeto. Resolve dependencias automaticamente, garantindo versoes compativeis.

### NPM (Node Package Manager)

O gerenciador mais popular para JavaScript. Funciona no ecossistema Node mas e usado em web, mobile e outros ambientes. Permite instalar pacotes e executar scripts.

### Dependencias de producao vs desenvolvimento

| Tipo | Flag | Onde fica | Exemplo |
|------|------|-----------|---------|
| Producao | `npm install pacote` | `dependencies` | express, dayjs, react |
| Desenvolvimento | `npm install -D pacote` | `devDependencies` | typescript, jest, eslint |

**Producao:** pacotes necessarios para o projeto funcionar quando o usuario esta usando.

**Desenvolvimento:** pacotes necessarios apenas enquanto o dev esta codando (transpiladores, linters, test frameworks).

## Example

```bash
# Inicializar projeto
npm init -y

# Instalar dependencia de producao
npm install express

# Instalar dependencia de desenvolvimento
npm install -D typescript

# Verificar vulnerabilidades
npm audit
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Inicializando projeto novo | `npm init -y` e revise o `package.json` gerado |
| Instalando lib que o app usa em runtime | `npm install pacote` (sem flag -D) |
| Instalando ferramenta de build/test/lint | `npm install -D pacote` |
| Clonando repo existente | `npm install` (le o lockfile e instala tudo) |
| Pacote nao e mais usado | `npm uninstall pacote` para remover limpo |
| Verificando vulnerabilidades | `npm audit` periodicamente |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Instalar tudo como producao | Separe com `-D` o que e so dev |
| Ignorar o lockfile no .gitignore | Commite `package-lock.json` sempre |
| Atualizar manualmente copiando arquivos | Use `npm update` ou `npm install pacote@latest` |
| Commitar `node_modules/` | Adicione `node_modules/` ao `.gitignore` |
| Instalar pacote global para o projeto | Use `npx` ou instale local no projeto |
| Ignorar `npm audit` warnings | Corrija vulnerabilidades ou documente como debt |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `npm install` falha com erros de permissao | Instalacao global sem sudo ou diretorio protegido | Use `npx` para executar ou instale local no projeto |
| Versoes diferentes entre ambientes | Lockfile nao commitado ou ignorado | Commite `package-lock.json` e use `npm ci` em CI/CD |
| Pacote de dev foi para producao | Instalado sem flag `-D` | Reinstale com `npm install -D pacote` |
| `node_modules` commitado acidentalmente | Falta `.gitignore` com `node_modules` | Adicione ao `.gitignore` e remova do tracking: `git rm -r --cached node_modules` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre gerenciadores, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de comandos expandidos com variacoes