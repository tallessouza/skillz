---
name: rs-seguranca-devs-input-validation
description: "Enforces paranoid input validation patterns when writing backend code that handles user input. Use when user asks to 'create an API endpoint', 'handle form data', 'process payments', 'generate CSV', 'export to Excel', or any code that receives external data. Applies rules: validate types before processing, reject fractional values in integer fields, sanitize strings before export, never trust user input in generated files. Make sure to use this skill whenever writing code that accepts user input, even for internal tools. Not for frontend UI validation, authentication flows, or cryptography."
---

# Input Validation — Paranoia como Padrão

> Toda entrada de usuario e hostil ate que se prove o contrario. Valide tipo, formato e intencao antes de qualquer processamento.

## Rules

1. **Valide o tipo antes de operar** — `if (valor !== parseInt(valor))` antes de qualquer operacao financeira, porque arredondamento silencioso cria dinheiro do nada
2. **Nunca confie em arredondamento implicito** — banco de dados trunca silenciosamente, `Math.round` esconde erros; rejeite a entrada invalida em vez de corrigi-la, porque corrigir silenciosamente transforma bug em falha de seguranca
3. **Sanitize dados antes de exportar para CSV/Excel** — campos que comecam com `=`, `+`, `-`, `@` podem executar formulas no Excel/LibreOffice, porque o arquivo gerado roda na maquina do usuario com permissoes dele
4. **Use frameworks que forcam tipagem nas entradas** — FastAPI (Python), Zod (TypeScript), class-validator (NestJS), porque validacao manual e esquecida, validacao por schema e automatica
5. **Bug nao explorado ainda e falha de seguranca futura** — trate todo bug de validacao como severidade HIGH, porque a diferenca entre bug e exploit e apenas a intencao de quem encontrou

## How to write

### Validacao de tipo em operacoes financeiras

```typescript
function transfer(from: string, to: string, amount: number): void {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("Valor invalido: apenas inteiros positivos sao permitidos");
  }
  // Somente processa apos validacao
  balances[from] -= amount;
  balances[to] += amount;
}
```

### Sanitizacao de campos para CSV/Excel

```typescript
function sanitizeForCsv(value: string): string {
  // Caracteres que iniciam formulas em planilhas
  const dangerousPrefixes = ["=", "+", "-", "@", "\t", "\r"];
  if (dangerousPrefixes.some((p) => value.startsWith(p))) {
    return `'${value}`; // Prefixo de aspas simples neutraliza formulas
  }
  return value;
}
```

### Validacao com schema (Zod)

```typescript
const TransferSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  amount: z.number().int().positive(),
});

function transfer(input: unknown) {
  const { from, to, amount } = TransferSchema.parse(input);
  // Input garantidamente valido aqui
}
```

## Example

**Before (bug que vira exploit):**
```javascript
const balances = { alice: 100, bob: 1, laranja: 0 };

function transfer(from, to, amount) {
  amount = Math.round(amount); // Arredonda silenciosamente
  balances[from] -= amount;
  balances[to] += amount;
}

// Atacante envia 0.5 repetidamente:
// Alice nao perde nada (round(0.5) na subtracao = 0)
// Bob ganha 1 a cada iteracao (round(0.5) na soma = 1)
// Dinheiro surge do nada
```

**After (validacao paranoica):**
```javascript
const balances = { alice: 100, bob: 1, laranja: 0 };

function transfer(from, to, amount) {
  if (!Number.isInteger(amount) || amount <= 0) {
    console.log("Valor invalido: apenas inteiros positivos sao permitidos");
    return;
  }
  if (balances[from] < amount) {
    console.log("Saldo insuficiente");
    return;
  }
  balances[from] -= amount;
  balances[to] += amount;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Campo financeiro (preco, saldo, creditos) | Rejeite valores nao-inteiros; trabalhe em centavos |
| Campo que sera exportado para CSV/Excel | Sanitize prefixos de formula (`=`, `+`, `-`, `@`) |
| Campo de texto livre | Limite tamanho, rejeite caracteres de controle |
| API publica | Use schema validation (Zod, FastAPI, class-validator) |
| Input interno "confiavel" | Valide mesmo assim — confianca e temporaria |
| Bug de arredondamento encontrado | Trate como severidade HIGH, nao LOW |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `Math.round(userInput)` antes de operar | Rejeite se nao for inteiro |
| Truncar silenciosamente no banco | Valide antes de inserir |
| Exportar campo do usuario direto no CSV | Sanitize prefixos perigosos |
| Confiar que o Excel/Libre bloqueara formulas | O usuario pode desativar alertas de seguranca |
| Tratar validacao faltante como "bug low priority" | Todo bug de validacao e falha de seguranca potencial |
| Validar apenas no frontend | Valide sempre no backend, frontend e bonus |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
