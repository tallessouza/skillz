# Code Examples: Input Validation

## Exemplo 1: Ataque de arredondamento em transferencias

### Setup inicial

```javascript
// Saldos em memoria (representando um banco de dados com campo inteiro)
const balances = {
  alice: 100,
  bob: 1,
  laranja: 0,
};
```

### Funcao vulneravel

```javascript
function transfer(from, to, amount) {
  // PROBLEMA: arredondar silenciosamente em vez de rejeitar
  balances[from] -= Math.round(amount);
  balances[to] += Math.round(amount);
  console.log(`Transferencia de ${amount} de ${from} para ${to} realizada com sucesso`);
}
```

### Transferencia normal (parece funcionar)

```javascript
transfer("alice", "bob", 50);
console.log(balances);
// { alice: 50, bob: 51, laranja: 0 }
// Tudo certo ate aqui
```

### Transferencia com valor fracionario (exploit)

```javascript
transfer("alice", "bob", 0.5);
console.log(balances);
// { alice: 100, bob: 2, laranja: 0 }
// Alice NAO perdeu dinheiro, Bob GANHOU 1 credito do nada
```

### Exploit sistematico (100 iteracoes)

```javascript
for (let i = 0; i < 100; i++) {
  transfer("alice", "bob", 0.5);   // Bob ganha 1, Alice perde 0
  transfer("bob", "laranja", 1);    // Bob passa 1 para Laranja
}
console.log(balances);
// { alice: 100, bob: 1, laranja: 100 }
// 100 creditos criados do nada!
```

### Funcao corrigida

```javascript
function transfer(from, to, amount) {
  if (amount !== parseInt(amount)) {
    console.log("Valor invalido: apenas valores inteiros sao permitidos");
    return;
  }
  balances[from] -= amount;
  balances[to] += amount;
  console.log(`Transferencia de ${amount} de ${from} para ${to} realizada com sucesso`);
}

transfer("alice", "bob", 0.5);
// "Valor invalido: apenas valores inteiros sao permitidos"
// Saldos permanecem inalterados
```

## Exemplo 2: CSV/Excel Injection

### CSV malicioso

```csv
nome;valor;descricao
Alice;100;conta normal
Bob;1;=WEBSERVICE("https://ifconfig.me")
```

Quando aberto no LibreOffice/Excel:
- O campo `descricao` do Bob executa uma requisicao HTTP
- Retorna o IP do usuario para o atacante
- Funcoes mais perigosas podem executar scripts arbitrarios

### Sanitizacao de campos para CSV

```javascript
function sanitizeForCsv(value) {
  if (typeof value !== "string") return String(value);
  
  const dangerousPrefixes = ["=", "+", "-", "@", "\t", "\r"];
  if (dangerousPrefixes.some((prefix) => value.startsWith(prefix))) {
    return `'${value}`; // Aspas simples neutraliza a formula
  }
  return value;
}

// Uso ao gerar CSV:
function generateCsv(rows, headers) {
  const headerLine = headers.join(";");
  const dataLines = rows.map((row) =>
    headers.map((h) => sanitizeForCsv(row[h])).join(";")
  );
  return [headerLine, ...dataLines].join("\n");
}
```

## Exemplo 3: Validacao com TypeScript + Zod (aplicacao real)

```typescript
import { z } from "zod";

// Schema define o contrato — entrada invalida NUNCA passa
const TransferInput = z.object({
  from: z.string().min(1, "Origem obrigatoria"),
  to: z.string().min(1, "Destino obrigatorio"),
  amount: z
    .number()
    .int("Apenas valores inteiros")
    .positive("Valor deve ser positivo"),
});

type TransferInput = z.infer<typeof TransferInput>;

function transfer(raw: unknown) {
  const input = TransferInput.parse(raw); // Lanca ZodError se invalido
  
  if (balances[input.from] < input.amount) {
    throw new Error("Saldo insuficiente");
  }
  
  balances[input.from] -= input.amount;
  balances[input.to] += input.amount;
}

// Entrada invalida rejeitada automaticamente:
transfer({ from: "alice", to: "bob", amount: 0.5 });
// ZodError: "Apenas valores inteiros"
```

## Exemplo 4: FastAPI com validacao automatica (mencionado pelo instrutor)

```python
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI()

class TransferRequest(BaseModel):
    origin: str = Field(min_length=1)
    destination: str = Field(min_length=1)
    amount: int = Field(gt=0)  # Inteiro positivo, validado automaticamente

@app.post("/transfer")
def transfer(req: TransferRequest):
    # Se chegou aqui, input ja esta validado
    # 0.5 nunca chegaria — FastAPI retorna 422 automaticamente
    process_transfer(req.origin, req.destination, req.amount)
```