---
name: rs-seguranca-devs-json-serializacao-validacao
description: "Enforces safe JSON serialization and input validation when building APIs or handling user input. Use when user asks to 'parse JSON', 'receive user input', 'create an API endpoint', 'deserialize data', or 'validate request body'. Applies rules: never use eval/new Function, never use native serializers (pickle/PHP serialize), always validate input schemas, use JSON.parse for JavaScript. Make sure to use this skill whenever generating code that receives or parses external data. Not for internal data transformation, logging, or file I/O with trusted sources."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: backend-security
  tags: [security, serialization, deserialization, pickle, json, input-validation, sanitization]
---

# JSON, Serialização e Validação

> Ao receber dados externos, serialize apenas com JSON e valide rigorosamente o formato antes de processar.

## Rules

1. **Nunca use serializadores nativos da linguagem para dados externos** — não use `pickle` (Python), `PHP serialize`, `Java ObjectInputStream`, porque eles serializam métodos, classes e herança, permitindo execução de código arbitrário ao desserializar
2. **Sempre use JSON para transferência e armazenamento acessível** — JSON serializa apenas propriedades (objetos, arrays, números, strings, booleanos, null), sem possibilidade de serializar métodos ou classes
3. **Nunca use eval() ou new Function() para parsing** — porque isso permite execução de código arbitrário do input do usuário, tanto no navegador (XSS) quanto no servidor (RCE com Node.js)
4. **Use o parser JSON nativo da linguagem** — `JSON.parse()` em JS, `json.loads()` em Python, porque foram testados pela comunidade e são seguros
5. **Nunca escreva seu próprio parser JSON** — a menos que esteja criando uma linguagem de programação nova, use o parser existente da sua linguagem
6. **Sempre valide o schema do JSON recebido** — nunca aceite `dict`/`any`/`object` genérico em endpoints, porque o atacante pode injetar propriedades arbitrárias (prototype pollution, campos extras)
7. **Segurança em camadas** — valide na entrada da API mesmo que regras de negócio ou banco de dados também validem, porque cada camada diminui a superfície de ataque

## How to write

### Parsing JSON seguro (JavaScript)
```javascript
// CORRETO: usar JSON.parse
const userData = JSON.parse(inputString)

// NUNCA: eval ou new Function
// eval(`(${inputString})`)           — PROIBIDO
// new Function(`return ${input}`)()  — PROIBIDO
```

### Endpoint com validação de schema (FastAPI)
```python
from pydantic import BaseModel
from fastapi import FastAPI

class Person(BaseModel):
    name: str
    email: str

app = FastAPI()

@app.post("/person")
def save_person(person: Person) -> Person:
    # Propriedades desconhecidas são ignoradas automaticamente
    # Tipos inválidos retornam erro de validação
    return person
```

### Endpoint com validação (Express + Zod)
```typescript
import { z } from 'zod'

const personSchema = z.object({
  name: z.string(),
  email: z.string().email(),
})

app.post('/person', (req, res) => {
  const result = personSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues })
  }
  // result.data tem apenas name e email, nada mais
  savePerson(result.data)
})
```

## Example

**Before (inseguro):**
```python
@app.post("/person")
def save_person(person: dict) -> dict:
    # Aceita QUALQUER propriedade, qualquer tipo
    # Atacante pode injetar prototype pollution, campos extras
    save_to_db(person)
    return person
```

**After (com esta skill aplicada):**
```python
class Person(BaseModel):
    name: str
    email: str

@app.post("/person")
def save_person(person: Person) -> Person:
    # Propriedades extras ignoradas, tipos validados
    save_to_db(person)
    return person
```

## Heuristics

| Situação | Faça |
|----------|------|
| Recebendo JSON de API/usuário | Valide com schema tipado (Pydantic, Zod, class-validator) |
| Transferindo dados pela rede | Use JSON, nunca pickle/serialize nativo |
| Parsing de JSON em JavaScript | Use `JSON.parse()`, nunca `eval` |
| Endpoint aceita `dict`/`any` | Substitua por modelo tipado com campos explícitos |
| Retornando dados ao cliente | Também tipar o retorno para não vazar campos internos |
| Camada de negócio já valida | Valide na entrada mesmo assim — segurança em camadas |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `eval('(' + json + ')')` | `JSON.parse(json)` |
| `new Function('return ' + input)()` | `JSON.parse(input)` |
| `pickle.loads(user_data)` | `json.loads(user_data)` |
| `unserialize($userInput)` (PHP) | `json_decode($userInput)` |
| `def endpoint(data: dict)` | `def endpoint(data: TypedModel)` |
| `app.post('/x', (req) => use(req.body))` | `app.post('/x', (req) => use(schema.parse(req.body)))` |
| Parser JSON custom/artesanal | Parser nativo da linguagem |

## Troubleshooting

### Configuracao ou implementacao nao funciona como esperado
**Symptom:** Comportamento inesperado ao aplicar as regras desta skill
**Cause:** Configuracao parcial ou conflito com outras regras de seguranca
**Fix:** Verifique que todas as regras foram aplicadas em conjunto. Consulte o deep-explanation.md para entender o raciocinio completo do instrutor.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-json-serializacao-validacao/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-json-serializacao-validacao/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
