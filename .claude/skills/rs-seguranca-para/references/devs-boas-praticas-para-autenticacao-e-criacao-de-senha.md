---
name: rs-seguranca-devs-boas-praticas-auth-senha
description: "Enforces authentication and password security best practices when building login systems or signup flows. Use when user asks to 'create login', 'implement authentication', 'build signup form', 'validate password', 'hash password', 'check password strength', or any auth-related feature. Applies rules: separate admin/user logins, enforce HTTPS, min 8 max 64 chars, check leaked passwords via HaveIBeenPwned k-anonymity API, use zxcvbn for strength scoring with user_inputs, server-side validation mandatory. Make sure to use this skill whenever implementing any authentication flow, even if user does not mention security. Not for JWT/session management (use devs-sobre-sessoes), OAuth flows, or password storage/hashing (use devs-seguranca-no-armazenamento-de-senhas)."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: authentication
  tags: [security, authentication, password, zxcvbn, haveibeenpwned, login, signup]
---

# Boas Praticas para Autenticacao e Senha

> Toda autenticacao com login e senha deve separar usuarios administrativos de publicos, exigir HTTPS, e validar forca de senha no servidor com zxcvbn e verificacao de vazamentos.

## Rules

1. **Separe logins administrativos de usuarios publicos** — sistemas diferentes, tabelas diferentes, porque misturar permite escalonamento de privilegios e ataques cruzados
2. **Nunca crie usuarios de sistema (AD/SSH) a partir de cadastro publico** — usuario publico existe apenas no banco de dados da aplicacao, porque dar acesso ao AD a qualquer pessoa na internet e catastrofico
3. **Exija HTTPS em todo o fluxo de autenticacao** — todo trafego sem HTTPS pode ser lido por qualquer intermediario (admin de rede, provedor, roteador comprometido)
4. **Minimo 8 caracteres, maximo 64** — 8 porque a diferenca de 7 para 8 caracteres transforma um ataque de 17 minutos em 3 horas; 64 porque evita DoS via hash de senhas enormes
5. **Valide todas as restricoes no servidor** — maxlength no formulario nao protege nada, atacante remove ou faz POST direto sem passar pelo frontend
6. **Nunca trunque senhas** — se exceder o maximo, rejeite com erro; truncar causa divergencia entre senha cadastrada e senha que o usuario lembra
7. **Verifique senhas vazadas via HaveIBeenPwned API** — usando k-anonymity (envie apenas 5 chars do SHA1), porque pessoas reutilizam login+senha e combinacoes vazadas serao testadas
8. **Use zxcvbn para medir forca real da senha** — score minimo 3; passe dados do usuario (nome, email) como user_inputs para detectar senhas derivadas de dados pessoais

## How to write

### Validacao de senha no frontend com zxcvbn

```html
<script src="https://cdn.jsdelivr.net/npm/zxcvbn@4.4.2/dist/zxcvbn.js"></script>
<script>
document.querySelector('input[name="password"]')
  .addEventListener('input', function() {
    const userInputs = [
      document.querySelector('input[name="email"]').value,
      document.querySelector('input[name="name"]').value
    ];
    const result = zxcvbn(this.value, userInputs);
    if (result.score < 3) {
      this.setCustomValidity('Senha fraca. Adicione mais caracteres variados.');
    } else {
      this.setCustomValidity('');
    }
  });
</script>
```

### Verificacao de vazamento via HaveIBeenPwned API

```bash
# 1. Gerar hash SHA1 da senha
echo -n "senha123" | sha1sum
# 2. Enviar os 5 primeiros caracteres para a API (k-anonymity)
curl https://api.pwnedpasswords.com/range/XXXXX
# 3. Buscar o restante do hash no resultado — se encontrado, senha vazada
```

### Validacao completa no servidor

```typescript
app.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (password.length < 8 || password.length > 64) {
    return res.status(400).json({ error: 'Senha deve ter entre 8 e 64 caracteres' });
  }
  const zxcvbnResult = zxcvbn(password, [email, name]);
  if (zxcvbnResult.score < 3) {
    return res.status(400).json({ error: 'Senha muito fraca' });
  }
  const isLeaked = await checkPwnedPassword(password);
  if (isLeaked) {
    return res.status(400).json({ error: 'Senha encontrada em vazamentos conhecidos' });
  }
  const hash = await bcrypt.hash(password, 12);
  await db.createUser({ email, passwordHash: hash });
});
```

## Example

**Before (inseguro):**
```typescript
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  const hash = md5(password);
  db.createUser(email, hash);
});
```

**After (com esta skill aplicada):**
```typescript
app.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  // Validacao server-side: tamanho + forca + vazamento
  if (password.length < 8 || password.length > 64) return res.status(400).json({ error: 'Tamanho invalido' });
  if (zxcvbn(password, [email, name]).score < 3) return res.status(400).json({ error: 'Senha fraca' });
  if (await checkPwnedPassword(password)) return res.status(400).json({ error: 'Senha vazada' });
  const hash = await bcrypt.hash(password, 12);
  await db.createUser({ email, passwordHash: hash });
});
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Validar senha apenas no frontend | Validar no servidor (frontend e bypass trivial) |
| Truncar senha silenciosamente | Rejeitar com mensagem de erro |
| Aceitar qualquer senha >= 8 chars | Verificar forca com zxcvbn (score >= 3) |
| Ignorar senhas vazadas | Consultar HaveIBeenPwned API |
| Admin e usuario na mesma tabela | Separar sistemas de autenticacao |
| User ID sequencial (1, 2, 3) | UUID ou identificador nao previsivel |

## Troubleshooting

### zxcvbn aceita senha fraca com score 3
**Symptom:** Senha como "Password1!" passa com score 3 mas parece fraca
**Cause:** zxcvbn mede entropia real, nao regras arbitrarias. Sem user_inputs, nao detecta dados pessoais
**Fix:** Sempre passe dados do usuario (nome, email, username) como segundo parametro: `zxcvbn(password, [email, name])`

### HaveIBeenPwned API retorna muitos resultados
**Symptom:** Resposta da API contem milhares de hashes
**Cause:** A API retorna todos os hashes que compartilham os mesmos 5 primeiros caracteres (k-anonymity)
**Fix:** Faca substring match do restante do hash SHA1 na resposta. Se encontrar, a senha esta vazada.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-boas-praticas-para-autenticacao-e-criacao-de-senha/references/deep-explanation.md) — Diferenca entre 7 e 8 caracteres em tempo de ataque, k-anonymity do HaveIBeenPwned, por que separar admin de publico
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-boas-praticas-para-autenticacao-e-criacao-de-senha/references/code-examples.md) — Implementacao completa de zxcvbn, HaveIBeenPwned API, formulario HTML
