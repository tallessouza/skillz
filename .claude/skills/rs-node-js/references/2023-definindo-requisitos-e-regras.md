---
name: rs-node-js-2023-definindo-requisitos-e-regras
description: "Applies structured requirements definition using RFs, RNs, and RNFs when planning a new backend application or API. Use when user asks to 'define requirements', 'plan an API', 'start a new project', 'list features', 'define business rules', or 'plan application architecture'. Enforces separation between functional requirements, business rules, and non-functional requirements. Make sure to use this skill whenever starting a new backend project from scratch or documenting what an application should do. Not for implementing code, writing tests, or database schema design."
---

# Definindo Requisitos e Regras de Negocio

> Antes de escrever codigo, separe o que a aplicacao FAZ (RFs), as CONDICOES de cada funcionalidade (RNs), e as decisoes TECNICAS (RNFs).

## Rules

1. **Requisitos Funcionais descrevem funcionalidades** — use o formato "Deve ser possivel [acao]", porque foca no que o usuario pode fazer, nao em como sera implementado
2. **Regras de Negocio sempre se associam a um RF** — nunca pode existir uma RN solta, porque ela representa os caminhos/condicoes (os `if`s) de um requisito funcional
3. **Requisitos Nao Funcionais sao decisoes tecnicas** — o cliente nunca pediria isso, porque sao escolhas de banco, paginacao, criptografia, autenticacao
4. **Nao confunda RFs com rotas HTTP** — um RF descreve capacidade, nao endpoint, porque a mesma funcionalidade pode ser exposta de varias formas (API, integracao, webhook)
5. **RNs imprescindíveis, nao triviais** — "email duplicado nao pode" e RN, "nome vazio" e validacao basica que se resolve no desenvolvimento
6. **Comece pelos RFs, depois RNs, depois RNFs** — essa ordem parte do mais proximo do usuario ate o mais tecnico

## How to write

### Requisitos Funcionais

```markdown
## RFs (Requisitos Funcionais)

- [ ] Deve ser possivel se cadastrar;
- [ ] Deve ser possivel se autenticar;
- [ ] Deve ser possivel obter o perfil de um usuario logado;
- [ ] Deve ser possivel obter o numero de check-ins realizados pelo usuario logado;
- [ ] Deve ser possivel o usuario obter seu historico de check-ins;
- [ ] Deve ser possivel o usuario buscar academias proximas;
- [ ] Deve ser possivel o usuario buscar academias pelo nome;
- [ ] Deve ser possivel o usuario realizar check-in em uma academia;
- [ ] Deve ser possivel validar o check-in de um usuario;
- [ ] Deve ser possivel cadastrar uma academia;
```

### Regras de Negocio

```markdown
## RNs (Regras de Negocio)

- [ ] O usuario nao deve poder se cadastrar com um e-mail duplicado;
- [ ] O usuario nao pode fazer 2 check-ins no mesmo dia;
- [ ] O usuario nao pode fazer check-in se nao estiver perto (100m) da academia;
- [ ] O check-in so pode ser validado ate 20 minutos apos criado;
- [ ] O check-in so pode ser validado por administradores;
- [ ] A academia so pode ser cadastrada por administradores;
```

### Requisitos Nao Funcionais

```markdown
## RNFs (Requisitos Nao Funcionais)

- [ ] A senha do usuario precisa estar criptografada;
- [ ] Os dados da aplicacao precisam estar persistidos em um banco PostgreSQL;
- [ ] Todas as listas de dados precisam estar paginadas com 20 itens por pagina;
- [ ] O usuario deve ser identificado por um JWT (JSON Web Token);
```

## Example

**Before (misturando tudo):**
```markdown
# Features
- Login com JWT
- Cadastro com senha criptografada
- Check-in com validacao de distancia de 100m
- Listar academias paginadas com 20 itens
```

**After (com separacao correta):**
```markdown
## RFs
- [ ] Deve ser possivel se cadastrar;
- [ ] Deve ser possivel se autenticar;
- [ ] Deve ser possivel realizar check-in em uma academia;
- [ ] Deve ser possivel buscar academias proximas;

## RNs
- [ ] O usuario nao pode fazer check-in se nao estiver perto (100m) da academia;

## RNFs
- [ ] A senha do usuario precisa estar criptografada;
- [ ] O usuario deve ser identificado por um JWT;
- [ ] Todas as listas precisam estar paginadas com 20 itens por pagina;
- [ ] Os dados precisam estar persistidos em um banco PostgreSQL;
```

## Heuristics

| Situacao | Classificacao |
|----------|---------------|
| "O usuario pode fazer X" | RF — funcionalidade |
| "O usuario so pode fazer X se Y" | RN — condicao/caminho |
| "Usar banco Z", "paginar com N itens" | RNF — decisao tecnica |
| "Validacao de campo vazio" | Nem RF nem RN — resolver no codigo |
| "So admin pode fazer X" | RN — autorizacao e regra de negocio |
| "Senha criptografada", "JWT" | RNF — seguranca tecnica |

## Anti-patterns

| Nunca escreva | Escreva no lugar |
|---------------|------------------|
| "Criar rota POST /users" como RF | "Deve ser possivel se cadastrar" |
| RN sem RF associado | Toda RN liga a pelo menos um RF |
| "Nome nao pode ser vazio" como RN | Isso e validacao basica, resolva no codigo |
| Misturar decisoes tecnicas nos RFs | Separe em RNFs (banco, paginacao, auth) |
| Especificar implementacao no RF | RF descreve capacidade, nao endpoint |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-definindo-requisitos-e-regras/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-definindo-requisitos-e-regras/references/code-examples.md)
