# Deep Explanation: Criando Projeto Express + TypeScript

## Por que separar app.ts de server.ts?

O instrutor cria dois arquivos distintos desde o início: `app.ts` e `server.ts`. A razão é arquitetural:

- **app.ts** contém a configuração da aplicação Express — middlewares, rotas, plugins. É a "definição" da aplicação.
- **server.ts** contém apenas a execução — `app.listen()` na porta configurada.

Essa separação permite:
1. **Testes**: importar `app` diretamente sem subir o servidor (supertest, por exemplo)
2. **Reutilização**: o mesmo `app` pode ser usado em serverless, testes, ou múltiplas instâncias
3. **Clareza**: quem lê o código sabe onde está a configuração vs. onde está a execução

O instrutor diz: "para a gente separar a nossa aplicação da execução do servidor de fato". Isso é um padrão consolidado em projetos Express profissionais.

## Por que fixar versões com @?

O instrutor enfatiza: "É importante que você utilize a mesma versão que eu". Em ambiente de curso, isso garante que todos têm o mesmo comportamento. Em produção, o `package-lock.json` faz esse papel, mas fixar no `npm i` evita surpresas ao instalar em máquina limpa.

Versões instaladas:
- `express@4.19.2` — dependência de produção
- `@types/express@4.17.21` — tipagem, dev only
- `typescript@5.5.4` — compilador, dev only
- `@types/node@20.14.12` — tipagem do Node, dev only
- `tsx@4.16.2` — executor TypeScript com watch, dev only

## Path aliases com @/

A configuração `"@/*": ["./src/*"]` no `tsconfig.json` permite importar módulos internos com `@/` em vez de caminhos relativos:

```typescript
// Com path alias
import { app } from "@/app"

// Sem path alias (mais frágil)
import { app } from "./app"
// ou pior, em arquivos mais profundos:
import { app } from "../../app"
```

O instrutor troca o import relativo pelo alias logo após configurar o tsconfig: "dentro do nosso server a gente pode trocar aqui no lugar de ser ponto barra app, arroba barra, já está funcionando".

O `tsx` resolve esses aliases automaticamente em tempo de execução, sem precisar de configuração adicional como `tsconfig-paths`.

## Configuração do tsconfig.json explicada

O instrutor limpa todo o conteúdo gerado pelo `npx tsc --init` e configura manualmente:

| Opção | Valor | Por quê |
|-------|-------|---------|
| `target` | `ES2022` | Suporte a top-level await, módulos nativos |
| `lib` | `["ES2023"]` | Acesso às APIs mais recentes do JS |
| `paths` | `{"@/*": ["./src/*"]}` | Aliases para imports limpos |
| `module` | `Node16` | Resolução de módulos compatível com Node.js |
| `esModuleInterop` | `true` | Permite `import x from "y"` com módulos CommonJS |
| `forceConsistentCasingInFileNames` | `true` | Previne bugs em sistemas case-insensitive (Windows/Mac) |
| `strict` | `true` | Ativa todas as verificações rigorosas de tipo |
| `skipLibCheck` | `true` | Não verifica tipos em `node_modules`, acelera compilação |

## tsx watch como dev server

O `tsx` é um executor de TypeScript que não gera arquivos `.js` — executa diretamente. Com `watch`, ele monitora mudanças nos arquivos e reinicia automaticamente:

```json
"dev": "tsx watch src/server.ts"
```

Isso substitui a combinação `ts-node` + `nodemon` que era comum antes, em um único pacote mais rápido.

## express.json() como primeiro middleware

O instrutor adiciona `app.use(express.json())` imediatamente após criar o app. Esse middleware parseia o body de requisições com `Content-Type: application/json`, transformando o body em objeto JavaScript acessível via `req.body`. Sem ele, qualquer rota que espera JSON no body receberia `undefined`.

## Extensões recomendadas pelo instrutor

O instrutor menciona duas extensões do VS Code:
- **Code Spell Checker** — verifica ortografia em inglês
- **Portuguese - Code Spell Checker** — extensão complementar para português

Útil para evitar typos em nomes de variáveis, strings e comentários.