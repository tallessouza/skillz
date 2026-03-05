---
name: rs-node-js-2023-requisitos-da-aplicacao
description: "Enforces requirements-first planning before implementing any backend API. Use when user asks to 'create an API', 'build a REST API', 'start a new backend project', 'plan an application', or 'define routes'. Applies the RF/RN/RNF framework: functional requirements, business rules, and non-functional requirements must be defined before writing code. Make sure to use this skill whenever starting a new backend project or adding a major feature set. Not for frontend-only tasks, UI design, or individual bug fixes."
---

# Requisitos da Aplicacao

> Antes de criar rotas ou escrever codigo, defina requisitos funcionais, regras de negocio e requisitos nao funcionais.

## Key concept

Toda aplicacao backend deve ser planejada em tres dimensoes antes da implementacao:

1. **Requisitos Funcionais (RF)** — O QUE o usuario pode fazer (acoes, funcionalidades)
2. **Regras de Negocio (RN)** — CONDICOES e validacoes que o sistema deve respeitar
3. **Requisitos Nao Funcionais (RNF)** — COMO atingir cada funcionalidade (tecnologias, estrategias)

RNF podem ser definidos conforme as features surgem. RF e RN devem existir antes de qualquer codigo.

## Decision framework

| Quando voce encontra | Aplique |
|---------------------|---------|
| Inicio de projeto backend | Listar RF, RN e RNF antes de criar rotas |
| Nova feature grande | Adicionar RF e RN correspondentes antes de implementar |
| Duvida sobre comportamento | Consultar RN — se nao existe, criar antes de codar |
| Escolha de tecnologia/estrategia | Documentar como RNF |

## How to apply

### Step 1: Listar Requisitos Funcionais

Descreva cada acao que o usuario pode executar:

```markdown
## Requisitos Funcionais

- [ ] O usuario deve poder criar uma nova transacao
- [ ] O usuario deve poder obter um resumo da sua conta
- [ ] O usuario deve poder listar todas as transacoes que ja ocorreram
- [ ] O usuario deve poder visualizar uma transacao unica
```

### Step 2: Definir Regras de Negocio

Para cada RF, pergunte: "Que condicoes, restricoes ou validacoes existem?"

```markdown
## Regras de Negocio

- [ ] A transacao pode ser do tipo credito (soma ao valor total) ou debito (subtrai do valor total)
- [ ] Deve ser possivel identificar o usuario entre as requisicoes
- [ ] O usuario so pode visualizar transacoes que ele criou
```

Regras de negocio sao **agnósticas de tecnologia** — descrevem O QUE deve acontecer, nao COMO. "Identificar o usuario entre requisicoes" nao diz se sera JWT, cookie ou session — isso e RNF.

### Step 3: Requisitos Nao Funcionais (incrementais)

Definir conforme as features surgem:

```markdown
## Requisitos Nao Funcionais

- [ ] Identificacao do usuario via cookies de sessao
- [ ] Banco de dados SQLite com Knex.js
```

### Step 4: Usar como checklist durante desenvolvimento

Marcar cada item conforme implementado. Salvar na raiz do projeto (README.md ou doc dedicado).

## Example

**Before (pular direto para codigo):**
```typescript
// Comeca criando rotas sem saber o escopo
app.post('/transactions', async (req, res) => { /* ... */ })
app.get('/transactions', async (req, res) => { /* ... */ })
// Esquece regra de isolamento por usuario
// Descobre tarde que precisa de resumo
// Refatora tudo
```

**After (com planejamento RF/RN/RNF):**
```markdown
# RF
- [ ] Criar transacao
- [ ] Listar transacoes
- [ ] Visualizar transacao unica
- [ ] Obter resumo da conta

# RN
- Transacao: credito (soma) ou debito (subtrai)
- Identificar usuario entre requisicoes
- Usuario so ve suas proprias transacoes

# RNF
- (definir conforme implementacao)
```
Resultado: escopo claro, nenhuma feature esquecida, regras de isolamento definidas desde o inicio.

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto pessoal simples | RF + RN minimos no README |
| Projeto com equipe | RF + RN + RNF em doc compartilhado |
| Duvida se algo e RF ou RN | RF = acao do usuario; RN = condicao/restricao sobre a acao |
| Duvida se algo e RN ou RNF | RN = regra de negocio (sem tecnologia); RNF = decisao tecnica |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Sair criando rotas sem listar funcionalidades | Documentar RF e RN antes de qualquer `app.get/post` |
| Misturar decisoes tecnicas nas regras de negocio | RN descreve O QUE, RNF descreve COMO |
| Ignorar regras de isolamento entre usuarios | Sempre perguntar: "dados de um usuario vazam para outro?" |
| Definir todos os RNF no inicio | RNF podem ser incrementais, definidos conforme features surgem |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-requisitos-da-aplicacao/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-requisitos-da-aplicacao/references/code-examples.md)
