# Deep Explanation: Buscando Dados da API com Async/Await

## Por que async/await e nao .then()?

O instrutor usa `await` diretamente no corpo da funcao do modulo. Isso torna o codigo linear e legivel — voce le de cima para baixo como codigo sincrono. O erro mais comum que ele destaca e esquecer de marcar a funcao como `async`. O JavaScript nao da um erro claro em todos os contextos — as vezes retorna uma Promise nao resolvida silenciosamente.

## Por que passar parametros como objeto?

O instrutor explica explicitamente: "eu gosto de usar objetos porque fica mais flexivel". A razao tecnica:

- **Ordem nao importa**: `{ date, userId }` funciona igual a `{ userId, date }`
- **Extensibilidade**: adicionar um novo parametro nao quebra chamadas existentes
- **Autodocumentacao**: no call site voce ve `{ date }` em vez de um valor solto

Isso e especialmente importante em projetos que crescem — funcoes que comecam com 1 parametro frequentemente ganham 2, 3, 4. Com objetos, nenhuma chamada existente quebra.

## Separacao fetch vs render

O instrutor deliberadamente NAO renderiza na mesma aula. Ele faz o fetch, valida com console.log, e deixa a renderizacao para a proxima aula. Isso reflete um principio importante:

1. **Buscar dados** — responsabilidade do service/loader
2. **Validar dados** — console.log temporario, removido depois
3. **Renderizar dados** — metodo separado, dedicado

Essa separacao permite:
- Testar o fetch independente da UI
- Reutilizar o fetch em outros contextos
- Debugar problemas de dados vs problemas de renderizacao separadamente

## Estrutura de modulos no projeto

O projeto segue esta organizacao:
```
modules/
  schedules/
    load.js          # Funcao que carrega dados (async)
    services/
      schedule-fetch-by-day.js  # Service que faz o fetch na API
```

O `load.js` importa do `services/` e orquestra: busca dados, depois renderiza. Cada service faz uma unica coisa (buscar agendamentos filtrados por dia).

## Validacao com console.log

O instrutor demonstra ao vivo: muda o `server.json` (remove "Goncalves" do nome), recarrega a pagina, e confirma no console que os dados mudaram. Isso prova que:
- O fetch esta realmente batendo na API
- Os dados nao estao cacheados ou hardcoded
- A filtragem por dia funciona

Essa tecnica de validacao e essencial antes de investir tempo construindo UI.

## Extensao .js no import

O instrutor menciona colocar a extensao `.js` no import. Em projetos vanilla (sem bundler), a extensao e obrigatoria para o browser resolver o modulo. Mesmo com bundler, e boa pratica ser explicito.