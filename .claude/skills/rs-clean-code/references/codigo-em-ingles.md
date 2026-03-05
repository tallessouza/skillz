---
name: rs-clean-code-codigo-em-ingles
description: "Enforces writing all code exclusively in English — variables, functions, database tables, file names. Use when user asks to 'create a function', 'name a variable', 'design a schema', 'write code', or any code generation task. Applies rule: never mix Portuguese and English in code, use translator if needed. Make sure to use this skill whenever generating code in any context, even if the user writes in Portuguese. Not for documentation, README files, or user-facing UI strings."
---

# Codigo em Ingles

> Todo codigo deve ser escrito inteiramente em ingles — variaveis, funcoes, tabelas, arquivos — sem excecao.

## Rules

1. **Escreva tudo em ingles** — variaveis, funcoes, classes, tabelas do banco, nomes de arquivos, porque a linguagem de programacao ja e em ingles e misturar idiomas quebra a leitura
2. **Nunca misture idiomas** — `loadPessoa` e inaceitavel, porque leitores de tela nao conseguem diferenciar dois idiomas no mesmo codigo, tornando-o inacessivel
3. **Use tradutor se necessario** — um erro de traducao e melhor que codigo em portugues, porque o codigo misto e ilegivel para uma parcela significativa de desenvolvedores com deficiencia visual
4. **"Padronizar em portugues" nao e valido** — mesmo que o time inteiro concorde, codigo em portugues continua inacessivel e incompativel com o ecossistema global de desenvolvimento
5. **Inclua o banco de dados** — tabelas, colunas, constraints, tudo em ingles, porque queries misturam SQL (ingles) com seus nomes e a inconsistencia dificulta a leitura

## How to write

### Funcoes e variaveis

```typescript
// Tudo em ingles, sem excecao
function loadUser(userId: string) { ... }
const activeUsers = users.filter(user => user.isActive)
const scheduledAppointments = getAppointmentsByDate(today)
```

### Tabelas do banco

```sql
-- Nomes de tabelas e colunas em ingles
CREATE TABLE appointments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) DEFAULT 'pending'
);
```

## Example

**Before (codigo misto — inacessivel):**

```typescript
function loadPessoa(pessoaId: string) {
  const endereco = getEnderecoByPessoaId(pessoaId)
  const contatos = listContatosByPessoa(pessoaId)
  return { pessoa, endereco, contatos }
}
```

**After (com esta skill aplicada):**

```typescript
function loadPerson(personId: string) {
  const address = getAddressByPersonId(personId)
  const contacts = listContactsByPerson(personId)
  return { person, address, contacts }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nao sabe a traducao exata | Use Google Translate — erro de traducao e melhor que portugues |
| Termo de dominio brasileiro (CPF, CNPJ, boleto) | Use o termo original como nome proprio: `cpf`, `cnpj`, `boleto` |
| Time quer padronizar em portugues | Recuse — acessibilidade nao e negociavel |
| Comentarios no codigo | Ingles tambem, para manter consistencia |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `loadPessoa()` | `loadPerson()` |
| `listarUsuarios()` | `listUsers()` |
| `const endereco = ...` | `const address = ...` |
| `tabela pedidos` | `table orders` |
| `calcularDesconto()` | `calculateDiscount()` |
| `const dataNascimento = ...` | `const birthDate = ...` |
| `verificarDisponibilidade()` | `checkAvailability()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/clean-code/rs-clean-code-codigo-em-ingles/references/deep-explanation.md)
- [Code examples](../../../data/skills/clean-code/rs-clean-code-codigo-em-ingles/references/code-examples.md)
