# Code Examples: Requisitos da Aplicacao

## Documento de requisitos usado na aula

Este e o formato exato que Diego criou durante a aula, salvo como README na raiz do projeto:

```markdown
# App

## Requisitos Funcionais

- [ ] O usuario deve poder criar uma nova transacao
- [ ] O usuario deve poder obter um resumo da sua conta
- [ ] O usuario deve poder listar todas as transacoes que ja ocorreram
- [ ] O usuario deve poder visualizar uma transacao unica

## Regras de Negocio

- [ ] A transacao pode ser do tipo credito que somara ao valor total, ou debito que subtraira
- [ ] Deve ser possivel identificarmos o usuario entre as requisicoes
- [ ] O usuario so pode visualizar transacoes o qual ele criou

## Requisitos Nao Funcionais
```

## Como cada RF mapeia para rotas (projecao)

```
RF: Criar nova transacao          → POST   /transactions
RF: Listar todas as transacoes    → GET    /transactions
RF: Visualizar transacao unica    → GET    /transactions/:id
RF: Obter resumo da conta         → GET    /transactions/summary
```

## Como cada RN impacta a implementacao

### RN: Transacao credito/debito

```typescript
// A regra de negocio define que o TIPO determina o comportamento
// Credito SOMA, debito SUBTRAI

// Isso impacta o schema:
await knex('transactions').insert({
  id: randomUUID(),
  title,
  amount: type === 'credit' ? amount : amount * -1,
  // Armazenar credito como positivo, debito como negativo
  // simplifica o calculo de resumo
})
```

### RN: Identificar usuario entre requisicoes

```typescript
// A RN nao diz COMO — apenas que deve ser possivel
// A decisao tecnica (RNF) sera: cookies de sessao

// Sem autenticacao formal (email/senha)
// Apenas um session_id no cookie que identifica o usuario
```

### RN: Usuario so ve suas transacoes

```typescript
// Esta RN aplica-se a TODAS as rotas de leitura:
// - GET /transactions
// - GET /transactions/:id
// - GET /transactions/summary

// Sempre filtrar por session_id do cookie
const transactions = await knex('transactions')
  .where('session_id', sessionId)
  .select()
```

## Template reutilizavel para novos projetos

```markdown
# {Nome do Projeto}

## Requisitos Funcionais

- [ ] {O usuario deve poder [acao]}
- [ ] {O usuario deve poder [acao]}

## Regras de Negocio

- [ ] {[Condicao/restricao sobre uma funcionalidade]}
- [ ] {[Validacao que o sistema deve respeitar]}

## Requisitos Nao Funcionais

- [ ] {[Decisao tecnica: tecnologia, estrategia, constraint]}
```

## Progresso durante o desenvolvimento

Conforme implementa, marque os itens:

```markdown
## Requisitos Funcionais

- [x] O usuario deve poder criar uma nova transacao
- [x] O usuario deve poder listar todas as transacoes que ja ocorreram
- [ ] O usuario deve poder obter um resumo da sua conta
- [ ] O usuario deve poder visualizar uma transacao unica
```