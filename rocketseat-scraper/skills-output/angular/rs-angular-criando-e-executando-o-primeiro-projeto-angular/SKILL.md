---
name: rs-angular-criando-executando-projeto
description: "Generates and runs new Angular projects using Angular CLI. Use when user asks to 'create angular project', 'setup angular app', 'start new angular project', 'ng new', or 'run angular locally'. Covers ng new flags, npx version pinning, ng serve, and npm run start differences. Make sure to use this skill whenever scaffolding a new Angular application or troubleshooting project execution. Not for Angular component creation, routing, or feature implementation."
---

# Criando e Executando Projeto Angular

> Ao criar um projeto Angular, sempre especifique a versao via npx para garantir consistencia, e entenda a diferenca entre Angular CLI global e local.

## Prerequisites

- Node.js 18+ instalado
- Angular CLI instalado globalmente (opcional, mas recomendado): `npm install -g @angular/cli@19`
- Se nao tiver CLI global, use `npx` para todos os comandos

## Steps

### Step 1: Criar o projeto

**Com Angular CLI global:**
```bash
ng new meu-projeto --ssr=false --style=css
```

**Com npx (versao especifica — recomendado):**
```bash
npx @angular/cli@19 new meu-projeto --ssr=false --style=css
```

### Step 2: Flags importantes do ng new

| Flag | Valor | Porque usar |
|------|-------|-------------|
| `--ssr` | `false` | Evita server-side rendering quando nao necessario |
| `--style` | `css` | Define extensao das folhas de estilo dos componentes |

Consultar todas as flags em: `https://angular.dev` → Reference → CLI Reference → ng new

### Step 3: Abrir e executar o projeto

```bash
cd meu-projeto
code .
```

**Executar com CLI global:**
```bash
ng serve
```

**Executar com CLI local (via npm scripts):**
```bash
npm run start
```

Ambos executam `ng serve`, mas a origem do comando e diferente.

### Step 4: Acessar no navegador

```
http://localhost:4200
```

Porta 4200 e o padrao do Angular.

## Angular CLI Global vs Local

| Aspecto | Global | Local |
|---------|--------|-------|
| Instalacao | `npm install -g @angular/cli` | Automatica no `node_modules/` do projeto |
| Comando | `ng serve` direto no terminal | `npm run start` (executa ng serve do projeto) |
| Versao | A que esta na maquina (`ng version`) | A que esta no `package.json` do projeto |
| Quando usar | Conveniencia, se versoes coincidem | Garantia de consistencia entre devs |

## Verificacao

- `ng version` — mostra versao do CLI global
- `package.json` → `devDependencies` → `@angular/cli` — versao local
- `package.json` → `scripts` → `start` aponta para `ng serve`

## Error handling

- Se `ng serve` nao funciona: CLI global nao instalado. Use `npm run start`
- Se `npx` falha: verifique conexao com internet, npx baixa temporariamente o pacote
- Se porta 4200 ocupada: `ng serve --port 4300`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
