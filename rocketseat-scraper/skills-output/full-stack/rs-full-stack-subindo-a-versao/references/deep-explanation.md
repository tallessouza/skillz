# Deep Explanation: Subindo a Versão

## Por que especificar versões exatas?

O instrutor enfatiza que ao instalar uma versão específica, o npm faz "exatamente aquilo que eu pedi". Isso é crucial porque:

1. **Reprodutibilidade** — Outro desenvolvedor rodando `npm i` vai obter as mesmas versões
2. **Previsibilidade** — Você sabe exatamente qual código está entrando no seu projeto
3. **Controle** — Em caso de bug, você sabe qual versão causou o problema

## Tags de versão no NPM

O instrutor menciona duas tags importantes ao navegar o npmjs.com:

- **latest (listed)** — A versão estável recomendada. O instrutor diz: "recomendado é utilizar a última versão estável, ela vai estar com essa tag de latest"
- **next** — A próxima versão que está para vir. O instrutor nota que "já fica disponível para ser utilizada" mas não é a recomendada

## Filtrando por major version

O instrutor demonstra usar o semver.npmjs.com para filtrar versões compatíveis:

- Coloca o nome do pacote (ex: `express`)
- Usa o range `4.x` para listar apenas versões na faixa do 4
- Isso mostra "todas as versões que são compatíveis" dentro daquela major

A lógica é: se seu projeto já usa Express 4, você quer subir dentro da faixa 4.x para evitar breaking changes que viriam com a major 5.

## O conceito de "double check"

O instrutor enfatiza um passo que muitos desenvolvedores esquecem: após forçar versões específicas, rodar `npm i` novamente. Ele diz: "sempre que você atualiza, é importante rodar um comando, como eu fui e forcei, só para dar um double check, um npm i, para ele atualizar as dependências."

Isso garante que:
- O `package-lock.json` está sincronizado com o `package.json`
- Todas as sub-dependências foram resolvidas corretamente
- Não há conflitos entre as versões instaladas

## Fluxo mental do instrutor

1. Ir ao npmjs.com e verificar a versão "listed" (estável)
2. Ir ao semver.npmjs.com para filtrar por major version
3. Escolher uma versão específica dentro da faixa desejada
4. Instalar com `npm i pacote@versão`
5. Repetir para cada pacote que precisa atualizar
6. Rodar `npm i` final como double check

## Múltiplas bibliotecas

O instrutor demonstra o processo com duas bibliotecas diferentes (Express e jsonwebtoken) para mostrar que o fluxo é o mesmo independente do pacote. A consistência do processo é o que importa: consultar → escolher versão → instalar com @ → double check.