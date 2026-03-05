# Code Examples: Input Password

## Exemplo 1 — Password básico (como apresentado na aula)

```html
<input type="password" />
```

O browser mascara os caracteres digitados. Sem atributos adicionais, aceita qualquer comprimento e qualquer caractere.

## Exemplo 2 — Password com minlength e maxlength

```html
<input
  type="password"
  name="senha"
  minlength="8"
  maxlength="12"
/>
```

- Menos de 8 caracteres: browser bloqueia submit com mensagem de erro
- Mais de 12 caracteres: browser impede digitação além do limite
- Entre 8 e 12: aceito

## Exemplo 3 — Demonstração do GET expondo senha

```html
<form action="/login" method="GET">
  <input type="password" name="senha" />
  <button type="submit">Enviar</button>
</form>
```

Resultado na URL após submit:
```
/login?senha=12345678
```

A senha fica completamente visível. **Nunca use GET com passwords.**

## Exemplo 4 — Formulário correto com POST

```html
<form action="/login" method="POST">
  <input type="password" name="senha" minlength="8" maxlength="12" />
  <button type="submit">Enviar</button>
</form>
```

A URL após submit permanece limpa:
```
/login
```

Os dados vão no body da requisição HTTP.

## Exemplo 5 — Pattern hexadecimal (demonstrado na aula)

```html
<input
  type="password"
  name="senha"
  pattern="[0-9a-fA-F]{4,8}"
  minlength="8"
  maxlength="8"
  title="Apenas hexadecimal (0-9, A-F)"
/>
```

### Testes realizados na aula:

| Input | Resultado | Motivo |
|-------|-----------|--------|
| `FFFF` (4 chars) | Rejeitado | minlength exige 8 |
| `FFFFFFAC` (8 chars hex) | Aceito | 8 chars, todos hex válidos |
| `FFFFFFACS` (9 chars) | Rejeitado | maxlength limita a 8; e S não é hex |
| `12345` (5 chars) | Rejeitado | minlength exige 8 |
| `#FFFFFF` (7 chars com #) | Rejeitado | # não está em `[0-9a-fA-F]` |

## Exemplo 6 — inputmode para teclado numérico mobile

```html
<input
  type="password"
  name="pin"
  inputmode="numeric"
  pattern="[0-9]{6}"
  maxlength="6"
  title="PIN de 6 dígitos"
/>
```

Em desktop: comportamento normal.
Em mobile: abre teclado numérico ao focar no campo.

## Exemplo 7 — Formulário de login completo

```html
<form action="/auth/login" method="POST">
  <div>
    <label for="email">E-mail:</label>
    <input type="email" id="email" name="email" required />
  </div>
  <div>
    <label for="senha">Senha:</label>
    <input
      type="password"
      id="senha"
      name="senha"
      minlength="8"
      maxlength="64"
      required
      title="Senha entre 8 e 64 caracteres"
    />
  </div>
  <button type="submit">Entrar</button>
</form>
```

## Exemplo 8 — Formulário de cadastro com confirmação

```html
<form action="/auth/register" method="POST">
  <div>
    <label for="senha">Senha:</label>
    <input
      type="password"
      id="senha"
      name="senha"
      minlength="8"
      maxlength="64"
      required
    />
  </div>
  <div>
    <label for="confirmar-senha">Confirmar senha:</label>
    <input
      type="password"
      id="confirmar-senha"
      name="confirmar_senha"
      minlength="8"
      maxlength="64"
      required
    />
  </div>
  <button type="submit">Cadastrar</button>
</form>
```

## Variação — Pattern para senha alfanumérica com caractere especial

```html
<input
  type="password"
  name="senha"
  pattern="(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%]).{8,24}"
  minlength="8"
  maxlength="24"
  title="Senha com pelo menos 1 número, 1 letra e 1 caractere especial (!@#$%)"
/>
```

Este pattern usa lookaheads para garantir composição mínima — técnica mais avançada que o exemplo hexadecimal da aula, mas segue o mesmo princípio de validação frontend via regex.