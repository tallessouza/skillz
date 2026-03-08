# Deep Explanation: Build da Aplicação

## Por que converter TypeScript para JavaScript?

O TypeScript é uma ferramenta de **desenvolvimento**. Ele ajuda a manter a aplicação consistente através das tipagens, prevenindo erros em tempo de desenvolvimento. Porém, o ambiente de produção (Node.js) executa JavaScript — não TypeScript.

A analogia é: TypeScript é como o andaime de uma construção. Essencial durante a obra, removido quando o prédio está pronto. O andaime (tipagens) não faz parte do produto final.

### O que acontece durante o build?

O tsup pega todos os arquivos `.ts` dentro de `src/` e:

1. Remove as tipagens (type annotations, interfaces, types)
2. Converte a sintaxe TypeScript para JavaScript puro
3. Gera código adicional quando necessário para manter compatibilidade com os recursos utilizados
4. Deposita os arquivos `.js` resultantes na pasta de saída

Por exemplo, um `users-controller.ts` pode gerar um `users-controller.js` com mais código do que o original visível, porque o tsup precisa gerar JavaScript compatível baseado nos tipos e recursos TypeScript utilizados.

## Por que tsup e não tsc?

O `tsc` (TypeScript Compiler) também converte TS para JS, mas o `tsup` é um bundler mais moderno e rápido, construído sobre o esbuild. Ele:

- É significativamente mais rápido que `tsc` para builds
- Tem configuração mais simples (zero-config por padrão)
- Suporta múltiplos formatos de saída (ESM, CJS)
- É mais adequado para projetos Node.js que precisam de um build simples

## O diretório de saída

Por padrão, o tsup gera a saída na pasta `dist/`. O nome vem de "distribution" — o código pronto para distribuição/deploy.

Porém, muitos projetos preferem usar `build/` como nome da pasta de saída. A flag `--out-dir` permite essa customização:

```bash
tsup src --out-dir build
```

A escolha do nome é convenção do projeto. O importante é:
- Ser consistente (toda a equipe usa o mesmo nome)
- Estar no `.gitignore` (artefatos gerados não são versionados)
- Ser referenciado corretamente no Dockerfile ou script de deploy

## Dependência de desenvolvimento (-D flag)

O tsup é instalado com `-D` (ou `--save-dev`) porque:
- Só é necessário durante o desenvolvimento/CI para gerar o build
- Em produção, apenas o JavaScript gerado é executado
- Reduz o tamanho do `node_modules` em produção quando se usa `npm install --production`

## Estrutura após o build

A pasta de saída espelha a estrutura do `src/`:

```
src/                    →    dist/ (ou build/)
├── app.ts              →    ├── app.js
├── server.ts           →    ├── server.js
├── controllers/        →    ├── controllers/
│   └── users.ts        →    │   └── users.js
├── middlewares/        →    ├── middlewares/
│   └── auth.ts         →    │   └── auth.js
└── prisma/             →    └── prisma/
    └── client.ts       →        └── client.js
```

Isso facilita o debug em produção — a estrutura é familiar, apenas a extensão muda.