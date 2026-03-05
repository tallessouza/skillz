---
name: rs-seguranca-devs-boas-praticas-auth-senha
description: "Enforces authentication and password security best practices when building login systems. Use when user asks to 'create login', 'implement authentication', 'build signup form', 'validate password', 'hash password', or any auth-related feature. Applies rules: separate admin/user logins, enforce HTTPS, min 8 max 64 chars, check leaked passwords via HaveIBeenPwned API, use zxcvbn for strength scoring, server-side validation mandatory. Make sure to use this skill whenever implementing any authentication flow, even if user doesn't mention security. Not for JWT/session management, OAuth flows, or password storage/hashing (separate topic)."
---

# Boas Praticas para Autenticacao e Senha

> Toda autenticacao com login e senha deve separar usuarios administrativos de publicos, exigir HTTPS, e validar forca de senha no servidor com zxcvbn e verificacao de vazamentos.

## Rules

1. **Separe logins administrativos de usuarios publicos** — sistemas diferentes, tabelas diferentes, porque misturar permite escalonamento de privilegios e ataques cruzados
2. **Nunca crie usuarios de sistema (AD/SSH) a partir de cadastro publico** — usuario publico existe apenas no banco de dados da aplicacao, porque dar acesso ao AD a qualquer pessoa na internet e catastrofico
3. **Exija HTTPS em todo o fluxo de autenticacao** — todo trafego sem HTTPS pode ser lido por qualquer intermediario (admin de rede, provedor, roteador comprometido)
4. **Minimo 8 caracteres, maximo 64** — 8 porque a diferenca de 7 para 8 caracteres transforma um ataque de 17 minutos em 3 horas; 64 porque evita ataques de negacao de servico via hash de senhas enormes
5. **Valide todas as restricoes no servidor** — maxlength no formulario nao protege nada, atacante remove ou faz POST direto sem passar pelo frontend
6. **Nunca trunque senhas** — se exceder o maximo, rejeite com erro; truncar causa divergencia entre senha cadastrada e senha que o usuario lembra
7. **Verifique senhas vazadas via HaveIBeenPwned API** — porque pessoas reutilizam login+senha em varios sites e combinacoes vazadas serao testadas por atacantes
8. **Use zxcvbn para medir forca real da senha** — score minimo 3; passe dados do usuario (nome, email) como user_inputs para detectar senhas derivadas de dados pessoais

## How to write

### Validacao de senha no frontend com zxcvbn

```html
<script src="https://cdn.jsdelivr.net/npm/zxcvbn@4.4.2/dist/zxcvbn.js"></script>
<script>
document.querySelector('input[name="password"]')
  .addEventListener('input', function() {
    const password = this.value;
    const userInputs = [
      document.querySelector('input[name="email"]').value,
      document.querySelector('input[name="name"]').value
    ];
    const result = zxcvbn(password, userInputs);
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
# 2. Enviar os 5 primeiros caracteres para a API
curl https://api.pwnedpasswords.com/range/XXXXX
# 3. Buscar o restante do hash no resultado
# Se encontrado → senha vazada → rejeitar
```

### Atributos do formulario

```html
<input type="email" name="email" required>
<input type="password" name="password" required minlength="8" maxlength="64">
<input type="password" name="password_confirmation" required>
```

## Example

**Before (inseguro):**
```typescript
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  const hash = md5(password); // hash fraco
  db.createUser(email, hash);
});
```

**After (com esta skill aplicada):**
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

  // Hash seguro (ver aula de armazenamento)
  const hash = await bcrypt.hash(password, 12);
  await db.createUser({ email, passwordHash: hash });
});
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Sistema tem usuarios admin e publicos | Separar em tabelas/sistemas distintos |
| Formulario de login | Verificar HTTPS obrigatorio |
| Campo de senha no frontend | Adicionar zxcvbn + user_inputs com dados do usuario |
| Cadastro de senha no backend | Validar min/max + zxcvbn + HaveIBeenPwned |
| Senha excede 64 chars | Rejeitar com erro, nunca truncar |
| User ID na tabela de usuarios | Preferir UUID/ULID, evitar sequencial (previne enumeracao) |
| Email como login | Considerar impacto de troca de email futura |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Validar senha apenas no frontend | Validar no servidor (frontend e bypass trivial) |
| `maxlength="64"` sem validacao server | Validar tamanho no servidor |
| Truncar senha silenciosamente | Rejeitar com mensagem de erro |
| Aceitar qualquer senha >= 8 chars | Verificar forca com zxcvbn (score >= 3) |
| Ignorar senhas vazadas | Consultar HaveIBeenPwned API |
| Admin e usuario na mesma tabela | Separar sistemas de autenticacao |
| Cadastro publico cria usuario no AD | Usuario publico so existe no banco da aplicacao |
| User ID sequencial (1, 2, 3) | UUID ou identificador nao previsivel |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
