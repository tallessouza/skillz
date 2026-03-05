---
name: rs-full-stack-instalando-executando-webpack
description: "Guides Webpack setup and execution in JavaScript projects. Use when user asks to 'setup webpack', 'configure bundler', 'create build script', 'bundle javascript', or 'start a new JS project with webpack'. Follows src/ convention, entry point configuration, and npm build scripts. Make sure to use this skill whenever setting up a new frontend project that needs module bundling. Not for Vite, esbuild, Rollup, or other bundler configurations."
---

# Instalando e Executando o Webpack

> Configure o Webpack como empacotador seguindo convencoes de mercado: pasta src/ para codigo, dist/ para output, e scripts npm para execucao.

## Prerequisites

- Node.js instalado (para usar npm)
- Projeto com pelo menos um arquivo HTML

## Steps

### Step 1: Criar estrutura de pastas

Separar arquivos de codigo dos arquivos de configuracao usando a convencao `src/`:

```
projeto/
├── src/
│   ├── index.html
│   └── js/
│       ├── index.js        # Arquivo de entrada (entry point)
│       └── components.js   # Modulos auxiliares
├── package.json
└── node_modules/
```

A pasta `src/` (source) e convencao de mercado para separar codigo criado pelo desenvolvedor dos arquivos de configuracao na raiz.

### Step 2: Criar modulos com export/import

```javascript
// src/js/components.js
export function title(title) {
  const element = document.createElement("h1")
  element.textContent = title
  document.body.appendChild(element)
}
```

```javascript
// src/js/index.js
import { title } from "./components.js"

title("Hello World")
```

Nao adicionar `<script>` no HTML — o empacotador resolve as dependencias e gera um arquivo unico.

### Step 3: Instalar Webpack

```bash
npm install webpack webpack-cli --save-dev
```

- `webpack` — o empacotador
- `webpack-cli` — comandos de execucao no terminal
- `--save-dev` — dependencia apenas de desenvolvimento

### Step 4: Criar script de build

```json
{
  "scripts": {
    "build": "webpack ./src/js/index.js"
  }
}
```

O caminho aponta para o **entry point** — o arquivo principal que importa todos os outros.

### Step 5: Executar

```bash
npm run build
```

Gera a pasta `dist/` com `main.js` — um unico arquivo com todos os modulos empacotados.

## Output format

```
projeto/
├── dist/
│   └── main.js    # Bundle gerado (todos os modulos em um arquivo)
├── src/
│   ├── index.html
│   └── js/
│       ├── index.js
│       └── components.js
├── package.json
└── node_modules/
```

## Error handling

- Se aparecer warning sobre `mode` — ignorar por enquanto, sera configurado depois (production/development)
- Se `npm` nao for encontrado — instalar Node.js primeiro

## Verification

- Pasta `dist/` foi criada com `main.js` dentro
- O `main.js` contem o codigo de todos os modulos combinados em um unico arquivo

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto novo com multiplos JS | Usar Webpack para empacotar |
| Apenas 1 arquivo JS simples | `<script>` direto no HTML basta |
| Precisa de HMR e dev server | Configurar webpack-dev-server (proximo passo) |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Importar scripts manualmente no HTML quando usa bundler | Deixar o empacotador resolver dependencias |
| Colocar arquivos de config dentro de `src/` | Config na raiz, codigo em `src/` |
| Rodar webpack manualmente no terminal toda vez | Criar script npm (`"build": "webpack ..."`) |
| Usar caminho errado no entry point | Caminho relativo a partir da raiz do projeto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre empacotadores e convencoes de projeto
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes