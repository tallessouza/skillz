# Deep Explanation: Import com CommonJS e ES Modules

## Contexto historico

O Node.js nasceu usando CommonJS como sistema de modulos — `require()` para importar, `module.exports` para exportar. Era o unico sistema disponivel. Com a evolucao do JavaScript (ES2015+), o ECMAScript definiu um sistema nativo de modulos: ES Modules, usando `import`/`export`.

O instrutor enfatiza que CommonJS e o **padrao** do Node (se nao configurar nada, Node assume CommonJS), mas que ES Modules e a maneira **moderna** e preferida.

## Por que ES Modules e melhor

1. **Static analysis** — imports sao declarativos, permitindo que ferramentas analisem dependencias sem executar o codigo
2. **Tree-shaking** — bundlers conseguem eliminar codigo nao utilizado
3. **Consistencia** — mesmo sistema de modulos do browser JavaScript
4. **Async por padrao** — ES Modules sao carregados de forma assincrona

## O erro sem `type: "module"`

Quando voce tenta usar `import` sem configurar o package.json, Node retorna:

```
SyntaxError: Cannot use import statement outside a module
```

Isso acontece porque Node assume CommonJS por padrao. A propriedade `"type": "module"` no package.json instrui o Node a tratar todos os arquivos `.js` como ES Modules.

## O prefix `node:`

O instrutor destaca que versoes recentes do Node permitem diferenciar pacotes internos de terceiros usando o prefix `node:`. Exemplo:

- `import http from 'node:http'` — explicito: pacote do core do Node
- `import dayjs from 'dayjs'` — sem prefix: pacote de terceiros instalado via npm

Isso e importante porque:
- Evita conflito de nomes (um pacote npm poderia ter o mesmo nome de um modulo interno)
- Torna o codigo auto-documentado sobre a origem de cada dependencia
- E uma best practice recomendada pela documentacao oficial do Node

## Pacotes internos vs terceiros

**Pacotes internos (core do Node):** ja vem com o Node, nao precisa instalar.
- http, https, fs, path, crypto, os, url, stream, events, etc.

**Pacotes de terceiros:** precisam ser instalados via npm/yarn/pnpm.
- dayjs (manipulacao de datas, mencionado pelo instrutor), express, zod, etc.

## Edge cases

- Arquivos `.mjs` sao SEMPRE tratados como ES Modules, independente do package.json
- Arquivos `.cjs` sao SEMPRE tratados como CommonJS
- Se voce usa `"type": "module"` mas precisa de um arquivo CommonJS, renomeie para `.cjs`
- `require()` NAO funciona em ES Modules (use `createRequire` se absolutamente necessario)
- Named exports de pacotes CommonJS podem precisar de tratamento especial ao importar em ES Modules