---
name: rs-clean-code-codigo-em-ingles
description: "Enforces writing all code exclusively in English — variables, functions, database tables, file names. Use when user asks to 'create a function', 'name a variable', 'design a schema', 'write code', or any code generation task. Applies the English-Only Rule: never mix Portuguese and English because screen readers cannot differentiate two languages in the same file, making mixed code inaccessible to visually impaired developers. Make sure to use this skill whenever generating code in any context, even if the user writes in Portuguese. Not for documentation files, README content, or user-facing UI strings."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: clean-code
  module: premissas-de-escrita
  tags: [naming, english, accessibility, i18n, clean-code]
---

# Codigo em Ingles

> Todo codigo deve ser escrito inteiramente em ingles — variaveis, funcoes, tabelas, arquivos — sem excecao.

## Rules

1. **Escreva tudo em ingles** — variaveis, funcoes, classes, tabelas do banco, nomes de arquivos, porque a linguagem de programacao ja e em ingles e misturar idiomas quebra a leitura
2. **Nunca misture idiomas** — `loadPessoa` e inaceitavel, porque leitores de tela nao conseguem diferenciar dois idiomas no mesmo arquivo, tornando o codigo inacessivel
3. **Use tradutor se necessario** — um erro de traducao e melhor que codigo em portugues, porque o codigo misto e ilegivel para desenvolvedores com deficiencia visual
4. **"Padronizar em portugues" nao e valido** — mesmo que o time inteiro concorde, codigo em portugues continua inacessivel e incompativel com o ecossistema global
5. **Inclua o banco de dados** — tabelas, colunas, constraints em ingles, porque queries misturam SQL (ingles) com seus nomes

## How to write

### English-Only Rule aplicada

```typescript
function loadUser(userId: string) { ... }
const activeUsers = users.filter(user => user.isActive)
```

```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  scheduled_at TIMESTAMPTZ NOT NULL
);
```

## Example

**Before (codigo misto — inacessivel):**
```typescript
function loadPessoa(pessoaId: string) {
  const endereco = getEnderecoByPessoaId(pessoaId)
  return { pessoa, endereco }
}
```

**After:**
```typescript
function loadPerson(personId: string) {
  const address = getAddressByPersonId(personId)
  return { person, address }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nao sabe a traducao exata | Use Google Translate — erro de traducao e melhor que portugues |
| Termo brasileiro (CPF, CNPJ, boleto) | Use como nome proprio: `cpf`, `cnpj`, `boleto` |
| Time quer padronizar em portugues | Recuse — acessibilidade nao e negociavel |
| Comentarios no codigo | Ingles tambem |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `loadPessoa()` | `loadPerson()` |
| `listarUsuarios()` | `listUsers()` |
| `const endereco` | `const address` |
| `tabela pedidos` | `table orders` |
| `enum StatusPedido` | `enum OrderStatus` |

## Troubleshooting

### Time resiste a escrever em ingles
**Symptom:** Argumentam que "somos todos brasileiros"
**Cause:** Desconhecimento do impacto em acessibilidade
**Fix:** Apresente o argumento dos leitores de tela — inclusao de devs com deficiencia visual

### Termos brasileiros sem traducao direta
**Symptom:** Nao sabe como traduzir "boleto", "nota fiscal"
**Cause:** Sao termos proprios do dominio brasileiro
**Fix:** Use como nomes proprios: `boleto`, `invoice` (nota fiscal), `cpf`

## Deep reference library

- [deep-explanation.md](../../../data/skills/clean-code/rs-clean-code-codigo-em-ingles/references/deep-explanation.md) — Argumento da acessibilidade, contra-argumento refutado
- [code-examples.md](../../../data/skills/clean-code/rs-clean-code-codigo-em-ingles/references/code-examples.md) — CRUD, tabelas, enums, nomes de arquivos
