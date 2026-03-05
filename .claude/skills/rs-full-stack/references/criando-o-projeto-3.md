---
name: rs-full-stack-criando-o-projeto-3
description: "Applies Node.js project initialization workflow when user asks to 'create a node project', 'start a new API', 'setup express project', 'init npm project', or 'scaffold backend'. Follows conventions: src/ folder structure, server.js entry point, clean package.json configuration. Make sure to use this skill whenever bootstrapping a new Node.js backend project from scratch. Not for frontend projects, monorepo setup, or framework-specific scaffolding like Next.js or Nest.js."
---

# Criando Projeto Node.js (API REST)

> Ao iniciar um projeto Node.js, configure a estrutura de pastas e o package.json corretamente desde o primeiro momento, porque corrigir convenções depois custa mais que acertar no início.

## Prerequisites

- Node.js 18+ instalado
- npm disponível no terminal
- Editor com terminal integrado (VSCode recomendado)

## Steps

### Step 1: Criar pasta e inicializar

```bash
mkdir api-rest && cd api-rest
npm init -y
```

### Step 2: Criar estrutura de pastas

```bash
mkdir src
touch src/server.js
```

### Step 3: Ajustar package.json

Campos obrigatórios a configurar:

```json
{
  "name": "api-rest",
  "description": "Criando API REST com Node.js",
  "main": "src/server.js",
  "scripts": {},
  "keywords": [],
  "author": "Seu Nome"
}
```

Regras de ajuste:
1. **`main` aponta para `src/server.js`** — porque o entry point deve refletir a estrutura real do projeto
2. **`scripts` começa vazio** — adicionar scripts conforme necessidade real, não preencher com defaults inúteis
3. **Remover `keywords` padrão** — limpar o que o `npm init -y` gera automaticamente
4. **`description` descreve o projeto** — nunca deixar vazio ou com o default

### Step 4: Validar ambiente

```javascript
// src/server.js
console.log("hello world")
```

```bash
node src/server.js
# Deve imprimir: hello world
```

## Output format

```
projeto/
├── package.json      # Configurado com main: src/server.js
└── src/
    └── server.js     # Entry point da aplicação
```

## Error handling

- Se `npm init -y` falhar, verificar se Node.js está instalado: `node --version`
- Se `node src/server.js` não executar, verificar se o arquivo foi criado no path correto

## Heuristics

| Situação | Ação |
|----------|------|
| Projeto backend simples | `src/server.js` como entry point |
| Projeto com TypeScript | `src/server.ts` + configurar tsconfig |
| Projeto com múltiplos serviços | Considerar estrutura monorepo |
| Nome do projeto | Usar kebab-case, sem espaços |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| Deixar `main` como `index.js` na raiz | Apontar para `src/server.js` |
| Manter `"test": "echo \"Error: no test specified\""` | Limpar scripts ou adicionar um real |
| Criar arquivos na raiz sem pasta `src/` | Usar `src/` desde o início |
| Deixar `description` vazio | Descrever o propósito do projeto |
| Preencher `keywords` sem necessidade | Remover ou deixar array vazio |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre convenções de estrutura Node.js
- [code-examples.md](references/code-examples.md) — Exemplos de package.json e variações de setup

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-criando-o-projeto-3/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-criando-o-projeto-3/references/code-examples.md)
