# Deep Explanation: Server Actions e Server Functions

## Server Functions vs Server Actions — A Distinção Fundamental

O instrutor faz uma distinção crucial usando teoria de conjuntos:

- **Server Functions** = conjunto maior. Qualquer funcao marcada com `'use server'` que executa exclusivamente no servidor.
- **Server Actions** = subconjunto. Server functions que performam uma AÇÃO — mutação de dados (criar, editar, deletar).

### Analogia do Instrutor (Diagrama de Conjuntos)

```
┌─────────────────────────────────┐
│       Server Functions          │
│                                 │
│   - Gerar relatório             │
│   - Buscar dados                │
│   - Consultar banco             │
│                                 │
│   ┌───────────────────────┐     │
│   │   Server Actions      │     │
│   │                       │     │
│   │   - Criar usuário     │     │
│   │   - Deletar prompt    │     │
│   │   - Editar dados      │     │
│   └───────────────────────┘     │
└─────────────────────────────────┘
```

**Toda server action É uma server function, mas nem toda server function é uma server action.**

Exemplos:
- `gerarRelatorio()` → consulta banco, retorna dados → **server function** (não muta nada)
- `criarUsuario()` → insere no banco → **server action** (mutação)
- `searchPromptAction()` → busca dados → **server function** (apesar do sufixo "action" usado por convenção do useActionState)

## Por que o `previousState` é obrigatório

O hook `useActionState` do React exige que a server function receba o estado anterior como primeiro parâmetro. Isso permite:

1. O React gerenciar o ciclo de vida do estado do formulário
2. Atualizações otimistas baseadas no estado anterior
3. Consistência entre renders

Quando o previous state não é necessário (como em busca simples), use `_` como convenção para indicar parâmetro não utilizado.

## Organização em Arquivo Dedicado

O instrutor organiza todas as actions em `app/actions/prompt-actions.ts` com `'use server'` no topo do arquivo. Isso significa que TODAS as funções exportadas desse arquivo são server functions. Alternativa seria colocar `'use server'` dentro de cada função individual.

Duas formas válidas:
```typescript
// Forma 1: Diretiva no arquivo (todas as funções)
'use server'
export async function search() { ... }
export async function create() { ... }

// Forma 2: Diretiva na função (granular)
export async function search() {
  'use server'
  // ...
}
```

O instrutor prefere a Forma 1 quando o arquivo é dedicado a server functions.

## Padrão de Busca com Prisma

A busca implementada usa OR para pesquisar em múltiplos campos (title E content) com `mode: 'insensitive'` para case-insensitive. Quando não há termo, passa `undefined` no `where`, o que faz o Prisma retornar todos os registros — comportamento elegante sem necessidade de if/else separado.

## Mapeamento para Summaries

O instrutor mapeia os resultados do Prisma para um formato resumido (`{ id, title, content }`) antes de retornar. Isso evita enviar dados desnecessários do servidor para o cliente e cria um contrato explícito entre server e client.