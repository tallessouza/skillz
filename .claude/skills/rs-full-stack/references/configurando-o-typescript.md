---
name: rs-full-stack-configurando-o-typescript
description: "Generates optimized tsconfig.json for Node.js projects following Microsoft's official Node Target Mapping. Use when user asks to 'setup typescript', 'configure tsconfig', 'init typescript project', 'create node api with typescript', or 'start new node project'. Applies correct target, module, lib, and strict settings based on Node.js version. Make sure to use this skill whenever creating a new Node.js + TypeScript project or reviewing tsconfig.json configuration. Not for frontend/browser TypeScript config, Deno, or Bun runtimes."
---

# Configurando o TypeScript para Node.js

> Gere o tsconfig.json baseado no Node Target Mapping oficial da Microsoft, nao em tentativa e erro.

## Prerequisites

- Node.js instalado (verificar versao com `node -v`)
- Projeto npm inicializado (`package.json` existente)
- TypeScript instalado como devDependency

## Steps

### Step 1: Gerar o tsconfig.json base

```bash
npx tsc --init
```

Isso gera um `tsconfig.json` com todas as opcoes possiveis (maioria comentada).

### Step 2: Consultar o Node Target Mapping

Referencia oficial: `github.com/microsoft/TypeScript/wiki/Node-Target-Mapping`

| Node.js Version | target | module | lib |
|----------------|--------|--------|-----|
| 18 | ES2023 | Node16 | ["ES2023"] |
| 20+ | ES2023 | Node16 | ["ES2023"] |
| 22+ | ES2024 | Node18 | ["ES2024"] |

### Step 3: Aplicar configuracao limpa

Remover todos os comentarios e propriedades nao utilizadas. Manter apenas o necessario:

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "Node16",
    "lib": ["ES2023"],
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

## Rules

1. **Sempre consulte o Node Target Mapping** — nao invente valores de target/module/lib, porque combinacoes erradas causam erros de runtime silenciosos
2. **Remova propriedades comentadas** — o tsconfig gerado vem com dezenas de opcoes comentadas que poluem o arquivo. Mantenha apenas o que esta em uso, porque adicionar conforme necessidade e mais limpo que manter tudo comentado
3. **Sempre habilite strict** — `"strict": true` ativa verificacoes rigorosas de tipo que evitam erros silenciosos em producao
4. **skipLibCheck: true** — ignora verificacao de tipo em arquivos `.d.ts` de terceiros, porque acelera a compilacao sem perder seguranca no seu codigo
5. **module: Node16** — garante compatibilidade com o sistema de modulos do Node.js, suportando tanto ESM quanto CommonJS interop

## Output format

Um arquivo `tsconfig.json` limpo, sem comentarios, com apenas as propriedades ativas organizadas por categoria:
- Target/Lib (compatibilidade JS)
- Module (sistema de modulos)
- Interop (compatibilidade de importacao)
- Type Checking (verificacao rigorosa)
- Skip (otimizacao)

## Heuristics

| Situacao | Faca |
|----------|------|
| Node 18-20 | target: ES2023, module: Node16 |
| Node 22+ | target: ES2024, module: Node18 |
| Projeto com CommonJS e ESM misturados | esModuleInterop: true |
| Muitas dependencias externas | skipLibCheck: true |
| Precisa de propriedade nova | Adicione sob demanda, nao descomente do template |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Manter tsconfig com dezenas de linhas comentadas | Limpar e manter so o ativo |
| Chutar valores de target/module | Consultar Node Target Mapping |
| Usar `"module": "commonjs"` em projeto novo Node 18+ | Usar `"module": "Node16"` |
| Desabilitar strict em projeto novo | Sempre strict: true desde o inicio |
| Copiar tsconfig de projeto frontend para backend | Gerar config especifica para Node |

## Error handling

- Se `npx tsc --init` falhar: verificar se typescript esta instalado (`npm i -D typescript`)
- Se erros de modulo apos configurar: verificar se `"type": "module"` no package.json esta consistente com a config de module no tsconfig

## Verification

- `npx tsc --noEmit` deve passar sem erros
- Imports entre arquivos `.ts` devem resolver corretamente

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre cada propriedade e o Node Target Mapping
- [code-examples.md](references/code-examples.md) — Exemplos de tsconfig para diferentes cenarios e versoes de Node

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-configurando-o-typescript/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-configurando-o-typescript/references/code-examples.md)
