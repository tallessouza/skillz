---
name: rs-seguranca-devs-serializacao
description: "Guards against insecure deserialization vulnerabilities when writing backend code in Python, PHP, Java, or Node.js. Use when user asks to 'serialize objects', 'persist state', 'save objects to disk', 'pickle data', 'unserialize input', or uses pickle/serialize/marshal in code. Ensures serialized data never crosses trust boundaries. Make sure to use this skill whenever code deserializes data from any external source. Not for JSON parsing, API response handling, or database ORM operations."
---

# Serialização Segura em Backend

> Nunca desserialize dados que cruzaram fronteiras de confiança — serialização é uma porta direta para execução de código arbitrário.

## Rules

1. **Prefira não usar serialização nativa** — use JSON, Protocol Buffers ou MessagePack, porque formatos nativos (pickle, PHP serialize, Java ObjectInputStream) permitem instanciar classes arbitrárias durante a desserialização
2. **Serialização nunca cruza fronteiras de confiança** — dados serializados não vão para S3, banco de dados, rede, ou qualquer lugar acessível ao usuário, porque um payload modificado permite execução remota de código (RCE)
3. **Se usar, mantenha dentro do processo** — serialize e deserialize apenas dentro da mesma aplicação, no mesmo servidor, sem persistência externa, porque qualquer ponto de armazenamento externo é um vetor de ataque
4. **Nunca desserialize input do usuário** — dados vindos de request body, query params, cookies, headers ou uploads nunca passam por unserialize/pickle.loads/ObjectInputStream, porque o atacante controla o payload
5. **Use allowlists de classes quando inevitável** — em Java use ObjectInputFilter, em PHP use allowed_classes, porque sem filtro qualquer classe do classpath pode ser instanciada
6. **Audite dependências que desserializam** — bibliotecas como Prevayler, cache engines, session stores podem usar serialização internamente, porque o risco é transitivo

## How to write

### Python — NUNCA pickle de fonte externa

```python
import json

# CORRETO: usar JSON para dados que cruzam fronteiras
def save_state(data: dict, path: str) -> None:
    with open(path, "w") as f:
        json.dump(data, f)

def load_state(path: str) -> dict:
    with open(path, "r") as f:
        return json.load(f)
```

### PHP — NUNCA unserialize de input

```php
// CORRETO: usar json_decode para dados externos
$data = json_decode(file_get_contents('data.json'), true);

// Se PRECISA usar serialize internamente:
// allowed_classes restringe quais classes podem ser instanciadas
$obj = unserialize($trustedData, ['allowed_classes' => [MyClass::class]]);
```

### Validação antes de desserializar (quando inevitável)

```python
import hmac
import hashlib

SECRET_KEY = b"server-only-secret"

def serialize_with_signature(data: bytes) -> bytes:
    signature = hmac.new(SECRET_KEY, data, hashlib.sha256).hexdigest()
    return f"{signature}:{data.hex()}".encode()

def deserialize_with_verification(signed_data: bytes) -> bytes:
    sig, data_hex = signed_data.decode().split(":", 1)
    data = bytes.fromhex(data_hex)
    expected = hmac.new(SECRET_KEY, data, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(sig, expected):
        raise ValueError("Serialized data was tampered with")
    return data
```

## Example

**Before (vulnerável — pickle de fonte externa):**

```python
import pickle

def load_user_session(session_file: str):
    with open(session_file, "rb") as f:
        return pickle.load(f)  # RCE se arquivo foi modificado
```

**After (seguro — JSON com validação):**

```python
import json
from pathlib import Path

def load_user_session(session_file: str) -> dict:
    path = Path(session_file)
    if not path.exists():
        return {}
    with open(path, "r") as f:
        return json.load(f)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Persistir estado de objetos para disco | Usar JSON/MessagePack, reconstruir objetos no load |
| Cache de objetos complexos | Redis com JSON, não pickle |
| Comunicação entre serviços | JSON, Protocol Buffers, ou MessagePack |
| Session store | Framework nativo (signed cookies), nunca serialize manual |
| Dados que NUNCA saem do processo | Pickle/serialize aceitável com cautela |
| Prevayler/object prevalence pattern | Garantir que storage é local e inacessível externamente |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `pickle.load(request.files['data'])` | `json.load(request.files['data'])` |
| `unserialize($_POST['data'])` | `json_decode($_POST['data'], true)` |
| `pickle.loads(redis.get('key'))` | `json.loads(redis.get('key'))` |
| `ObjectInputStream(socket.getInputStream())` | Protobuf/JSON parser com schema |
| `pickle.dump(obj, s3_file)` | `json.dump(obj.__dict__, s3_file)` |
| `unserialize($data)` sem allowed_classes | `unserialize($data, ['allowed_classes' => [Safe::class]])` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
