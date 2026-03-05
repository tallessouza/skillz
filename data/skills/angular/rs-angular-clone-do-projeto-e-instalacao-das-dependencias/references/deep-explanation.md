# Deep Explanation: Clone do Projeto e Instalacao das Dependencias

## Por que package.json separados?

O instrutor enfatiza a separacao de `package.json` entre front e back-end como uma pratica importante para projetos reais. As razoes:

1. **Gerenciamento independente de dependencias** — front-end e back-end tem ecossistemas diferentes. Misturar tudo em um unico `package.json` cria confusao sobre o que pertence a cada camada.

2. **Deploy facilitado** — em producao, voce pode fazer deploy do front e back separadamente. Com um unico `package.json`, voce instalaria dependencias desnecessarias em cada ambiente.

3. **Organizacao** — fica claro para qualquer desenvolvedor do time qual `package.json` gerencia qual parte do projeto.

## npm run dev vs build+start

O instrutor explica uma nuance importante sobre o modo de desenvolvimento do back-end:

- **`npm run dev`**: Usa hot-reload (provavelmente nodemon ou ts-node-dev). Toda vez que um arquivo e salvo, o servidor reinicia automaticamente. Porem, quando operacoes de escrita em arquivos JSON acontecem, o servidor detecta a mudanca e reinicia — destruindo o processo e recriando. Se requisicoes chegam durante essa janela de reinicio, retornam erro porque o servidor ainda nao esta disponivel.

- **`npm run build` + `npm run start`**: Compila TypeScript para JavaScript uma vez (gerando a pasta `dist/`) e depois serve o codigo compilado. Sem hot-reload, mas estavel para testes e uso continuo.

A recomendacao do instrutor: use `build+start` para estabilidade durante o curso. Use `dev` apenas quando estiver ativamente desenvolvendo codigo no back-end.

## Estrutura do monorepo

```
angular-gerenciador-filmes/
├── src/                    # Codigo Angular (front-end)
├── package.json            # Dependencias do front-end
├── node_modules/           # Deps do front-end
└── server/
    ├── package.json        # Dependencias do back-end
    ├── node_modules/       # Deps do back-end
    └── dist/               # Codigo compilado (apos npm run build)
```

## Ordem critica das operacoes

O instrutor destaca varias vezes a importancia da ordem:

1. **Branch antes de install** — mudar para a branch correta ANTES de `npm install`, porque branches diferentes podem ter `package.json` diferentes
2. **Build antes de start** — o `start` executa JavaScript da pasta `dist/`, que so existe apos o `build`
3. **Front install na raiz, back install na pasta server** — nao confundir os dois

## Dica do VS Code

O instrutor mostra como usar multiplos terminais no VS Code para rodar front e back simultaneamente:
- Terminal > New Terminal
- Clicar com botao direito na aba do terminal > Rename
- Nomear "front-end" e "back-end" para identificacao facil
- Nota: ao fechar o VS Code, essas configuracoes de terminal sao perdidas