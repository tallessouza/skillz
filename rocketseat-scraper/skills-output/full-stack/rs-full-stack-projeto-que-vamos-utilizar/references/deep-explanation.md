# Deep Explanation: Preparar Projeto Node.js TypeScript para Docker

## Por que separar dev, build e start?

O instrutor demonstra tres momentos distintos do ciclo de vida de uma aplicacao Node.js com TypeScript:

1. **Desenvolvimento (`dev`):** Executa TypeScript diretamente. Mudancas no codigo fonte refletem imediatamente (hot-reload). Ideal para iteracao rapida.

2. **Build (`build`):** Converte TypeScript para JavaScript puro. Gera a pasta `dist/` com os arquivos `.js`. Esse passo e necessario porque Node.js nao executa TypeScript nativamente em producao.

3. **Producao (`start`):** Executa o JavaScript puro da pasta `dist/` usando `node`. Nao ha compilacao em tempo de execucao, o que e mais performatico e previsivel.

## A armadilha do "mudei mas nao atualizou"

O instrutor demonstra explicitamente este cenario:

1. Aplicacao rodando com `npm start` (producao)
2. Muda o codigo em `src/server.ts` de "hello world" para "hello docker"
3. Recarrega o navegador — **nao muda**
4. Muda diretamente em `dist/server.js` — **tambem nao muda** (porque o processo Node ja carregou o arquivo em memoria)

**Conclusao do instrutor:** Em producao, para atualizar o conteudo:
- Parar a aplicacao
- Rodar `npm run build` (atualiza `dist/`)
- Reiniciar com `npm start`

Isso e exatamente o que um Dockerfile faz: copia o codigo, roda build, e define `npm start` como comando de execucao.

## Por que isso importa para Docker

O instrutor escolheu esse projeto simples propositalmente — o foco e Docker, nao a aplicacao. Mas a separacao dev/build/start e fundamental porque:

- **Dockerfile de producao** executa `npm run build` durante a construcao da imagem
- **CMD ou ENTRYPOINT** executa `npm start`
- O container roda apenas JavaScript compilado, sem dependencias de desenvolvimento

## npm start vs npm run start

O instrutor destaca que `start` e um script padrao do npm. Diferente de scripts customizados (como `dev` ou `build`), voce nao precisa do `run`:

```bash
npm start        # funciona (script padrao)
npm run start    # tambem funciona
npm run dev      # precisa do "run" (script customizado)
```

## O papel da pasta dist

A pasta `dist` (abreviacao de "distribution") e o artefato de build. Contem apenas JavaScript puro, pronto para execucao pelo Node.js. O `outDir` no `tsconfig.json` controla onde esses arquivos sao gerados.

O instrutor configura `"outDir": "./dist"` e mostra que apos `npm run build`, o arquivo `dist/server.js` contem o mesmo codigo do `src/server.ts`, mas convertido para JavaScript puro — sem tipos, sem sintaxe TypeScript.