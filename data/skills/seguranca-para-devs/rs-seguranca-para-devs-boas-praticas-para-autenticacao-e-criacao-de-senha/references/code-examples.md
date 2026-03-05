# Code Examples: Boas Praticas para Autenticacao e Senha

## 1. Consulta a API HaveIBeenPwned via linha de comando

```bash
# Gerar hash SHA1 da senha
echo -n "123mudar" | sha1sum
# Resultado: ABCDEF1234567890... (exemplo)

# Enviar os 5 primeiros caracteres para a API (k-anonymity)
curl https://api.pwnedpasswords.com/range/ABCDE

# O retorno e um arquivo enorme com todos os hashes que comecam com ABCDE
# Buscar o restante do hash no resultado
# Se encontrado: senha vazada N vezes
```

### Implementacao em Node.js

```typescript
import crypto from 'crypto';

async function checkPwnedPassword(password: string): Promise<boolean> {
  const sha1 = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);

  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const text = await response.text();

  return text.split('\n').some(line => line.startsWith(suffix));
}
```

### Implementacao em Python

```python
import hashlib
import requests

def check_pwned_password(password: str) -> int:
    sha1 = hashlib.sha1(password.encode()).hexdigest().upper()
    prefix, suffix = sha1[:5], sha1[5:]

    response = requests.get(f"https://api.pwnedpasswords.com/range/{prefix}")

    for line in response.text.splitlines():
        hash_suffix, count = line.split(":")
        if hash_suffix == suffix:
            return int(count)
    return 0
```

## 2. Formulario HTML completo do instrutor

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Cadastro Seguro</title>
</head>
<body>
  <form>
    <label>E-mail:
      <input type="email" name="email" required>
    </label>
    <label>Senha:
      <input type="password" name="password" required minlength="8" maxlength="64">
    </label>
    <label>Confirmar Senha:
      <input type="password" name="password_confirmation" required>
    </label>
    <button type="submit">Cadastrar</button>
  </form>

  <script src="https://cdn.jsdelivr.net/npm/zxcvbn@4.4.2/dist/zxcvbn.js"></script>
  <script>
    // Validacao de confirmacao de senha
    const password = document.querySelector('input[name="password"]');
    const confirmation = document.querySelector('input[name="password_confirmation"]');

    confirmation.addEventListener('input', function() {
      this.setCustomValidity('');
      if (this.value !== password.value) {
        this.setCustomValidity('As senhas nao coincidem');
      }
    });

    // Validacao de forca com zxcvbn
    password.addEventListener('input', function() {
      const result = zxcvbn(this.value);
      console.log(result); // crack_times, score, sequence, feedback

      if (result.score < 3) {
        this.setCustomValidity('Senha fraca. Adicione numeros, letras, caracteres especiais.');
      } else {
        this.setCustomValidity('');
      }
    });
  </script>
</body>
</html>
```

## 3. zxcvbn com user_inputs (diferencial critico)

```typescript
// SEM user_inputs — nome inventado passa como seguro
const result1 = zxcvbn('pafuncios');
// result1.score pode ser > 0 (nao esta em dicionarios publicos)

// COM user_inputs — detecta dados pessoais na senha
const result2 = zxcvbn('pafuncios', ['pafuncios@email.com', 'Pafuncios Souza']);
// result2.score = 0 (detectado como ataque de dicionario via user_inputs)
```

## 4. Objeto de retorno do zxcvbn

```typescript
const result = zxcvbn('123mudar');
// result = {
//   score: 1,              // 0-4 (0 = muito fraca, 4 = forte)
//   crack_times_display: {
//     online_throttling_100_per_hour: "...",
//     online_no_throttling_10_per_second: "...",
//     offline_slow_hashing_1e4_per_second: "...",
//     offline_fast_hashing_1e10_per_second: "..."
//   },
//   sequence: [
//     { pattern: 'dictionary', matched_word: '123mudar', ... }
//   ],
//   feedback: {
//     warning: '...',
//     suggestions: ['...']
//   }
// }
```

## 5. Validacao completa no servidor (Node.js/Express)

```typescript
import { zxcvbn } from '@zxcvbn-ts/core';

app.post('/register', async (req, res) => {
  const { email, name, password, passwordConfirmation } = req.body;

  // 1. Validar tamanho (NUNCA truncar)
  if (password.length < 8) {
    return res.status(400).json({ error: 'Senha deve ter no minimo 8 caracteres' });
  }
  if (password.length > 64) {
    return res.status(400).json({ error: 'Senha deve ter no maximo 64 caracteres' });
  }

  // 2. Validar confirmacao
  if (password !== passwordConfirmation) {
    return res.status(400).json({ error: 'Senhas nao coincidem' });
  }

  // 3. Validar forca com zxcvbn (passando dados do usuario)
  const strengthResult = zxcvbn(password, [email, name]);
  if (strengthResult.score < 3) {
    return res.status(400).json({
      error: 'Senha muito fraca',
      feedback: strengthResult.feedback
    });
  }

  // 4. Verificar vazamento
  const leakCount = await checkPwnedPassword(password);
  if (leakCount > 0) {
    return res.status(400).json({
      error: `Senha encontrada em ${leakCount} vazamentos. Escolha outra.`
    });
  }

  // 5. Hash seguro e persistencia (tema da proxima aula)
  const hash = await bcrypt.hash(password, 12);
  await db.createUser({ email, name, passwordHash: hash });

  return res.status(201).json({ message: 'Usuario criado com sucesso' });
});
```

## 6. Comparativo de tempos de quebra (7 vs 8 caracteres)

```
Senha de 7 caracteres (com especiais, numeros, maiusculas):
  Online (100/h):     11 anos
  Online (sem limite): 12 dias
  Offline (slow hash): 17 minutos
  Offline (hash fraco): < 1 segundo

Senha de 8 caracteres (mesma composicao):
  Online (100/h):     4 meses+
  Offline (slow hash): 3 horas

→ Um unico caractere a mais transforma 17 min em 3 horas
→ Minimo de 8 e o ponto de inflexao custo/beneficio
```