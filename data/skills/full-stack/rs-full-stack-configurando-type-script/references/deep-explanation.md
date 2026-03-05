# Deep Explanation: Configurando TypeScript

## Por que cada opcao existe

### target: es2022

O `target` define para qual versao do JavaScript o TypeScript vai compilar o codigo. Com `es2022`, o compilador mantem features como:
- Top-level `await`
- Private class fields (`#field`)
- `Array.at()`
- `Object.hasOwn()`

Como estamos rodando em Node.js 18+, nao ha necessidade de transpilar para versoes antigas. Quanto mais proximo o target do runtime real, menos transformacoes o compilador faz e mais legivel fica o output.

### lib: ["es2023"]

O `lib` controla quais **tipos** estao disponiveis no projeto (nao afeta o output compilado). Usar `es2023` disponibiliza tipos para:
- `Array.prototype.findLast()` / `findLastIndex()`
- `Array.prototype.toReversed()` / `toSorted()` / `toSpliced()`
- Outras APIs adicionadas ate ES2023

A lib pode ser mais recente que o target porque a lib so adiciona tipos — o runtime real (Node.js) e quem precisa suportar as APIs.

### module: node16 e moduleResolution: node16

Estas duas opcoes trabalham juntas. `module: "node16"` diz ao TypeScript para usar o sistema de modulos do Node.js 16+, que suporta tanto ESM quanto CJS dependendo do contexto:
- Arquivos `.mts` → ESM
- Arquivos `.cts` → CJS
- Arquivos `.ts` → depende do `"type"` no package.json

O `moduleResolution: "node16"` e obrigatorio quando se usa `module: "node16"`. Ele faz o TypeScript resolver imports da mesma forma que o Node.js resolve, incluindo a necessidade de extensoes explicitas em imports ESM.

### esModuleInterop: true

Sem esta opcao, importar modulos CommonJS requer sintaxe verbosa:
```typescript
// Sem esModuleInterop
import * as express from 'express'

// Com esModuleInterop
import express from 'express'
```

O instrutor ativa isso como `true` para permitir a sintaxe mais natural de default imports com pacotes CJS.

### strict: true

Ativa simultaneamente todas as flags strict do TypeScript:
- `strictNullChecks` — null e undefined sao tipos separados
- `noImplicitAny` — proibe any implicito
- `strictFunctionTypes` — checagem de tipos em parametros de funcao
- `strictBindCallApply` — tipos corretos para bind/call/apply
- `strictPropertyInitialization` — propriedades de classe devem ser inicializadas
- `noImplicitThis` — this deve ter tipo explicito
- `alwaysStrict` — emite "use strict" em todo arquivo

O instrutor recomenda strict como true para pegar bugs em tempo de compilacao, nao em runtime.

### skipLibCheck: true

Pula a verificacao de tipos em arquivos `.d.ts` de dependencias. Motivos:
1. **Performance** — verificar tipos de centenas de pacotes e lento
2. **Conflitos** — pacotes podem ter definicoes de tipos incompativeis entre si
3. **Foco** — voce quer verificar SEU codigo, nao o dos outros

Na pratica, desligar `skipLibCheck` raramente encontra bugs uteis e frequentemente gera erros confusos vindos de node_modules.

## Contexto da aula

O instrutor cria o tsconfig.json na raiz do projeto como parte da configuracao inicial. Ele enfatiza que "nao vai mudar nada a principio" — a aplicacao continua funcionando igual. O tsconfig serve para garantir a compilacao correta do TypeScript e ativar verificacoes que previnem bugs.

A abordagem e pragmatica: configurar uma vez com opcoes solidas e seguir em frente. Nao e necessario entender cada opcao em profundidade para comecar a desenvolver.