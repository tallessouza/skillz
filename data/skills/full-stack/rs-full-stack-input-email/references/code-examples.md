# Code Examples: Input Email

## 1. Input email basico

O mais simples possivel — o navegador valida que tem `@` e dominio:

```html
<form action="">
  <input type="email" name="mail" />
  <button type="submit">Enviar</button>
</form>
```

Teste: digitar apenas "a" e submeter → navegador rejeita. Digitar "abc@a.com" → aceito.

## 2. Input email com multiple

Aceita varios emails separados por virgula:

```html
<form action="">
  <input type="email" name="mail" multiple />
  <button type="submit">Enviar</button>
</form>
```

Input valido: `abc@a.com,abc@b.com`

Na URL apos submit: `?mail=abc%40a.com%2Cabc%40b.com`

## 3. Input email com minlength

Define tamanho minimo de caracteres:

```html
<form action="">
  <input type="email" name="mail" minlength="10" />
  <button type="submit">Enviar</button>
</form>
```

- `a@a.com` (7 chars) → rejeitado, mensagem: "Please lengthen this text to 10 characters or more (you are currently using 7 characters)"
- `abcd@a.com` (10 chars) → aceito

## 4. Input email com maxlength

Limita digitacao no campo:

```html
<form action="">
  <input type="email" name="mail" maxlength="10" />
  <button type="submit">Enviar</button>
</form>
```

O navegador simplesmente para de aceitar caracteres apos 10. Nao mostra erro — apenas bloqueia.

## 5. Input email com pattern e title

Restringe a um dominio especifico com mensagem personalizada:

```html
<form action="">
  <input
    type="email"
    name="mail"
    required
    pattern=".+@skillz\.com"
    title="Emails apenas @skillz.com"
  />
  <button type="submit">Enviar</button>
</form>
```

- `abc@a.com` → rejeitado, mostra: "Please match the requested format. Emails apenas @skillz.com"
- `abc@skillz.com` → aceito

## 6. Combinacao completa

Todos os atributos juntos para um formulario robusto:

```html
<form action="">
  <label for="corporate-email">Email corporativo:</label>
  <input
    type="email"
    id="corporate-email"
    name="mail"
    required
    minlength="15"
    maxlength="255"
    pattern=".+@empresa\.com\.br"
    title="Use seu email @empresa.com.br"
  />
  <button type="submit">Enviar</button>
</form>
```

## 7. Variacoes de pattern

### Qualquer dominio .com.br
```html
pattern=".+@.+\.com\.br"
title="Apenas emails .com.br"
```

### Dominio especifico com subdominio
```html
pattern=".+@mail\.empresa\.com"
title="Use o email do mail.empresa.com"
```

### Apenas Gmail ou Hotmail
```html
pattern=".+@(gmail|hotmail)\.com"
title="Apenas Gmail ou Hotmail"
```