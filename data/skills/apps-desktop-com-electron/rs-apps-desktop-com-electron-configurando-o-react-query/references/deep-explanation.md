# Deep Explanation: Configurando React Query no Electron

## Por que React Query funciona com Electron IPC

O insight central desta aula e que a API IPC (Interprocess Communication) do Electron funciona como promises. Quando voce chama `window.api.fetchDocuments()`, o comportamento e identico a uma chamada HTTP com fetch ou Axios: voce envia parametros, recebe uma resposta, e pode usar async/await.

Essa semelhanca significa que ferramentas do ecossistema React feitas para HTTP — como React Query — funcionam perfeitamente com IPC, mesmo que nao haja nenhuma chamada de rede real acontecendo. A comunicacao e entre processos (renderer → main), nao entre cliente e servidor.

## React Query como "must have"

O instrutor (Diego) considera React Query um "must have" em todas as aplicacoes React. A justificativa:

1. **Estados automaticos** — useQuery retorna `data`, `isLoading`, `isError` sem voce precisar criar useState para cada um
2. **Refetch on Focus** — quando o usuario volta para a janela/aba, os dados sao recarregados automaticamente
3. **Refetch on Reconnect** — quando a internet volta, refaz as queries
4. **Intervalo configuravel** — pode definir polling sem setInterval manual
5. **Stale data management** — controle de dados obsoletos (conceito mais avancado)

## Refetch on Focus — O recurso "mais incrivel"

O instrutor destaca esse recurso como uma das coisas mais incriveis do React Query. O funcionamento:

- Toda query visivel na tela e refeita quando o usuario volta o foco para a aplicacao
- Isso faz a aplicacao parecer "tempo real" sem WebSocket
- Exemplo pratico: um dashboard de vendas onde o usuario costuma dar F5 para ver dados atualizados — com React Query, basta voltar para a aba que os dados ja estao frescos

O instrutor demonstrou isso com um `console.log` dentro do queryFn: cada vez que ele clicava na janela do Electron apos tirar o foco, o log aparecia novamente no DevTools, provando que a query era refeita.

### Configuracoes disponiveis no terceiro parametro:

- `refetchOnWindowFocus`: true/false ou funcao customizada
- `refetchOnReconnect`: refetch quando internet volta
- `refetchInterval`: intervalo em ms para polling automatico
- `staleTime`: tempo ate considerar dados obsoletos

## Por que tipar no preload e nao confiar na inferencia

O TypeScript nao consegue inferir tipos atraves do IPC bridge do Electron. Mesmo que o handler no main process retorne um array tipado, o preload nao propaga essa informacao automaticamente. Por isso, e necessario tipar explicitamente o retorno no preload:

```typescript
fetchDocuments: (): Promise<Array<{ id: number; title: string }>> => {
  return ipcRenderer.invoke('fetchDocuments')
}
```

O instrutor menciona que isso esta "hardcoded" e que mais para frente seria separado em tipos proprios.

## Por que manter o async/await explicito

O instrutor preferiu manter:
```typescript
queryFn: async () => {
  const response = await window.api.fetchDocuments()
  return response
}
```

Em vez de simplificar para:
```typescript
queryFn: () => window.api.fetchDocuments()
```

A razao: futuramente, o retorno nao sera o array direto, mas um objeto contendo `{ data: [...] }`, entao ter o response explicito facilita a transformacao posterior.

## Analogia IPC = HTTP

A analogia central da aula: pensar em `window.api.method()` como se fosse `fetch('/api/endpoint')`. Ambos:
- Sao assincronos (promises)
- Aceitam parametros
- Retornam respostas
- Podem falhar

Essa analogia e o que desbloqueia o uso de todo o ecossistema de data fetching do React (React Query, SWR, etc.) dentro de apps Electron.