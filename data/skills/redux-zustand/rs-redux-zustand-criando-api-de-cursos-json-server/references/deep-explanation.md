# Deep Explanation: Criando API com JSON Server

## Por que simular uma API?

O instrutor explica que em aplicacoes reais, os dados do estado (como cursos, modulos e aulas) vem de uma API externa, nao de dados estaticos no codigo. Ele descreve isso como "um pouquinho mais delicado" porque introduz assincronia, loading states e tratamento de erros que nao existem com dados hardcoded.

A decisao de usar json-server em vez de criar um backend real com Node e intencional — o foco da aula e no gerenciamento de estado (Redux/Zustand), nao na construcao de APIs. O json-server permite ter uma API REST completa em segundos.

## O papel do delay

O instrutor adiciona `-d 500` (500ms de delay) deliberadamente. A justificativa e dupla:

1. **Realismo** — APIs reais tem latencia, e desenvolver sem ela cria uma falsa sensacao de que tudo e instantaneo
2. **UI de loading** — forca o desenvolvedor a implementar indicadores de carregamento, o que melhora a experiencia do usuario

Sem o delay, e tentador ignorar estados de loading porque "funciona rapido", mas em producao com rede lenta o usuario veria uma tela em branco.

## Conversao JavaScript para JSON

Um ponto pratico importante da aula: o instrutor pegou os dados que estavam como objeto JavaScript e converteu para JSON. As diferencas que ele precisou ajustar:

- Aspas simples → aspas duplas
- Chaves sem aspas → chaves com aspas duplas
- Trailing commas (virgulas apos ultimo item) → removidas

Isso e um erro comum que quebra o json-server silenciosamente.

## Centralizacao com Axios

O instrutor cria `src/lib/axios.ts` com `axios.create()` para centralizar a configuracao. O beneficio principal e que a `baseURL` fica definida em um unico lugar. Se a URL mudar (por exemplo, de `localhost:3000` para uma API de staging), so precisa mudar em um arquivo.

## Arquitetura de desenvolvimento

O setup final envolve dois processos rodando em paralelo:
- O frontend (Vite/React) em uma porta
- O json-server em outra porta (3000)

Isso simula a separacao real entre frontend e backend que existe em producao.