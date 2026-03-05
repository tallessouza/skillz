---
name: rs-api-com-bun-envio-email-nodemailer
description: "Applies Nodemailer email sending patterns when configuring transporter, test accounts, or sendMail in Node/Bun APIs. Use when user asks to 'send email', 'configure nodemailer', 'setup email sending', 'create auth link email', or 'test email locally'. Follows Ethereal test account pattern for dev, production-ready transporter for deploy. Make sure to use this skill whenever implementing email functionality in Node.js or Bun projects. Not for HTML template design, marketing emails, or third-party email API wrappers like Resend/SendGrid SDKs."
---

# Envio de E-mail com Nodemailer

> Configure o Nodemailer com transporter separado em `lib/mail.ts`, use Ethereal para desenvolvimento e SMTP real para producao.

## Rules

1. **Isole o transporter em `lib/mail.ts`** — exporte como `mail`, porque centraliza configuracao e facilita troca entre dev/prod
2. **Use Ethereal para desenvolvimento** — `nodemailer.createTestAccount()` cria caixa fake sem precisar configurar servico externo
3. **Use top-level await no Bun** — Bun suporta nativamente, entao `await` fora de funcao async funciona sem problema
4. **Instale tipagens separadas** — `@types/nodemailer` como devDependency, porque o pacote nao inclui tipos
5. **Envie texto E HTML** — em producao, sempre envie ambas as versoes do email para compatibilidade com clientes de email
6. **Use `getTestMessageUrl` para visualizar** — em dev, logue a URL do Ethereal para abrir o email no navegador

## How to write

### Transporter (lib/mail.ts)

```typescript
import nodemailer from 'nodemailer'

const account = await nodemailer.createTestAccount()

const transporter = nodemailer.createTransport({
  host: account.smtp.host,
  port: account.smtp.port,
  secure: account.smtp.secure,
  debug: true,
  auth: {
    user: account.user,
    pass: account.pass,
  },
})

export const mail = transporter
```

### Envio de email com link de autenticacao

```typescript
import nodemailer from 'nodemailer'
import { mail } from '../lib/mail'

const info = await mail.sendMail({
  from: {
    name: 'PizzaShop',
    address: 'hi@pizzashop.com',
  },
  to: user.email,
  subject: 'Authenticate to Pizza Shop',
  text: `Use the following link to authenticate on Pizza Shop: ${authLink.toString()}`,
})

console.log(nodemailer.getTestMessageUrl(info))
```

## Example

**Before (email nao implementado):**
```typescript
// Send auth link
// TODO: send email
```

**After (com Nodemailer configurado):**
```typescript
import nodemailer from 'nodemailer'
import { mail } from '../lib/mail'

const info = await mail.sendMail({
  from: { name: 'PizzaShop', address: 'hi@pizzashop.com' },
  to: user.email,
  subject: 'Authenticate to Pizza Shop',
  text: `Use the following link to authenticate on Pizza Shop: ${authLink.toString()}`,
})

// Dev only — visualizar email no Ethereal
console.log(nodemailer.getTestMessageUrl(info))
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Desenvolvimento local | Use Ethereal via `createTestAccount` + `getTestMessageUrl` |
| Producao | Configure SMTP real ou servico como Resend/SES |
| Email transacional (auth, reset) | Envie `text` + `html` |
| From address | Use objeto `{ name, address }` para separar nome do endereco |
| Tipagens faltando | Instale `@types/nodemailer` como devDependency |
| Bun project | Top-level await funciona, nao precisa wrapper async |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Configurar transporter inline na rota | Isolar em `lib/mail.ts` e exportar como `mail` |
| Usar servico pago para testar em dev | Usar Ethereal (gratuito, sem configuracao) |
| Enviar apenas HTML sem texto | Enviar `text` e `html` juntos |
| Ignorar retorno do `sendMail` | Logar `getTestMessageUrl(info)` em dev |
| Hardcodar credenciais SMTP | Usar env vars para host/port/user/pass em prod |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/api-com/rs-api-com-bun-envio-de-e-mail-com-nodemailer/references/deep-explanation.md)
- [Code examples](../../../data/skills/api-com/rs-api-com-bun-envio-de-e-mail-com-nodemailer/references/code-examples.md)
