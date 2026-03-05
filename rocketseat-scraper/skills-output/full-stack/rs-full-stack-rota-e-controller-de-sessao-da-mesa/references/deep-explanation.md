# Deep Explanation: Rota e Controller de Sessao da Mesa

## Contexto do Projeto

Este padrao vem de uma API de restaurante onde "tables sessions" representa a sessao de uma mesa — quando um cliente abre/ocupa uma mesa. A tabela `tables_sessions` no banco comeca vazia e o endpoint POST permite criar uma nova sessao (abrir uma mesa).

## Por que classe controller?

O instrutor usa classe ao inves de funcoes soltas porque:
- Agrupa todos os metodos de um recurso (create, index, update, delete) num unico lugar
- Facilita injecao de dependencias futuras (services, repositories)
- Padrao consistente: todo recurso = 1 classe controller
- Export nomeado permite importacao clara

## Por que separar arquivos de rotas?

O instrutor explicitamente menciona: "eu prefiro criar separado" ao inves de colocar tudo num arquivo de rotas unico. Razoes:
- Cada recurso tem seu arquivo de rotas independente
- Facilita navegacao no projeto
- Permite adicionar middlewares especificos por recurso sem poluir outros
- O index.ts fica limpo — apenas registra prefixos

## Padrao de prefixo no index vs raiz no arquivo

Decisao arquitetural importante demonstrada:
- **index.ts:** `routes.use("/tables-sessions", tablesSessionsRoutes)` — define o prefixo
- **tables-sessions-routes.ts:** `tablesSessionsRoutes.post("/", ...)` — usa apenas raiz

Isso evita duplicacao. Se o prefixo estivesse nos dois lugares, a rota final seria `/tables-sessions/tables-sessions`.

## Try/catch com next()

Todo metodo do controller segue o padrao:
```typescript
try {
  // logica
} catch (error) {
  next(error)
}
```

O `next(error)` delega o erro para o error handler middleware do Express (definido em outro lugar da aplicacao). Isso centraliza o tratamento de erros e evita respostas inconsistentes.

## Fluxo de teste

O instrutor testa incrementalmente:
1. Cria o controller com resposta dummy (apenas `response.status(201).json()`)
2. Cria a rota
3. Registra no index
4. Testa com cliente HTTP (Insomnia/similar)
5. Confirma que o 201 retorna
6. So depois adiciona logica real

Esse padrao de "testar o esqueleto primeiro" evita debugging complexo — voce sabe que a rota funciona antes de adicionar logica de banco.

## Organizacao do cliente HTTP

O instrutor organiza as requisicoes em pastas separadas no cliente HTTP:
- Pasta "Tables" para endpoints de mesas
- Pasta "Tables Sessions" para endpoints de sessoes de mesa
- Cada pasta com seu resource (base URL + path)

Isso reflete a mesma separacao do codigo.

## Nomenclatura

- Controller: `tables-sessions-controller.ts` (kebab-case, sufixo -controller)
- Rotas: `tables-sessions-routes.ts` (kebab-case, sufixo -routes)
- Classe: `TablesSessionsController` (PascalCase)
- Variavel de rotas: `tablesSessionsRoutes` (camelCase)
- Variavel de controller: `tablesSessionsController` (camelCase)
- Endpoint: `/tables-sessions` (kebab-case com prefixo no index)