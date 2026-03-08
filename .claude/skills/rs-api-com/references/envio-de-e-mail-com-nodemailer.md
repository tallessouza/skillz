---
name: rs-api-com-bun-envio-email-nodemailer
description: "Applies Nodemailer email sending patterns when configuring SMTP transporter in Bun/Node APIs. Use when user asks to 'send email', 'configure nodemailer', 'setup email sending', 'create transactional email', or 'test email locally'. Enforces Ethereal for dev, isolated transporter in lib/mail.ts. Make sure to use this skill whenever implementing email in Bun/Node. Not for HTML templates, marketing emails, or Resend/SendGrid SDKs."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: auth
  tags: [nodemailer, email, smtp, ethereal, bun]
---

# Envio de E-mail com Nodemailer

> Transporter isolado em `lib/mail.ts`, Ethereal para dev, SMTP real para prod.

## Rules

1. **Isole transporter em `lib/mail.ts`** — centraliza configuracao
2. **Ethereal para dev** — `nodemailer.createTestAccount()` cria caixa fake
3. **Top-level await no Bun** — funciona nativamente
4. **`@types/nodemailer`** como devDependency
5. **Envie text E html** — compatibilidade
6. **`getTestMessageUrl`** para visualizar em dev

## How to write

```typescript
// lib/mail.ts
import nodemailer from 'nodemailer'
const account = await nodemailer.createTestAccount()
export const mail = nodemailer.createTransport({
  host: account.smtp.host, port: account.smtp.port,
  secure: account.smtp.secure, auth: { user: account.user, pass: account.pass },
})
```

```typescript
const info = await mail.sendMail({
  from: { name: 'App', address: 'hi@app.com' },
  to: user.email, subject: 'Auth Link',
  text: `Link: ${authLink.toString()}`,
})
console.log(nodemailer.getTestMessageUrl(info))
```

## Troubleshooting

### Ethereal timeout
**Fix:** Verifique conexao internet. Offline: hardcode credenciais de teste.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo
- [code-examples.md](references/code-examples.md) — Exemplos expandidos
